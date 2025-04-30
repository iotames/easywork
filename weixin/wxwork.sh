#!/bin/sh

# 企业微信群机器人的消息发送

if [ -z "${WEBHOOK_KEY}" ]; then
    WEBHOOK_KEY=""
fi

if [ -z "${NOTIFY_TYPE}" ]; then
    NOTIFY_TYPE="版本发布"
fi

if [ -z "${NOTIFY_TITLE}" ]; then
    NOTIFY_TITLE="通知内容。支持MARKDOWN格式"
fi

echo WEBHOOK_KEY: ${WEBHOOK_KEY}
echo NOTIFY_TYPE: ${NOTIFY_TYPE}
echo NOTIFY_TITLE: ${NOTIFY_TITLE}

SEND_DATA='{
  "msgtype": "markdown",
  "markdown": {
    "content": "<font color=\"info\">持续集成通知</font>\n>类型: <font color=\"comment\">'${NOTIFY_TYPE}'</font>\n>分支: <font color=\"comment\">dev</font>\n>内容: <font>'${NOTIFY_TITLE}'</font>"
  }
}'

echo SEND_DATA: ${SEND_DATA}

# 打印将要执行的curl命令
echo "即将执行的curl命令:"
echo "curl \"https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${WEBHOOK_KEY}\" \
   -H 'Content-Type: application/json' \
   -d \"${SEND_DATA}\""

# 执行curl命令
# curl "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${WEBHOOK_KEY}" \
#    -H 'Content-Type: application/json' \
#    -d "${SEND_DATA}"
