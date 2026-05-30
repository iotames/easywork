---
title: "OpenClaw介绍"
tags: ["AI", "AI Agent"]
order: 1
---

## 介绍

OpenClaw是一个开源的自动化工具项目，主要用于简化重复性任务的处理流程。它通过模块化设计，支持用户根据需求灵活组合功能，常见于数据处理、文件管理或系统运维等场景。该项目由社区驱动，强调可扩展性和易用性，适合开发者和技术爱好者快速构建定制化解决方案。

- 项目主页：https://github.com/openclaw/openclaw
- 官方文档：http://docs.openclaw.ai/
- 运行时：`Node.js >=22.12.0`


## 安装

- 详情查看文件：[install.md](install.md)

提示：OpenClaw不推荐运行在Windows系统上，Windows可以用 `WSL2` 环境。

1. 先安装NodeJS运行环境:

```bash
wget -c https://nodejs.org/dist/v24.14.0/node-v24.14.0-linux-x64.tar.xz
tar -xf node-v24.14.0-linux-x64.tar.xz
# 添加bin目录到PATH环境变量中
# 例：export PATH=$PATH:$(pwd)/node-v24.14.0-linux-x64/bin
```

2. 通过npm安装OpenClaw：

```bash
# 或者使用pnpm安装: pnpm add -g openclaw@latest
npm install -g openclaw@latest

# 安装 Gateway 守护进程（launchd/systemd 用户服务），使其保持运行。
openclaw onboard --install-daemon
```


## 配置

- 详情查看文件：[conf.md](conf.md)

官方文档：

- 命令配置：https://docs.openclaw.ai/cli/configure
- 文件配置：https://docs.openclaw.ai/gateway/configuration-reference
- 配置示例：https://docs.openclaw.ai/gateway/configuration-examples
- 网关常见配置：https://docs.openclaw.ai/gateway/configuration-reference#gateway-field-details


## 常见命令

- 完整入门指南（认证、配对、通道）：https://docs.openclaw.ai/zh-CN/start/getting-started

网关服务管理命令：

```bash
openclaw gateway install
openclaw gateway start
openclaw gateway stop
openclaw gateway restart
openclaw gateway uninstall

# 启动网关服务
openclaw gateway --port 18789 --verbose
# 发送测试消息
openclaw message send --to +1234567890 --message "Hello from OpenClaw"
# 链接到聊天助手 (optionally deliver back to any connected channel: WhatsApp/Telegram/Slack/Discord/Google Chat/Signal/iMessage/BlueBubbles/IRC/Microsoft Teams/Matrix/Feishu/LINE/Mattermost/Nextcloud Talk/Nostr/Synology Chat/Tlon/Twitch/Zalo/Zalo Personal/WebChat)
openclaw agent --message "Ship checklist" --thinking high
```

配置命令：

```bash
# 将 bind 模式从 loopback 改为 lan(局域网/公网可访问)
openclaw config set gateway.bind "lan"
```

### 添加国产大模型

- 模型命令：https://docs.openclaw.ai/concepts/models

添加 DeepSeek 模型：

```bash
# your-api-key替换为实际的APIkey。
# DeepSeek示例：https://platform.deepseek.com/api_keys
openclaw config set 'models.providers.deepseek' --json '{
  "baseUrl": "https://api.deepseek.com/v1",
  "apiKey": "your-api-key",
  "api": "openai-completions",
  "models": [
    { "id": "deepseek-chat", "name": "DeepSeek Chat" },
    { "id": "deepseek-reasoner", "name": "DeepSeek Reasoner" }
  ]
}'

# 设置 models.mode 为 merge
openclaw config set models.mode merge

# 设置默认模型（以deepseek-chat为例）
openclaw models set deepseek/deepseek-chat

# 重启网关，使应用生效。可查看 ~/.openclaw/openclaw.json 查看配置
openclaw gateway restart
```

添加其它大模型：

```bash
openclaw config set 'models.providers.{provider_name}' --json '{
  "baseUrl": "https://{baseurl}",
  "apiKey": "",
  "api": "openai-completions",
  "models": [
    { "id": "{model_id}", "name": "{model_name}" }
  ]
}'

openclaw models set {provider_name}/{model_id}
```


## 升级

- 升级指南：https://docs.openclaw.ai/zh-CN/install/updating

```bash
openclaw update --channel beta
openclaw update --channel dev
openclaw update --channel stable
```


## 卸载

```bash
# 卸载网关服务、本地数据，配置等
openclaw uninstall --all --yes

# 卸载OpenClaw命令工具
npm uninstall -g openclaw
```

--all：彻底删除，包括网关服务、本地数据库、配置文件等所有数据。
--yes：全程自动确认，不需要你手动按Y确认。

----------

参考：https://docs.openclaw.ai/cli/gateway