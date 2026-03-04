#!/bin/bash
# ============================================================================
# 服务部署脚本
# 功能: 自动创建并配置 systemd 服务
# 版本: 1.0
# 作者: 系统部署工具
# ============================================================================
# 
# 使用方式:
#   ./install.sh [服务名] [运行用户]
#
# 参数说明:
#   参数1 - 服务名称 (可选)
#     如果未提供或字符长度小于3，则使用默认值 "mysvr01"
#   参数2 - 运行用户 (可选)
#     如果未提供或字符长度小于3，则使用当前执行脚本的用户
#
# 示例:
#   1. 使用所有默认值 (服务名: mysvr01, 用户: 当前用户)
#      ./install.sh
#
#   2. 自定义服务名，用户使用默认值
#      ./install.sh myservice
#
#   3. 自定义服务名和运行用户
#      ./install.sh myservice myuser
#
# 注意事项:
#   1. 需要 root 权限执行 (使用 sudo)
#   2. 指定的运行用户必须在系统中已存在
#   3. 当前目录必须包含要部署的可执行文件
#   4. 日志文件将输出到当前目录的 run.log 和 run.error.log
# ============================================================================

set -e  # 遇到错误立即退出脚本，避免错误累积

# 1. 定义APP_NAME变量为服务名称，赋值当前脚本的第一个参数。
#    如果没有传参数或者参数字符小于3，则默认为mysvr01
if [ -z "$1" ] || [ ${#1} -lt 3 ]; then
    APP_NAME="mysvr01"
    echo "使用默认服务名称: ${APP_NAME}"
else
    APP_NAME="$1"
    echo "使用自定义服务名称: ${APP_NAME}"
fi

# 5. 指定User为当前脚本的第二个参数，如果没有传参数或者参数字符小于3，默认为当前用户。
if [ -z "$2" ] || [ ${#2} -lt 3 ]; then
    RUN_USER=$(whoami)
    echo "使用当前用户作为运行用户: ${RUN_USER}"
else
    RUN_USER="$2"
    # 验证用户是否存在
    if id "$RUN_USER" &>/dev/null; then
        echo "使用指定运行用户: ${RUN_USER}"
    else
        echo "错误: 用户 ${RUN_USER} 不存在!"
        exit 1
    fi
fi

# 获取当前目录和工作路径
CURRENT_DIR=$(pwd)
SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"

echo "========================================="
echo "服务配置信息:"
echo "  服务名称: ${APP_NAME}"
echo "  运行用户: ${RUN_USER}"
echo "  工作目录: ${CURRENT_DIR}"
echo "  可执行文件: ${CURRENT_DIR}/${APP_NAME}"
echo "  服务文件: ${SERVICE_FILE}"
echo "========================================="

# 2. 创建一个服务文件：/etc/systemd/system/${APP_NAME}.service
echo "正在创建服务文件..."
tee "$SERVICE_FILE" > /dev/null << EOF
[Unit]
Description=${APP_NAME} Service
After=network.target
Wants=network.target

[Service]
Type=simple
User=${RUN_USER}
WorkingDirectory=${CURRENT_DIR}
ExecStart=${CURRENT_DIR}/${APP_NAME}
# 6. 重启策略配置
Restart=on-failure
RestartSec=30
# 7. 标准输出日志配置
StandardOutput=file:${CURRENT_DIR}/run.log
# 8. 标准错误日志配置
StandardError=file:${CURRENT_DIR}/run.error.log
# 资源限制 (可选，根据需求调整)
# LimitNOFILE=65536
# LimitNPROC=65536

[Install]
WantedBy=multi-user.target
EOF

echo "服务文件创建完成!"

# 重新加载 systemd 守护进程
echo "重新加载 systemd 配置..."
systemctl daemon-reload

echo "========================================="
echo "服务部署完成!"
echo "========================================="
echo ""
echo "接下来，您可以使用以下命令管理服务:"
echo ""
echo "启动服务:"
echo "  systemctl start ${APP_NAME}"
echo ""
echo "停止服务:"
echo "  systemctl stop ${APP_NAME}"
echo ""
echo "重启服务:"
echo "  systemctl restart ${APP_NAME}"
echo ""
echo "查看服务状态:"
echo "  systemctl status ${APP_NAME}"
echo ""
echo "查看服务日志:"
echo "  journalctl -u ${APP_NAME} -f"
echo ""
echo "启用开机自启:"
echo "  systemctl enable ${APP_NAME}"
echo ""
echo "禁用开机自启:"
echo "  systemctl disable ${APP_NAME}"
echo ""
echo "========================================="
echo "重要提示:"
echo "1. 请确保 ${CURRENT_DIR}/${APP_NAME} 可执行文件存在"
echo "2. 运行用户 ${RUN_USER} 需要对当前目录有读写权限"
echo "3. 日志将输出到:"
echo "   - 标准输出: ${CURRENT_DIR}/run.log"
echo "   - 错误输出: ${CURRENT_DIR}/run.error.log"
echo "========================================="