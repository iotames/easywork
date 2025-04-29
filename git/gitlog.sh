#!/bin/bash

LOGLEN=30
GIT_WORK_HOME="/root/yourproject/path"

# 检查是否有参数传入且不为空
if [ ! -z "$1" ]; then
    # 检查参数是否为正整数
    if [[ "$1" =~ ^[1-9][0-9]*$ ]]; then
        LOGLEN=$1
    else
        echo "错误：参数必须是正整数"
        exit 1
    fi
fi

cd ${GIT_WORK_HOME} && git log | head -n $LOGLEN
