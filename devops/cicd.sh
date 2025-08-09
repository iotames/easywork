#!/bin/sh

# 如字符串有类似 !55 这种符号。在bash环境，会和历史扩展的功能冲突。
# 可使用sh环境，或运行set +H命令禁用。执行set -H命令可恢复。

if [ "$1" = "reload" ]; then
    echo "----TODO--cicd.sh--(reload)---"
fi

# 检查环境变量 ENV_FILE 是否已设置
# 如果未设置，则将 ENV_FILE 设置为默认的 ~/.env 文件路径
if [ -z "${ENV_FILE}" ]; then
    ENV_FILE="${HOME}/.env"
fi

# 检查环境变量文件是否存在，如果存在则加载该文件
# - ${ENV_FILE}: 环境变量文件的路径
# - 如果文件存在，输出提示信息，并使用点号命令（.）加载环境变量
if [ -f "${ENV_FILE}" ]; then
    echo "-----发现${ENV_FILE}文件"
    . "${ENV_FILE}"
fi

# 应该再传递一个变量。作为项目的实际绝对路径。
cd "$HOME"
RUN_SCRIPT="$HOME/odoorun/run.sh"
NOTIFY_SCRIPT="$HOME/bin/wxwork.sh"
LOG_PATH="$HOME/logs"
JOB_STAGE=$1
NOW_TIME=$(date "+%Y-%m-%d %H:%M:%S")

# 检查运行脚本是否存在
if [ ! -f "$RUN_SCRIPT" ]; then
    echo "错误: $RUN_SCRIPT 文件不存在"
    exit 1
fi

# 如果日志目录不存在则创建
if [ ! -d "$LOG_PATH" ]; then
    mkdir -p "$LOG_PATH"
fi

echo "-------BIGIN---CICD---[${NOW_TIME}]----${JOB_STAGE}--DEPLOY_URL(${DEPLOY_URL})--WEBHOOK_KEY(${WEBHOOK_KEY})---" >> "$LOG_PATH/cicd.log"
# deploy_merge
if [ "$JOB_STAGE" = "deploy_merge" ]; then
    # == 符号在sh中不兼容，使用 = 代替。=符号左右有空格，代表值对比。没有空格，代表赋值。
    CI_COMMIT_BRANCH=$2
    CI_COMMIT_TITLE=$3
    CI_COMMIT_MESSAGE=$4
    DEBUG_MSG="-----cicd.sh--(deploy_merge)--(${CI_COMMIT_BRANCH})--(${CI_COMMIT_TITLE})--(${CI_COMMIT_MESSAGE})--"
    
    "${RUN_SCRIPT}" update
    
    # 检查消息通知脚本是否存在
    if [ ! -f "$NOTIFY_SCRIPT" ]; then
        echo "错误: $NOTIFY_SCRIPT 文件不存在"
        exit 1
    fi

    # 消息通知。DEPLOY_URL, WEBHOOK_KEY 从环境变量中获取
    export NOTIFY_TYPE="代码合并"
    export GIT_BRANCH="${CI_COMMIT_BRANCH}"

    # 从CI_COMMIT_MESSAGE中提取实际的更新内容
    NOTIFY_TITLE=$(echo "${CI_COMMIT_MESSAGE}" | \
        sed "s|${CI_COMMIT_TITLE}||" | \
        sed 's/See merge request.*$//' | \
        sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' | \
        tr -d '\n')
    
    # 如果没有提取到内容，则使用默认的CI_COMMIT_TITLE
    if [ -z "$NOTIFY_TITLE" ]; then
        NOTIFY_TITLE="${CI_COMMIT_TITLE}"
    fi

    # 如果有设置MERGED_LOG_URL变量，则将NOTIFY_TITLE格式化为Markdown链接格式
    if [ -n "$MERGED_LOG_URL" ]; then
        NOTIFY_TITLE="[${NOTIFY_TITLE}](${MERGED_LOG_URL})"
    fi
    
    if [ -n "$DEPLOY_URL" ]; then
        DEPLOY_URL="[${DEPLOY_URL}](${DEPLOY_URL})"
    fi

    export NOTIFY_TITLE
    export DEPLOY_URL
    export WEBHOOK_KEY
    "${NOTIFY_SCRIPT}"
    echo $DEBUG_MSG >> "$LOG_PATH/cicd.log"
fi

# deploy_tag
if [ "$JOB_STAGE" = "deploy_tag" ]; then
    # ${REMOTE_SCRIPT_FILE} deploy_tag "${CI_COMMIT_TAG}" "${CI_COMMIT_TAG_MESSAGE}" "$CI_COMMIT_AUTHOR"
    CI_COMMIT_TAG=$2
    CI_COMMIT_TAG_MESSAGE=$3
    CI_COMMIT_AUTHOR=$4
    DEBUG_MSG="---cicd.sh--(deploy_tag)--(${CI_COMMIT_TAG})--(${CI_COMMIT_TAG_MESSAGE})--(${CI_COMMIT_AUTHOR})--"
    echo $DEBUG_MSG >> "$LOG_PATH/cicd.log"
fi
