---
title: "Docker CI/CD"
description: "基于 Docker 的持续集成与持续部署参考实现（多阶段构建、Compose 多环境）"
tags: ["Docker", "CI/CD", "DevOps"]
order: 1
---

# CI/CD — Docker 容器化持续集成与持续部署

## 概述

本目录提供一套基于 Docker 容器技术的 CI/CD 参考实现，涵盖**构建**、**部署**和**生命周期管理**三个环节。以 Next.js 应用（santic-revamp-cms）为例，展示如何通过 Docker 多阶段构建优化镜像体积，并借助 Docker Compose 实现多环境（UAT / PROD）的快速发布与回滚。

## 目录结构

| 文件 | 说明 |
|------|------|
| `Dockerfile-prd` | 生产环境 Docker 镜像定义（多阶段构建） |
| `docker-compose-uat.yml` | UAT（预发布）环境编排 |
| `docker-compose-prd.yml` | 生产环境编排 |
| `update.sh` | 一键部署脚本：拉取代码 → 构建镜像 → 重启容器 |

## 工作流程

```
Git Push → update.sh
              │
              ├── git pull（拉取最新代码）
              ├── 获取 Git Commit SHA 作为镜像标签（sha-<short-sha>）
              ├── 使用 Buildx 构建 linux/amd64 镜像
              ├── 打双标签：sha-<short-sha> + latest
              ├── 重启 UAT 容器（默认）
              └── 如果传入 --env=prod，额外重启 PROD 容器
```

### 1. 镜像构建（Dockerfile-prd）

采用**多阶段构建**（multi-stage build），共三个阶段：

| 阶段 | 用途 |
|------|------|
| `base` | Node.js 22 Alpine 基础镜像 |
| `deps` | 安装项目依赖（支持 yarn / npm / pnpm） |
| `builder` | 执行 Next.js 构建，生成 `.next/standalone` |
| `runner` | 拷贝产物、创建非 root 用户、运行生产服务 |

**关键特性：**

- 最终镜像仅包含运行产物和 `node_modules`，不含源码和构建工具链，大幅缩减镜像体积
- 使用 `next.config.js` 的 `output: 'standalone'` 模式
- 以 `nextjs` 非 root 用户运行，增强安全性

### 2. 环境分离

| 环境 | Compose 文件 | 端口 | 环境变量文件 | 用途 |
|------|-------------|------|------------|------|
| UAT | `docker-compose-uat.yml` | 3000 | `.env.uat` | 预发布验证 |
| PROD | `docker-compose-prd.yml` | 3001 | `.env` | 生产运行 |

- 两个环境共享同一镜像标签，仅通过**环境变量文件**区分配置
- 日志策略统一：JSON 文件驱动，单文件最大 10 MB，保留最近 3 个文件

### 3. 部署脚本（update.sh）

`update.sh` 是 CI/CD 的核心入口，在部署服务器上执行。其主要功能：

**构建阶段：**
- 自动切换到脚本所在目录的实际路径（通过 `readlink -f` 解决软链接路径问题）
- 获取最新代码（`git pull`）
- 读取当前 Git Commit 的短哈希作为镜像标签
- 使用 Docker Buildx 创建/复用构建器，执行跨平台构建（`linux/amd64`）

**部署阶段：**
- 为镜像打 `sha-<short-sha>` 和 `latest` 双标签
- 默认重启 UAT 容器
- 传入 `--env=prod` 参数时额外重启 PROD 容器
- 镜像清理：仅保留最近 5 个 `sha-*` 标签的镜像，自动跳过正在被容器使用的镜像

**路径兼容性说明：**
- 脚本中使用 `-p` 参数固定项目名，避免因工作目录差异导致 `docker compose down` 找不到容器
- 使用 `readlink -f` 解析实际路径，确保卷绑定同步正确

## 快速开始

### 前置条件

- Docker Engine ≥ 24.x
- Docker Buildx 插件
- Git

### 使用

```bash
# 仅部署 UAT 环境
cd docker/cicd
./update.sh

# 同时部署 UAT 和 PROD 环境
cd docker/cicd
./update.sh --env=prod
```

### 手动操作

```bash
# 构建镜像（不运行部署）
docker buildx build --platform linux/amd64 -f Dockerfile-prd -t santic-revamp-cms:latest --load .

# 启动 UAT 环境
docker compose -p santic-revamp-cms -f docker-compose-uat.yml up -d

# 启动 PROD 环境
docker compose -p santic-revamp-cms -f docker-compose-prd.yml up -d

# 查看运行状态
docker compose -p santic-revamp-cms ps

# 查看日志
docker compose -p santic-revamp-cms logs -f

# 停止环境
docker compose -p santic-revamp-cms -f docker-compose-uat.yml down
```

## 最佳实践

1. **镜像标签策略**：使用 `sha-<git-commit>` 作为唯一标识，`latest` 作为便捷入口，确保每次部署可追溯
2. **多环境复用镜像**：同一镜像通过不同 env_file 区分配置，避免环境间镜像不一致
3. **日志轮转**：所有容器必须配置 `max-size` 和 `max-file`，防止磁盘写满
4. **镜像清理**：定期清理旧版本镜像，保留最近 3-5 个版本以便快速回滚
5. **固定项目名**：在 `docker compose` 命令中始终使用 `-p` 参数指定项目名，避免路径问题导致的容器管理混乱

## 注意事项

- 构建时需确保 Dockerfile 与项目根目录的 `.next` 输出配置一致
- `.env.uat` 和 `.env` 文件需提前在服务器上准备好，不纳入版本控制
- 本方案适用于单机部署场景；多节点场景建议配合 Harbor 私有镜像仓库实现拉取部署
- 私有镜像仓库配置可参考 `../harbor/README.md`
