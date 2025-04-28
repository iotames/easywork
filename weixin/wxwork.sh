#!/bin/sh

# 企业微信群机器人的消息发送

export WEBHOOK_KEY=""
export NOTIFY_TYPE="版本发布"
export NOTIFY_TITLE="通知内容。支持MARKDOWN格式"

export SEND_DATA='{
  "msgtype": "markdown",
  "markdown": {
    "content": "<font color=\"info\">持续集成通知</font>\n>
    >类型: <font color=\"comment\">版本发布</font>
    >分支: <font color=\"comment\">dev</font>
    >内容: <font>${NOTIFY_TITLE}</font>"
  }
}'

echo SEND_DATA: ${SEND_DATA}

curl "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${WEBHOOK_KEY}" \
   -H 'Content-Type: application/json' \
   -d '${SEND_DATA}'

