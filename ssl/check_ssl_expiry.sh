#!/bin/bash

# 检查HTTPS证书的有效期

# 每周三早上 9:10 执行 https网站证书是否即将过期的监控。
# DOMAINS_FILE="/etc/ssl_monitor/domains.txt"   # 域名列表文件：跳过空行和注释行
# LOG_FILE="/var/log/ssl_monitor.log"           # 日志文件
# 10 9 * * 3 /usr/local/bin/check_ssl_expiry.sh

# ==================== 配置区 ====================

# 改为环境变量注入
# WEBHOOK_URL="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=你的key"  # 企业微信机器人key

# 域名列表文件：优先使用环境变量（且文件存在），否则默认
if [ -n "$DOMAINS_FILE" ] && [ -f "$DOMAINS_FILE" ]; then
    :  # 保留环境变量值
else
    DOMAINS_FILE="/etc/ssl_monitor/domains.txt"
fi

# 日志文件：优先使用环境变量（且文件存在），否则默认
if [ -n "$LOG_FILE" ] && [ -f "$LOG_FILE" ]; then
    :  # 保留环境变量值
else
    LOG_FILE="/var/log/ssl_monitor.log"
fi

# WARN_DAYS=30                # 过期天数警告阈值
if [ -n "$WARN_DAYS" ] && [ -f "$WARN_DAYS" ]; then
    :  # 保留环境变量值
else
    WARN_DAYS=30
fi

# ===================== 自定义函数区 =======================

# 日志函数
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# 发送企业微信通知
send_wechat() {
    local domain="$1"
    local message="$2"
    # 如果未配置webhook则跳过
    # 检查 Webhook 是否有效
    if [[ -z "$WEBHOOK_URL" || "$WEBHOOK_URL" == *"你的key" ]]; then
        log "警告：未配置有效的企业微信 Webhook URL，跳过发送通知 (域名: $domain)"
        return
    fi
    # [[ -z "$WEBHOOK_URL" || "$WEBHOOK_URL" == *"你的key" ]] && return
    curl -s -X POST "$WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{\"msgtype\":\"text\",\"text\":{\"content\":\"【SSL证书监控】\n域名: $domain\n$message\"}}" \
        > /dev/null 2>&1
}

# ====================== 变量调试区 =================================
# 调试输出（可以放在判断之后，读取域名列表之前）
log "域名列表文件：DOMAINS_FILE=$DOMAINS_FILE"
log "日志文件：LOG_FILE=$LOG_FILE"
log "企微通知地址：WEBHOOK_URL=$WEBHOOK_URL"
log "临期告警天数：WARN_DAYS=$WARN_DAYS"
# ===================================================

# 检查文件是否存在
if [[ ! -f "$DOMAINS_FILE" ]]; then
    log "错误: 域名列表文件 $DOMAINS_FILE 不存在"
    exit 1
fi

# 读取每一行域名
while IFS= read -r domain || [[ -n "$domain" ]]; do
    # 跳过空行和注释行
    [[ -z "$domain" || "$domain" =~ ^# ]] && continue

    log "检查域名: $domain"

    # 获取证书过期时间
    expire_date=$(echo | timeout 10 openssl s_client -servername "$domain" -connect "$domain":443 2>/dev/null | \
                  openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    expire_date_cn=$(date -d "$expire_date" '+%Y-%m-%d %H:%M:%S')

    if [[ -z "$expire_date" ]]; then
        log "失败: 无法获取 $domain 的证书信息（可能服务不可达或非HTTPS）"
        send_wechat "$domain" "⚠️ 无法获取证书信息（服务不可达或端口未开放）"
        continue
    fi

    # 转换为时间戳
    expire_epoch=$(date -d "$expire_date" +%s 2>/dev/null)
    now_epoch=$(date +%s)
    days_left=$(( (expire_epoch - now_epoch) / 86400 ))

    log "$domain 证书剩余 $days_left 天"

    if [[ $days_left -le 0 ]]; then
        send_wechat "$domain" "❌ 证书已过期！过期日期: $expire_date_cn"
    elif [[ $days_left -le $WARN_DAYS ]]; then
        send_wechat "$domain" "⚠️ 证书即将过期！剩余 ${days_left} 天，过期日期: $expire_date_cn"
    fi

done < "$DOMAINS_FILE"

# log "监控完成"