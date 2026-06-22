## 介绍

本文档为企业微信API接口的开发笔记。


## 基本概念介绍

- https://developer.work.weixin.qq.com/document/path/90665


## 获取access_token

- 官方在线调试工具：https://developer.work.weixin.qq.com/resource/devtool

```bash
export CORPID=wwebxxxxxxxxd85a
export CORPSECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
curl "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=$CORPID&corpsecret=$CORPSECRET"
```


## 会议管理

```bash
export MEETING_ID=hy1BxxxxxxxxxxxxxxxxxxxR84vw
export ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
curl -X POST "https://qyapi.weixin.qq.com/cgi-bin/meeting/get_info?access_token=$ACCESS_TOKEN"   -H 'Content-Type: application/json'   -d "{\"meetingid\": \"$MEETING_ID\"}"
```