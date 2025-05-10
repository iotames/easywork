#!/bin/bash

# . "$HOME/.env"
cd "$HOME"
RUN_FILE="$HOME/odoorun/run.sh"
LOG_PATH="$HOME/logs"
JOB_STAGE=$1
NOW_TIME=$(date "+%Y-%m-%d %H:%M:%S")

# # 检查执行文件的目录是否存在
# if [ ! -d "$RUN_FILE_DIR" ]; then
#     echo "错误: $RUN_FILE_DIR 目录不存在"
#     exit 1
# fi

# 检查运行脚本是否存在
if [ ! -f "$RUN_FILE" ]; then
    echo "错误: $RUN_FILE 文件不存在"
    exit 1
fi

# 如果日志目录不存在则创建
if [ ! -d "$LOG_PATH" ]; then
    mkdir -p "$LOG_PATH"
fi

echo "-----------BIGIN---CICD---[${NOW_TIME}]-----${JOB_STAGE}------" >> "$LOG_PATH/ci.log"
# deploy_merge
if [ "$JOB_STAGE" == "deploy_merge" ]; then
    # ${REMOTE_SCRIPT_FILE} deploy_merge "$CI_COMMIT_BRANCH" "$CI_COMMIT_TITLE" "$CI_COMMIT_MESSAGE"
    CI_COMMIT_BRANCH=$2
    CI_COMMIT_TITLE=$3
    CI_COMMIT_MESSAGE=$4
    DEBUG_MSG="deploy_merge ${CI_COMMIT_BRANCH} ${CI_COMMIT_TITLE} ${CI_COMMIT_MESSAGE}"
    "${RUN_FILE}" update
    echo $DEBUG_MSG >> "$LOG_PATH/ci.log"
fi

# deploy_tag
if [ "$JOB_STAGE" == "deploy_tag" ]; then
    # ${REMOTE_SCRIPT_FILE} deploy_tag "${CI_COMMIT_TAG}" "${CI_COMMIT_TAG_MESSAGE}" "$CI_COMMIT_AUTHOR"
    CI_COMMIT_TAG=$2
    CI_COMMIT_TAG_MESSAGE=$3
    CI_COMMIT_AUTHOR=$4
    DEBUG_MSG="deploy_tag ${CI_COMMIT_TAG} ${CI_COMMIT_TAG_MESSAGE} ${CI_COMMIT_AUTHOR}"
    echo $DEBUG_MSG >> "$LOG_PATH/ci.log"
fi
