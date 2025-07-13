#!/bin/bash

ARG_OPT="$1"

echo "---------ARG_OPT(${ARG_OPT})-------"

# 如果存在 .env 文件，从中读取环境变量
if [ -f .env ]; then
    # https://stackoverflow.com/questions/19331497/set-environment-variables-from-file-of-key-value-pairs
    echo "发现.env文件，加载环境变量......"
    export $(cat .env | sed 's/#.*//g' | xargs)
fi

chmod +x /home/myname/myproject/run.sh
CMDFILE="/home/myname/myproject/run.sh"

if [ -z "${ARG_OPT}" ]; then
    echo "-----EMPTY---ARG_OPT: updaate......"
    ${CMDFILE} update
    exit 0
fi

if [ "${ARG_OPT}" = "update" ]; then
    echo "------update......"
    ${CMDFILE} update
    exit 0
fi

if [ "${ARG_OPT}" = "restart" ]; then
    echo "----restart......"
    docker restart odoowebtest
    exit 0
fi
