#!/usr/bin/env bash
# 通用网站 / Web 应用健康检查 + 企业微信告警（建议 crontab 每 15 分钟运行一次）
# 完整说明: 运行 --help 查看用法
#
# crontab 示例:
#   WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxx
#   */15 * * * * /home/ubuntu/scripts/web_healthcheck.sh

set -u

# 统一 UTF-8 locale：cron 默认 C locale 下 ${s:0:N} 按字节截断，会把中文标题切成非法 UTF-8，导致 JSON 发送失败
for _loc in C.UTF-8 en_US.UTF-8; do
    if LC_ALL=$_loc locale charmap 2>/dev/null | grep -qi 'utf-\?8'; then export LC_ALL=$_loc; break; fi
done

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# 可选配置文件：存在则加载，可覆盖下方所有默认配置（数组 TARGETS 亦可搬到这里维护）
CONF_FILE="${CONF_FILE:-$SCRIPT_DIR/healthcheck.conf}"
[ -f "$CONF_FILE" ] && . "$CONF_FILE"

# ============================ 配置区（常用项都改这里） ============================

# 检测目标列表，每项格式:  "站点名称|URL|标题关键词|主机地址|指定连接IP"
#   标题关键词 : 留空 = 只校验状态码；非空 = 页面 <title> 必须包含该关键词
#   主机地址   : 留空 = 使用全局 HOST_ADDR；用于在告警里标注站点所在服务器
#   指定连接IP : 留空 = 按 URL 域名正常解析；填写 = 强制连接到该 IP 建立 TCP/TLS
#                （SNI 与证书校验仍按域名进行，适合多 IP/回源/CDN 节点分别探测）
if ! declare -p TARGETS >/dev/null 2>&1; then
    TARGETS=(
        "森地客集团官网|https://www.santicgroup.com/zh-cn|森地客集团|101.32.49.222|"
        # "官网-指定IP探测|https://www.santicgroup.com/zh-cn|森地客集团|101.32.49.222|43.159.xx.xx"
        # "内网健康接口|http://127.0.0.1:8080/health||127.0.0.1|"
        # "管理后台|https://admin.example.com/login|Example|10.0.0.5|"
    )
fi

WEBHOOK_URL="${WEBHOOK_URL:-}"                 # 企微机器人（实际发送时必填，可用环境变量传入）
HOST_ADDR="${HOST_ADDR:-101.32.49.222}"        # 全局默认主机地址
EXPECT_STATUS="${EXPECT_STATUS:-200}"          # 期望状态码，可多值: "200 204"
ATTEMPTS="${ATTEMPTS:-}"                       # 每站点检查次数，全部失败才判异常（默认 3；--debug 默认 1）
RETRY_DELAY="${RETRY_DELAY:-}"                 # 重试间隔秒（默认 15；--debug 默认 0）
CONNECT_TIMEOUT="${CONNECT_TIMEOUT:-10}"       # curl 连接超时秒
MAX_TIME="${MAX_TIME:-30}"                     # curl 总超时秒
COOLDOWN_SECS="${COOLDOWN_SECS:-86400}"        # 告警限流：同一站点 24 小时最多一条
SSL_WARN_DAYS="${SSL_WARN_DAYS:-7}"            # HTTPS 证书剩余天数低于该值告警；0=关闭
NOTIFY_RECOVERY="${NOTIFY_RECOVERY:-0}"        # 1=站点从「已告警的故障」恢复后补发恢复通知
USER_AGENT="${USER_AGENT:-Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36}"

STATE_DIR="${STATE_DIR:-$SCRIPT_DIR/state}"    # 各站点状态/限流记录目录
LOCK_FILE="${LOCK_FILE:-/tmp/web_healthcheck.lock}"
LOG_DIR="${LOG_DIR:-$SCRIPT_DIR/logs}"
LOG_FILE="${LOG_FILE:-$LOG_DIR/web_healthcheck.log}"
LOG_MAX_BYTES="${LOG_MAX_BYTES:-1048576}"      # 日志超 1MB 自动轮转
LOG_KEEP="${LOG_KEEP:-5}"                       # 轮转保留份数
NOTIFY_MAX_BYTES="${NOTIFY_MAX_BYTES:-1800}"    # 单条企微 text 消息字节上限（官方 2048）

# ============================ 以下无需改动 ============================

DEBUG=0; TEST_MODE=0
usage() {
    cat << 'USAGE'
用法: web_healthcheck.sh [--debug] [--test] [-h|--help]

模式:
  (无参数)   巡检所有 TARGETS：仅异常时发送企微告警；每站点独立受 24 小时限流约束；
             多个站点同时异常会合并为一条消息；过程静默写入日志文件
  --debug    干跑排查：完整执行每个站点的检查并打印过程日志，给出通知内容预览；
             绝不发送任何通知，绝不修改状态/限流文件（默认每站点只请求 1 次，加快速排查）
  --test     连通性自测：真实巡检所有站点并把汇总报告发给机器人，顶部显示
             「网站访问健康检查测试」；不占限流额度、不改状态文件
  -h,--help  显示本帮助

配置:
  所有配置位于脚本顶部「配置区」，也可放入同目录 healthcheck.conf（可被环境变量
  CONF_FILE 指定路径）。检测目标格式:
      "站点名称|URL|标题关键词|主机地址|指定连接IP"
  - 标题关键词留空 = 只校验状态码（EXPECT_STATUS，默认 200）
  - 指定连接IP    = 强制按该 IP 建立连接，SNI/证书仍按域名校验（多 IP / 回源探测）

判异常条件: 状态码不匹配 | 页面 <title> 缺少关键词 | HTTPS 证书临近过期(SSL_WARN_DAYS)

退出码: 0=正常完成（含 debug、被限流静默）  1=通知发送失败或缺少 WEBHOOK_URL  2=配置/参数错误
USAGE
}
while [ $# -gt 0 ]; do
    case "$1" in
        --debug) DEBUG=1 ;;
        --test)  TEST_MODE=1 ;;
        -h|--help) usage; exit 0 ;;
        *) echo "未知参数: $1" >&2; usage >&2; exit 2 ;;
    esac
    shift
done

ATTEMPTS="${ATTEMPTS:-$([ "$DEBUG" -eq 1 ] && echo 1 || echo 3)}"
RETRY_DELAY="${RETRY_DELAY:-$([ "$DEBUG" -eq 1 ] && echo 0 || echo 15)}"

for v in ATTEMPTS RETRY_DELAY CONNECT_TIMEOUT MAX_TIME COOLDOWN_SECS SSL_WARN_DAYS LOG_MAX_BYTES LOG_KEEP NOTIFY_MAX_BYTES; do
    case "${!v}" in ''|*[!0-9]*) echo "配置错误: $v=${!v} 不是非负整数" >&2; exit 2 ;; esac
done
[ "$ATTEMPTS" -ge 1 ] || { echo "配置错误: ATTEMPTS 必须 >= 1" >&2; exit 2; }
command -v curl >/dev/null 2>&1 || { echo "配置错误: 未找到 curl" >&2; exit 2; }
command -v md5sum >/dev/null 2>&1 || { echo "配置错误: 未找到 md5sum" >&2; exit 2; }
[ "${#TARGETS[@]}" -gt 0 ] || { echo "配置错误: TARGETS 为空" >&2; exit 2; }

# ---------- 日志 ----------
mkdir -p "$LOG_DIR" 2>/dev/null || { LOG_DIR=/tmp; LOG_FILE=/tmp/web_healthcheck.log; }
rotate_logs() {
    local sz i
    sz=$(stat -c %s "$LOG_FILE" 2>/dev/null || echo 0)
    [ "$sz" -gt "$LOG_MAX_BYTES" ] || return 0
    i=$LOG_KEEP
    while [ "$i" -gt 1 ]; do
        [ -e "$LOG_FILE.$(( i - 1 ))" ] && mv -f "$LOG_FILE.$(( i - 1 ))" "$LOG_FILE.$i"
        i=$(( i - 1 ))
    done
    mv -f "$LOG_FILE" "${LOG_FILE}.1" 2>/dev/null
}
rotate_logs
log() {
    local level=$1; shift
    local line; line="$(date '+%F %T') [$level] [pid=$$] $*"
    printf '%s\n' "$line" >> "$LOG_FILE" 2>/dev/null || true
    [ "$DEBUG" -eq 1 ] && printf '%s\n' "$line"
}
mask_webhook() {
    case "$WEBHOOK_URL" in
        '') printf '%s' '（未配置）' ;;
        *key=*) printf '%s' "${WEBHOOK_URL%%key=*}key=***" ;;
        *) printf '%s' "${WEBHOOK_URL%%/*}***" ;;
    esac
}

# ---------- 单实例锁 ----------
if command -v flock >/dev/null 2>&1; then
    exec 9>"$LOCK_FILE" || { echo "无法创建锁文件 $LOCK_FILE" >&2; exit 2; }
    flock -n 9 || { log WARN "已有实例在运行，跳过本次检查"; exit 0; }
else
    log WARN "未找到 flock，跳过并发保护"
fi

mkdir -p "$STATE_DIR" 2>/dev/null || STATE_DIR=/tmp
slug_of() { printf '%s' "$1" | md5sum | cut -c1-10; }

state_path() { printf '%s/whc_%s.state' "$STATE_DIR" "$(slug_of "$1")"; }

read_state() { # $1 文件; 输出 RS_STATUS RS_NOTIFY_TS RS_EPISODE
    RS_STATUS='unknown'; RS_NOTIFY_TS=0; RS_EPISODE=0
    local f=$1
    if [ -f "$f" ]; then
        RS_STATUS=$(sed -n 's/^STATUS=//p' "$f" | head -1)
        RS_NOTIFY_TS=$(sed -n 's/^NOTIFY_TS=//p' "$f" | head -1)
        RS_EPISODE=$(sed -n 's/^EPISODE_ALERTED=//p' "$f" | head -1)
    fi
    case "$RS_NOTIFY_TS" in ''|*[!0-9]*) RS_NOTIFY_TS=0 ;; esac
    case "$RS_EPISODE" in ''|*[!0-9]*) RS_EPISODE=0 ;; esac
}
write_state() { # $1 文件 $2 STATUS $3 NOTIFY_TS $4 EPISODE
    [ "$DEBUG" -eq 1 ] || [ "$TEST_MODE" -eq 1 ] && return 0
    local tmp
    tmp=$(mktemp "$1.tmp.XXXXXX") || { log ERROR "状态文件写入失败（无法创建临时文件）: $1"; return 1; }
    if printf 'STATUS=%s\nNOTIFY_TS=%s\nEPISODE_ALERTED=%s\n' "$2" "$3" "$4" > "$tmp" \
        && mv -f "$tmp" "$1"; then
        return 0
    fi
    log ERROR "状态文件写入失败: $1"
    rm -f "$tmp"
    return 1
}

# curl 退出码 -> 人话（整机宕机场景的关键诊断信息）
curl_err_desc() { # $1 curl exit code
    case "$1" in
        6)  printf '连接失败：DNS 解析失败（域名无法解析）' ;;
        7)  printf '连接失败：目标拒绝连接（机器在线但 web 服务未监听/已崩溃）' ;;
        28) printf '连接失败：连接或读取超时（目标服务器可能整机宕机或网络不可达）' ;;
        35) printf '连接失败：TLS 握手失败（证书/加密套件异常）' ;;
        52) printf '连接失败：目标返回空响应（服务进程可能已崩溃）' ;;
        56) printf '连接失败：网络数据传输中断' ;;
        60) printf '连接失败：SSL 证书校验失败（证书已过期或不受信任）' ;;
        *)  printf '连接失败：curl 退出码 %s' "$1" ;;
    esac
}

status_in_expect() { # $1 状态码；命中 EXPECT_STATUS 返回 0
    local s
    for s in $EXPECT_STATUS; do [ "$1" = "$s" ] && return 0; done
    return 1
}

# ---------- 站点检查 ----------
body_file=$(mktemp) || { echo "配置错误: 无法创建临时文件" >&2; exit 2; }
trap 'rm -f "$body_file"' EXIT

check_target() { # $1 entry；结果写入 CT_* 全局
    local name url kw host rip
    IFS='|' read -r name url kw host rip <<< "$1"

    case "$url" in http://*|https://*) ;; *) log ERROR "跳过非法目标（URL 需以 http/https 开头）: $url"; return 1 ;; esac
    [ -n "$host" ] || host="$HOST_ADDR"

    local scheme=${url%%://*} rest hostport hostn port
    rest=${url#*://}; hostport=${rest%%/*}; hostn=${hostport%%:*}
    case "$hostport" in *@*) log ERROR "跳过非法目标（不支持带用户信息的 URL）: $url"; return 1 ;; esac
    case "$hostn" in ''|*[!A-Za-z0-9._-]*) log ERROR "跳过非法目标（主机名含不支持字符，IPv6 字面量请改用域名+指定IP）: $url"; return 1 ;; esac
    if [ "$hostport" != "$hostn" ]; then
        port=${hostport#*:}
        case "$port" in ''|*[!0-9]*) log ERROR "跳过非法目标（端口非法）: $url"; return 1 ;; esac
    else
        [ "$scheme" = https ] && port=443 || port=80; fi

    local -a args=( -sS -o "$body_file" -w '%{http_code}'
        --connect-timeout "$CONNECT_TIMEOUT" --max-time "$MAX_TIME" --url "$url"
        -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/jxl,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
        -H 'Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
        -H 'Cache-Control: max-age=0' -H 'Connection: keep-alive'
        -H 'Sec-Fetch-Dest: document' -H 'Sec-Fetch-Mode: navigate'
        -H 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-User: ?1'
        -H 'Upgrade-Insecure-Requests: 1'
        -H "User-Agent: $USER_AGENT"
        -H 'sec-ch-prefers-color-scheme: light'
        -H 'sec-ch-ua: "Not-A.Brand";v="99", "Google Chrome";v="157", "Chromium";v="157"'
        -H 'sec-ch-ua-mobile: ?0' -H 'sec-ch-ua-platform: "Windows"' )
    [ -n "$rip" ] && args+=( --resolve "${hostn}:${port}:${rip}" )

    CT_NAME=$name; CT_URL=$url; CT_KEYWORD=$kw; CT_HOST=$host; CT_RIP=$rip
    # 状态文件按 URL+指定IP+关键词 区分：同一 URL 探测多个 IP、或配置多个校验目标时，限流记录互不影响
    CT_STATE=$(state_path "${url}|${rip}|${kw}")
    read_state "$CT_STATE"; CT_PREV_STATUS=$RS_STATUS; CT_PREV_TS=$RS_NOTIFY_TS; CT_PREV_EP=$RS_EPISODE

    CT_CODE='000'; CT_TITLE='无法获取'; CT_TITLE_FULL='无法获取'; CT_OK=0; CT_REASON=''
    CT_ERR=''
    local i ok rc
    for (( i=1; i<=ATTEMPTS; i++ )); do
        : > "$body_file"   # 先清空，避免 curl 提前失败时读到上一个目标的旧页面
        CT_CODE=$(curl "${args[@]}"); rc=$?
        if [ "$rc" -ne 0 ]; then
            CT_CODE='000'
            CT_ERR=$(curl_err_desc "$rc")
        else
            CT_ERR=''
        fi
        CT_TITLE_FULL=$(tr -d '\000-\037' < "$body_file" | grep -oiE '<title[^>]*>[^<]*</title>' | head -1 | sed -E 's/<[^>]*>//g')
        [ -n "$CT_TITLE_FULL" ] || CT_TITLE_FULL='无法获取'
        CT_TITLE=${CT_TITLE_FULL:0:100}   # 截断仅用于日志/通知展示，关键词匹配用全文
        ok=1
        [ "$CT_CODE" = '000' ] && ok=0
        if [ "$ok" -eq 1 ] && ! status_in_expect "$CT_CODE"; then ok=0; fi
        if [ "$ok" -eq 1 ] && [ -n "$kw" ]; then
            [ "${CT_TITLE_FULL#*"$kw"}" != "$CT_TITLE_FULL" ] || ok=0
        fi
        log INFO "[$name] 第 $i/$ATTEMPTS 次请求 url=${url%%\?*} 状态码=$CT_CODE 标题=$CT_TITLE${rip:+ 指定IP=$rip}"
        if [ "$ok" -eq 1 ]; then CT_OK=1; break; fi
        [ "$i" -lt "$ATTEMPTS" ] && sleep "$RETRY_DELAY"
    done

    if [ "$CT_OK" -eq 0 ]; then
        if [ "$CT_CODE" = '000' ]; then CT_REASON='status'
        elif status_in_expect "$CT_CODE"; then CT_REASON='title'
        else CT_REASON='status'; fi
    else
        CT_ERR=''
    fi

    # HTTPS 证书有效期（站点正常时才看）
    CT_SSL=''
    if [ "$CT_OK" -eq 1 ] && [ "$SSL_WARN_DAYS" -gt 0 ] && [ "$scheme" = https ] \
       && command -v openssl >/dev/null 2>&1; then
        local enddate expiry now2
        enddate=$(echo | timeout 10 openssl s_client -connect "${rip:-$hostn}:${port}" -servername "$hostn" 2>/dev/null \
            | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
        if [ -n "$enddate" ]; then
            now2=$(date +%s); expiry=$(date -d "$enddate" +%s 2>/dev/null || echo 0)
            [ "$expiry" -gt 0 ] && CT_SSL=$(( ( expiry - now2 ) / 86400 ))
        fi
        if [ -n "$CT_SSL" ]; then
            log INFO "[$name] SSL 证书剩余 ${CT_SSL} 天（阈值 $SSL_WARN_DAYS 天）"
            if [ "$CT_SSL" -lt "$SSL_WARN_DAYS" ]; then CT_OK=0; CT_REASON='cert'; fi
        else
            log WARN "[$name] 无法获取 SSL 证书到期时间，跳过该项检查"
        fi
    fi
    return 0
}

# ---------- 通知 ----------
build_payload() {
    local escaped
    escaped=$(printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' | sed -e ':a' -e 'N' -e '$!ba' -e 's/\n/\\n/g')
    printf '{"msgtype":"text","text":{"content":"%s"}}' "$escaped"
}
send_notify() { # $1 content
    local payload resp
    payload=$(build_payload "$1")
    if [ "$DEBUG" -eq 1 ]; then
        log DEBUG "干跑模式：以下内容本应发送到 $(mask_webhook)，实际未发送"
        printf '%s\n' "---- 通知内容预览 ----
$1
----------------------"
        return 0
    fi
    resp=$(curl -sS -m 15 -H 'Content-Type: application/json' -d "$payload" "$WEBHOOK_URL") || resp=''
    if printf '%s' "$resp" | grep -q '"errcode"[[:space:]]*:[[:space:]]*0'; then return 0; fi
    log ERROR "通知发送失败，webhook 返回: ${resp:-（无响应）}"
    return 1
}
byte_len() { printf '%s' "$1" | wc -c; }
# 给“……剩余 N 个站点省略”的尾巴预留 64 字节
NOTIFY_LIMIT=$(( NOTIFY_MAX_BYTES - 64 )); [ "$NOTIFY_LIMIT" -lt 64 ] && NOTIFY_LIMIT=$NOTIFY_MAX_BYTES
reason_line() { # $1 reason $2 keyword $3 curl错误描述 $4 状态码
    case "$1" in
        status) if [ -n "${3:-}" ]; then printf '\n异常原因：%s' "$3"
                else printf '\n异常原因：状态码 %s 不在期望列表（%s）' "${4:-}" "$EXPECT_STATUS"; fi ;;
        title)  printf '\n异常原因：页面标题未包含「%s」' "$2" ;;
        cert)   printf '\n异常原因：SSL 证书即将过期（剩余天数低于阈值 %s 天）' "$SSL_WARN_DAYS" ;;
    esac
}

# ---------- 主流程 ----------
FA_N=(); FA_U=(); FA_C=(); FA_T=(); FA_H=(); FA_R=(); FA_K=(); FA_E=(); FA_S=()
RC_N=(); RC_U=(); RC_C=(); RC_T=(); RC_H=(); RC_S=(); RC_P=()
RES_N=(); RES_U=(); RES_C=(); RES_T=(); RES_O=(); RES_SSL=()
now=$(date +%s)

for entry in "${TARGETS[@]}"; do
    [ -n "$entry" ] || continue
    case "$entry" in \#*) continue ;; esac
    check_target "$entry" || continue

    RES_N+=("$CT_NAME"); RES_U+=("$CT_URL"); RES_C+=("$CT_CODE"); RES_T+=("$CT_TITLE")
    RES_O+=("$CT_OK"); RES_SSL+=("${CT_SSL:-}")

    if [ "$CT_OK" -eq 1 ]; then
        if [ "$CT_PREV_STATUS" = 'fail' ] && [ "$CT_PREV_EP" = '1' ] && [ "$NOTIFY_RECOVERY" = '1' ]; then
            # 恢复通知发送成功后才写 ok/0，发送失败保持 fail/1，下一轮重试补发
            RC_N+=("$CT_NAME"); RC_U+=("$CT_URL"); RC_C+=("$CT_CODE"); RC_T+=("$CT_TITLE"); RC_H+=("$CT_HOST"); RC_S+=("$CT_STATE"); RC_P+=("$CT_PREV_TS")
        else
            write_state "$CT_STATE" ok "$CT_PREV_TS" 0
        fi
    else
        elapsed=$(( now - CT_PREV_TS ))
        # debug 不受真实状态限流，保证 --debug 始终能预览告警内容
        if [ "$DEBUG" -eq 0 ] && [ "$CT_PREV_TS" -gt 0 ] && [ "$elapsed" -ge 0 ] && [ "$elapsed" -lt "$COOLDOWN_SECS" ]; then
            log WARN "[$CT_NAME] 异常（状态码=$CT_CODE 原因=$CT_REASON），距上次通知仅 $(( elapsed / 3600 )) 小时，限流期内已静默"
            write_state "$CT_STATE" fail "$CT_PREV_TS" "$CT_PREV_EP"
            continue
        fi
        FA_N+=("$CT_NAME"); FA_U+=("$CT_URL"); FA_C+=("$CT_CODE"); FA_T+=("$CT_TITLE")
        FA_H+=("$CT_HOST"); FA_R+=("$CT_REASON"); FA_K+=("$CT_KEYWORD"); FA_E+=("$CT_ERR")
        FA_S+=("$CT_STATE")
    fi
done

# ---------- --test：汇总报告 ----------
if [ "$TEST_MODE" -eq 1 ]; then
    content="网站访问健康检查测试
检测类型：健康检查
检测时间：$(date '+%F %T %Z')
站点总数：${#RES_N[@]}"
    idx=0
    while [ "$idx" -lt "${#RES_N[@]}" ]; do
        line="
【${RES_N[$idx]}】${RES_U[$idx]}
状态码：${RES_C[$idx]} | 结果：$([ "${RES_O[$idx]}" = 1 ] && echo 健康 || echo 异常) | 标题：${RES_T[$idx]}${RES_SSL[$idx]:+ | 证书剩余${RES_SSL[$idx]}天}"
        [ $(( $(byte_len "$content") + $(byte_len "$line") )) -le "$NOTIFY_LIMIT" ] || break
        content+="$line"
        idx=$(( idx + 1 ))
    done
    [ "$idx" -lt "${#RES_N[@]}" ] && content+="
……剩余 $(( ${#RES_N[@]} - idx )) 个站点因消息长度限制省略"
    if [ -z "$WEBHOOK_URL" ] && [ "$DEBUG" -eq 0 ]; then
        log ERROR "--test 需要 WEBHOOK_URL"; echo "--test 需要设置 WEBHOOK_URL" >&2; exit 1
    fi
    log INFO "--test 模式：发送健康检查汇总报告"
    send_notify "$content" || exit 1
    log INFO "测试报告已发送成功"
    exit 0
fi

send_fail=0
now=$(date +%s)   # 发送前刷新时间，避免巡检耗时导致限流时间戳偏移

# ---------- 异常告警（可合并多条为一条消息） ----------
if [ "${#FA_N[@]}" -gt 0 ]; then
    if [ "${#FA_N[@]}" -eq 1 ]; then
        content="网站访问异常
站点名称：${FA_N[0]}
主机地址：${FA_H[0]}
检测网站：${FA_U[0]:0:200}
响应状态码：${FA_C[0]}
响应标题：${FA_T[0]}
检测类型：健康检查$(reason_line "${FA_R[0]}" "${FA_K[0]}" "${FA_E[0]}" "${FA_C[0]}")"
    else
        content="网站访问异常
检测类型：健康检查
异常站点数：${#FA_N[@]}"
        idx=0
        while [ "$idx" -lt "${#FA_N[@]}" ]; do
            block="
——
站点名称：${FA_N[$idx]}
主机地址：${FA_H[$idx]}
检测网站：${FA_U[$idx]:0:200}
响应状态码：${FA_C[$idx]}
响应标题：${FA_T[$idx]}$(reason_line "${FA_R[$idx]}" "${FA_K[$idx]}" "${FA_E[$idx]}" "${FA_C[$idx]}")"
            [ $(( $(byte_len "$content") + $(byte_len "$block") )) -le "$NOTIFY_LIMIT" ] || break
            content+="$block"
            idx=$(( idx + 1 ))
        done
        [ "$idx" -lt "${#FA_N[@]}" ] && content+="
……剩余 $(( ${#FA_N[@]} - idx )) 个异常站点因消息长度限制省略"
    fi
    # 只对实际写入消息的站点写状态；因长度被省略的站点不进入静默期，下一轮继续告警
    sent_n=${#FA_N[@]}
    [ "${#FA_N[@]}" -gt 1 ] && sent_n=$idx
    log WARN "本轮共 ${#FA_N[@]} 个站点异常，准备发送告警"
    if [ -z "$WEBHOOK_URL" ] && [ "$DEBUG" -eq 0 ]; then
        log ERROR "检测到异常但 WEBHOOK_URL 未设置，无法发送通知"
        echo "检测到异常但 WEBHOOK_URL 未设置，无法发送通知" >&2
        exit 1
    fi
    if send_notify "$content"; then
        if [ "$DEBUG" -eq 1 ]; then
            log INFO "干跑模式：告警内容已预览，未实际发送，未写入静默状态"
        else
            j=0; while [ "$j" -lt "$sent_n" ]; do write_state "${FA_S[$j]}" fail "$now" 1; j=$(( j + 1 )); done
            log INFO "告警发送成功，已通知的 $sent_n 个站点进入 ${COOLDOWN_SECS} 秒静默期"
        fi
    else
        send_fail=1
    fi
fi

# ---------- 恢复通知（默认关闭，NOTIFY_RECOVERY=1 启用；与告警消息相互独立） ----------
if [ "$send_fail" -eq 0 ] && [ "${#RC_N[@]}" -gt 0 ]; then
    if [ "${#RC_N[@]}" -eq 1 ]; then
        content="网站访问恢复
站点名称：${RC_N[0]}
主机地址：${RC_H[0]}
检测网站：${RC_U[0]}
响应状态码：${RC_C[0]}
响应标题：${RC_T[0]}
检测类型：健康检查"
        rc_sent_n=1
    else
        content="网站访问恢复
检测类型：健康检查
恢复站点数：${#RC_N[@]}"
        idx=0
        while [ "$idx" -lt "${#RC_N[@]}" ]; do
            block="
——
站点名称：${RC_N[$idx]}
主机地址：${RC_H[$idx]}
检测网站：${RC_U[$idx]}
响应状态码：${RC_C[$idx]}
响应标题：${RC_T[$idx]}"
            [ $(( $(byte_len "$content") + $(byte_len "$block") )) -le "$NOTIFY_LIMIT" ] || break
            content+="$block"
            idx=$(( idx + 1 ))
        done
        [ "$idx" -lt "${#RC_N[@]}" ] && content+="
……剩余 $(( ${#RC_N[@]} - idx )) 个恢复站点因消息长度限制省略"
        rc_sent_n=$idx
    fi
    log INFO "本轮 ${#RC_N[@]} 个站点从故障中恢复，发送恢复通知"
    if [ -z "$WEBHOOK_URL" ] && [ "$DEBUG" -eq 0 ]; then
        log ERROR "需发送恢复通知但 WEBHOOK_URL 未设置"
        send_fail=1
    elif send_notify "$content"; then
        # 只为实际写入消息的站点写状态；被长度省略的站点下一轮继续补发恢复通知
        # 沿用原告警时间戳做限流锚点，避免恢复通知重置锚点、把恢复后新一轮故障误判进静默期
        j=0; while [ "$j" -lt "$rc_sent_n" ]; do write_state "${RC_S[$j]}" ok "${RC_P[$j]}" 0; j=$(( j + 1 )); done
    else
        send_fail=1
    fi
fi

[ "$DEBUG" -eq 1 ] && log DEBUG "本轮检查结束：健康 $(( ${#RES_N[@]} - ${#FA_N[@]} )) / 异常告警 ${#FA_N[@]} / 恢复 ${#RC_N[@]}"
[ "$send_fail" -eq 0 ] || exit 1
exit 0
