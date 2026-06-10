#!/bin/sh

# 日志清理

> /var/log/ssl_monitor.log
> /path/appdir/app.log

# APP_DIR=/path/appdir LOG_BASE=$APP_DIR/runtime/logs KEEP_MONTHS=1 && $APP_DIR/cleanlogs.sh

# ====== 清理./runtime/logs目录下按月份区分的日志。如：runtime/logs/202603 ====================

# 日志根目录：优先使用环境变量 LOG_BASE，否则默认为当前目录下的 runtime/logs
LOG_BASE="${LOG_BASE:-./runtime/logs}"

# 保留最近多少个月（可自定义）
KEEP_MONTHS=${KEEP_MONTHS:-2}

# 获取当前年月（格式：YYYYMM）
CURRENT_MONTH=$(date +%Y%m)

# 计算需要保留的起始月份（当前月份减去 KEEP_MONTHS 个月）
START_MONTH=$(date -d "-${KEEP_MONTHS} months" +%Y%m)

# 检查目录是否存在
if [ ! -d "$LOG_BASE" ]; then
    echo "错误：目录 $LOG_BASE 不存在"
    exit 1
fi

echo "保留最近 ${KEEP_MONTHS} 个月的日志（即从 ${START_MONTH} 至今）"
echo "将删除早于 ${START_MONTH} 的日志目录"

# 遍历目录下的所有项目
for item in "$LOG_BASE"/*; do
    # 只处理目录
    [ -d "$item" ] || continue

    # 提取目录名（如 "202604"）
    dir_name=$(basename "$item")

    # POSIX 兼容的6位纯数字校验（使用 case 模式匹配）
    case "$dir_name" in
        [0-9][0-9][0-9][0-9][0-9][0-9])
            # 数字比较：小于起始月份则删除
            if [ "$dir_name" -lt "$START_MONTH" ]; then
                size=$(du -sh "$item" 2>/dev/null | awk '{print $1}')
                echo "正在删除过期日志目录：$item。空间占用: $size"
                rm -rf "$item"
            fi
            ;;
        *)
            # 非年月格式的目录，跳过
            ;;
    esac
done

echo "清理完成"