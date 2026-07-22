#!/bin/bash
set -e  # 遇到错误就停止
set -x  # 开启调试模式，显示执行的每一条命令

# ──────────────────────────────────────────────────────────────────────────
# Docker Compose 生命周期与路径问题说明
#
# 1. label 匹配机制
#    `docker compose up` 会给容器打多个 label，用于后续管理：
#      - com.docker.compose.project       → 项目名（默认 = 工作目录基名）
#      - com.docker.compose.project.working_dir → 执行 up 时的 PWD
#      - com.docker.compose.config_files  → 使用的配置文件路径
#    `docker compose down` 查找容器时，上述三个 label **全部参与匹配**，
#    任一不匹配则找不到容器。
#
# 2. 软链接的隐患
#    从符号链接路径 vs 实际路径执行 compose，PWD 和目录基名均不同：
#    a) project label 差异 → 目录基名不同，down 找不到容器
#    b) working_dir label 差异 → 路径不同，down 找不到容器
#    c) 卷绑定：docker-compose.yml 中的 .:/home/node/app 绑定的是
#       up 时的实际绝对路径。从软链接 up 则容器里看到的是软链接路径
#       下的文件，而非实际路径，导致文件修改不同步。
#
# 3. 双重修复
#    - readlink -f：将脚本和工作目录统一到实际路径，修复 working_dir
#      和卷绑定
#    - -p 固定项目名：强制 project label 为 santic-revamp-cms，
#      修复 project label 差异
#    两者缺一不可。
# ──────────────────────────────────────────────────────────────────────────

# 强制切换到符号链接的实际目标路径（卷绑定也跟随修复）
# cd "$(dirname "$(realpath "$0")")"
cd "$(dirname "$(readlink -f "$0")")"

git pull

# 自动获取Git提交哈希
if [ -d .git ]; then
    SHORT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    echo "当前Git提交: $SHORT_SHA"
else
    SHORT_SHA="unknown"
    echo "警告: 不是Git仓库，使用默认标签"
fi

# RELEASE_NAME="release-${SHORT_SHA}"
IMAGE_TAG="sha-${SHORT_SHA}"
echo "将构建镜像: santic-revamp-cms:${IMAGE_TAG}"

# 本地构建镜像
echo "=== 检查/设置Docker Buildx构建器 ==="
# docker buildx create --name santic-builder --use >/dev/null 2>&1 || docker buildx use santic-builder

# 1. 先检查构建器是否已存在
if docker buildx inspect santic-builder >/dev/null 2>&1; then
    echo "✓ 构建器 'santic-builder' 已存在，切换到该构建器..."
    docker buildx use santic-builder
else
    echo "⚠ 构建器 'santic-builder' 不存在，正在创建..."
    docker buildx create --name santic-builder --use
fi

# 2. 验证当前构建器
CURRENT_BUILDER=$(docker buildx ls | grep '*' | awk '{print $1}')
echo "当前使用的构建器: $CURRENT_BUILDER"

# 3. 初始化构建器（确保它已启动）
echo "初始化构建器..."
docker buildx inspect --bootstrap

echo "================ 开始构建Docker镜像 ================"

if docker image inspect "santic-revamp-cms:${IMAGE_TAG}" > /dev/null 2>&1; then
    echo "镜像 santic-revamp-cms:${IMAGE_TAG} 已存在，跳过构建"
else
    docker buildx build \
    --platform linux/amd64 \
    -f Dockerfile-prd \
    -t "santic-revamp-cms:${IMAGE_TAG}" \
    -t "santic-revamp-cms:latest" \
    --load \
    .

    echo ""
    echo "======== 构建完成 ========"
    echo "已创建的镜像:"
    docker images | grep santic-revamp-cms
fi

echo "=============重启UAT环境==============="

# 先停掉正在运行的容器
docker compose -p santic-revamp-cms -f docker-compose-uat.yml down
sleep 2
# 启动容器
docker compose -p santic-revamp-cms -f docker-compose-uat.yml up -d

# 确保 latest 指向当前版本
docker tag "santic-revamp-cms:${IMAGE_TAG}" santic-revamp-cms:latest

# 只保留最新的3个 sha-* 标签，跳过正在被容器使用的镜像
# -k2,3 -r：以第2个字段到第3个字段作为排序键（而不是默认从第1字段开始）。且反向排序（从大到小/从新到旧）。
# head -n 5：仅保留最近5个镜像

keep_tags=$(docker image ls santic-revamp-cms --format '{{.Tag}} {{.CreatedAt}}' \
    | grep '^sha-' \
    | sort -k2,3 -r \
    | awk '{print $1}' \
    | head -n 5)

docker image ls santic-revamp-cms --format '{{.Repository}}:{{.Tag}}' \
    | grep ':sha-' \
    | while read fulltag; do
        tag="${fulltag#*:}"
        if ! echo "$keep_tags" | grep -q -F "$tag"; then
            # 尝试删除，但如果被容器占用则跳过并提示
            docker rmi "$fulltag" 2>/dev/null || echo "跳过 $fulltag（可能仍被容器占用）"
        fi
    done

# 使用 --env=prod 参数触发生产环境容器重启
# 循环每个命令行参数，查找是否有--env=开头的参数。如果有，则提取--env=之后的字符串，并转小写，判断其是否等于prod。
# 针对prod分支，执行针对生产环境的操作逻辑。
for arg in "$@"; do
    if [[ $arg == --env=* ]]; then
        env_value=${arg#--env=}
        env_value=$(echo "$env_value" | tr '[:upper:]' '[:lower:]')
        if [ "$env_value" = "prod" ]; then
            # 针对prod分支，执行针对生产环境的操作逻辑。
            echo "=====重启PROD环境====使用镜像: santic-revamp-cms:${IMAGE_TAG}======"
            # 先停掉正在运行的容器
            docker compose -p santic-revamp-cms -f docker-compose-prd.yml down
            sleep 2
            # 启动容器
            docker compose -p santic-revamp-cms -f docker-compose-prd.yml up -d
        fi
    fi
done
