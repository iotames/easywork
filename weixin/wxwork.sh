#!/bin/sh

# 企业微信群机器人的消息发送

# WEBHOOK_KEY=""
# NOTIFY_TYPE="代码合并"
# NOTIFY_TITLE="[客户关系管理：新增商机功能](http://127.0.0.1:8929/yourgroup/yourproject/-/merge_requests?scope=all&state=merged)"

if [ -z "${WEBHOOK_KEY}" ]; then
    echo "错误: WEBHOOK_KEY 变量未设置"
    exit 1
fi

# 集成类型
if [ -z "${NOTIFY_TYPE}" ]; then
    NOTIFY_TYPE="版本发布"
fi

# 目标分支, 默认为dev
if [ -z "${GIT_BRANCH}" ]; then
    GIT_BRANCH="dev"
fi

# 部署地址
if [ -z "${DEPLOY_URL}" ]; then
    DEPLOY_URL="http://127.0.0.1:8080"
fi

# 集成内容
if [ -z "${NOTIFY_TITLE}" ]; then
    NOTIFY_TITLE="通知内容。支持MARKDOWN格式"
fi

SEND_DATA='{
  "msgtype": "markdown",
  "markdown": {
    "content": "<font color=\"info\">持续集成通知：</font> \n >集成类型: <font color=\"comment\">'${NOTIFY_TYPE}'</font> \n >目标分支: <font>'${GIT_BRANCH}'</font> \n >部署地址: <font>'${DEPLOY_URL}'</font> \n >集成内容: <font>'${NOTIFY_TITLE}'</font>"
  }
}'

echo "-------POST--DATA--json(${SEND_DATA})---"

# 执行curl命令
curl -X POST "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${WEBHOOK_KEY}" \
   -H "Content-Type: application/json" \
   -d "${SEND_DATA}"
