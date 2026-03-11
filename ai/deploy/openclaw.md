## 介绍

OpenClaw是一个开源的自动化工具项目，主要用于简化重复性任务的处理流程。它通过模块化设计，支持用户根据需求灵活组合功能，常见于数据处理、文件管理或系统运维等场景。该项目由社区驱动，强调可扩展性和易用性，适合开发者和技术爱好者快速构建定制化解决方案。

- 项目主页：https://github.com/openclaw/openclaw
- 官方文档：http://docs.openclaw.ai/
- 运行时：`Node.js >=22.12.0`


## 安装

提示：OpenClaw不推荐运行在Windows系统上，Win上可以推荐WSL2

先安装NodeJS运行环境:

```bash
wget -c https://nodejs.org/dist/v24.14.0/node-v24.14.0-linux-x64.tar.xz
tar -xf node-v24.14.0-linux-x64.tar.xz
# 添加bin目录到PATH环境变量中
```

### npm包安装

```bash
# 或者使用pnpm安装: pnpm add -g openclaw@latest
npm install -g openclaw@latest

# 安装 Gateway 守护进程（launchd/systemd 用户服务），使其保持运行。
openclaw onboard --install-daemon
```

### 源码安装

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
# 首次运行时自动安装 UI 依赖
pnpm ui:build
pnpm build

# # 全局安装
# # 指定环境变量 export PNPM_HOME="$HOME/.local/share/pnpm"，并将其加入PATH环境变量中。
# pnpm setup
# source ~/.bashrc
# pnpm link --global
# openclaw onboard --install-daemon

# 安装
pnpm openclaw onboard --install-daemon
# Dev loop (auto-reload on TS changes)
pnpm gateway:watch
```

### 容器安装

- https://docs.openclaw.ai/zh-CN/install/docker

```bash
# 仓库根目录执行脚本
# 如报错，执行：sudo rm -rf /var/lib/docker/buildkit && DOCKER_BUILDKIT=0 ./docker-setup.sh
./docker-setup.sh
```


## 安装向导

1. I understand this is personal-by-default and shared/multi-user use requires lock-down. Continue?: `Yes`
2. Onboarding mode: `QuickStart`
3. Model/auth provider: `vLLM`。我这边是自建模型，所以选择vLLM。
4. Select channel (QuickStart): `Skip for now`
5. Search provider: Web联网搜索提供商配置，选择跳过 `Skip for now`。 国内可选 `Kimi (Moonshot)` 月之暗面。
6. Install missing skill dependencies： 非 `MacOS` 苹果系统，直接 `Skip for now`，然后按 `回车键` 继续。苹果系统可在列表中按 `空格键` 选择 `summarize`​ 和 `nano-pdf`。
7. Show Homebrew install command?: 非 `MacOS` 苹果系统，请选择 `No`。苹果系统使用 Homebrew 安装 summarize 等技能依赖。
8. Set GOOGLE_PLACES_API_KEY for goplaces?: 选择 `No`。goplaces技能依赖此密钥来实现地理位置相关操作（如查找附近餐厅、获取地点信息等）。但国内用户无法使用。
9. Set GEMINI_API_KEY for nano-banana-pro?: 选择 `No`。
10. 接下来的一系列API_KEY相关的，一律选择 `No`
11. Enable hooks?：选择 `📝 command-logger` 和 `💾 session-memory`

`OpenClaw默认只允许本地机器访问`。
局域网或外网机器访问，需要特别配置。
                                                             │
-  https://docs.openclaw.ai/gateway/remote                                         │
-  https://docs.openclaw.ai/web/control-ui    

安装过程如下所示：

```bash
openclaw onboard --install-daemon

🦞 OpenClaw 2026.3.8 (3caab92) — Built by lobsters, for humans. Don't question the hierarchy.

▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
██░▄▄▄░██░▄▄░██░▄▄▄██░▀██░██░▄▄▀██░████░▄▄▀██░███░██
██░███░██░▀▀░██░▄▄▄██░█░█░██░█████░████░▀▀░██░█░█░██
██░▀▀▀░██░█████░▀▀▀██░██▄░██░▀▀▄██░▀▀░█░██░██▄▀▄▀▄██
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
                  🦞 OPENCLAW 🦞

┌  OpenClaw onboarding
│
◇  Security ─────────────────────────────────────────────────────────────────────────────────╮
│                                                                                            │
│  Security warning — please read.                                                           │
│                                                                                            │
│  OpenClaw is a hobby project and still in beta. Expect sharp edges.                        │
│  By default, OpenClaw is a personal agent: one trusted operator boundary.                  │
│  This bot can read files and run actions if tools are enabled.                             │
│  A bad prompt can trick it into doing unsafe things.                                       │
│                                                                                            │
│  OpenClaw is not a hostile multi-tenant boundary by default.                               │
│  If multiple users can message one tool-enabled agent, they share that delegated tool      │
│  authority.                                                                                │
│                                                                                            │
│  If you’re not comfortable with security hardening and access control, don’t run           │
│  OpenClaw.                                                                                 │
│  Ask someone experienced to help before enabling tools or exposing it to the internet.     │
│                                                                                            │
│  Recommended baseline:                                                                     │
│  - Pairing/allowlists + mention gating.                                                    │
│  - Multi-user/shared inbox: split trust boundaries (separate gateway/credentials, ideally  │
│    separate OS users/hosts).                                                               │
│  - Sandbox + least-privilege tools.                                                        │
│  - Shared inboxes: isolate DM sessions (`session.dmScope: per-channel-peer`) and keep      │
│    tool access minimal.                                                                    │
│  - Keep secrets out of the agent’s reachable filesystem.                                   │
│  - Use the strongest available model for any bot with tools or untrusted inboxes.          │
│                                                                                            │
│  Run regularly:                                                                            │
│  openclaw security audit --deep                                                            │
│  openclaw security audit --fix                                                             │
│                                                                                            │
│  Must read: https://docs.openclaw.ai/gateway/security                                      │
│                                                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────╯
│
◇  I understand this is personal-by-default and shared/multi-user use requires lock-down. Continue?
│  Yes
│
◇  Onboarding mode
│  QuickStart
│
◇  Existing config detected ──────────────╮
│                                         │
│  workspace: ~/.openclaw/workspace       │
│  model: vllm/unsloth/Qwen3.5-0.8B-GGUF  │
│  gateway.mode: local                    │
│  gateway.port: 18789                    │
│  gateway.bind: loopback                 │
│                                         │
├─────────────────────────────────────────╯
│
◇  Config handling
│  Use existing values
│
◇  QuickStart ─────────────────────────────╮
│                                          │
│  Keeping your current gateway settings:  │
│  Gateway port: 18789                     │
│  Gateway bind: Loopback (127.0.0.1)      │
│  Gateway auth: Token (default)           │
│  Tailscale exposure: Off                 │
│  Direct to chat channels.                │
│                                          │
├──────────────────────────────────────────╯
│
◇  Model/auth provider
│  vLLM
│
◇  vLLM base URL
│  http://127.0.0.1:8086/v1
│
◇  vLLM API key
│  your-api-key-替换成你自己的密钥
│
◇  vLLM model
│  unsloth/Qwen3.5-0.8B-GGUF
│
◇  Model configured ────────────────────────────────────╮
│                                                       │
│  Default model set to vllm/unsloth/Qwen3.5-0.8B-GGUF  │
│                                                       │
├───────────────────────────────────────────────────────╯
│
◇  Default model
│  Keep current (vllm/unsloth/Qwen3.5-0.8B-GGUF)
│
◇  Channel status ────────────────────────────╮
│                                             │
│  Telegram: needs token                      │
│  WhatsApp (default): not linked             │
│  Discord: needs token                       │
│  Slack: needs tokens                        │
│  Signal: needs setup                        │
│  signal-cli: missing (signal-cli)           │
│  iMessage: needs setup                      │
│  imsg: missing (imsg)                       │
│  IRC: not configured                        │
│  Google Chat: not configured                │
│  LINE: not configured                       │
│  Feishu: install plugin to enable           │
│  Google Chat: install plugin to enable      │
│  Nostr: install plugin to enable            │
│  Microsoft Teams: install plugin to enable  │
│  Mattermost: install plugin to enable       │
│  Nextcloud Talk: install plugin to enable   │
│  Matrix: install plugin to enable           │
│  BlueBubbles: install plugin to enable      │
│  LINE: install plugin to enable             │
│  Zalo: install plugin to enable             │
│  Zalo Personal: install plugin to enable    │
│  Synology Chat: install plugin to enable    │
│  Tlon: install plugin to enable             │
│                                             │
├─────────────────────────────────────────────╯
│
◇  How channels work ───────────────────────────────────────────────────────────────────────╮
│                                                                                           │
│  DM security: default is pairing; unknown DMs get a pairing code.                         │
│  Approve with: openclaw pairing approve <channel> <code>                                  │
│  Public DMs require dmPolicy="open" + allowFrom=["*"].                                    │
│  Multi-user DMs: run: openclaw config set session.dmScope "per-channel-peer" (or          │
│  "per-account-channel-peer" for multi-account channels) to isolate sessions.              │
│  Docs: channels/pairing              │
│                                                                                           │
│  Telegram: simplest way to get started — register a bot with @BotFather and get going.    │
│  WhatsApp: works with your own number; recommend a separate phone + eSIM.                 │
│  Discord: very well supported right now.                                                  │
│  IRC: classic IRC networks with DM/channel routing and pairing controls.                  │
│  Google Chat: Google Workspace Chat app with HTTP webhook.                                │
│  Slack: supported (Socket Mode).                                                          │
│  Signal: signal-cli linked device; more setup (David Reagans: "Hop on Discord.").         │
│  iMessage: this is still a work in progress.                                              │
│  LINE: LINE Messaging API webhook bot.                                                    │
│  Feishu: 飞书/Lark enterprise messaging with doc/wiki/drive tools.                        │
│  Nostr: Decentralized protocol; encrypted DMs via NIP-04.                                 │
│  Microsoft Teams: Bot Framework; enterprise support.                                      │
│  Mattermost: self-hosted Slack-style chat; install the plugin to enable.                  │
│  Nextcloud Talk: Self-hosted chat via Nextcloud Talk webhook bots.                        │
│  Matrix: open protocol; install the plugin to enable.                                     │
│  BlueBubbles: iMessage via the BlueBubbles mac app + REST API.                            │
│  Zalo: Vietnam-focused messaging platform with Bot API.                                   │
│  Zalo Personal: Zalo personal account via QR code login.                                  │
│  Synology Chat: Connect your Synology NAS Chat to OpenClaw with full agent capabilities.  │
│  Tlon: decentralized messaging on Urbit; install the plugin to enable.                    │
│                                                                                           │
├───────────────────────────────────────────────────────────────────────────────────────────╯
│
◇  Select channel (QuickStart)
│  Skip for now
Config overwrite: /home/yourname/.openclaw/openclaw.json (sha256 xxxxxxxxxxxxxxx3251aa361e05d11b1169fcbf2736edf4e65a45fxxxxxxxxxx -> xxxxxxxxxxxxcf512a699a4e77cd3ad8a41c147f8309128ef33256xxxxxxxxxx, backup=/home/yourname/.openclaw/openclaw.json.bak)
Updated ~/.openclaw/openclaw.json
Workspace OK: ~/.openclaw/workspace
Sessions OK: ~/.openclaw/agents/main/sessions
│
◇  Web search ────────────────────────────────────────╮
│                                                     │
│  Web search lets your agent look things up online.  │
│  Choose a provider and paste your API key.          │
│  Docs: https://docs.openclaw.ai/tools/web           │
│                                                     │
├─────────────────────────────────────────────────────╯
│
◇  Search provider
│  Skip for now
│
◇  Skills status ─────────────╮
│                             │
│  Eligible: 2                │
│  Missing requirements: 42   │
│  Unsupported on this OS: 7  │
│  Blocked by allowlist: 0    │
│                             │
├─────────────────────────────╯
│
◇  Configure skills now? (recommended)
│  Yes
│
◇  Install missing skill dependencies
│  🧾 summarize
│
◇  Homebrew recommended ──────────────────────────────────────────────────────────╮
│                                                                                 │
│  Many skill dependencies are shipped via Homebrew.                              │
│  Without brew, you'll need to build from source or download releases manually.  │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────╯
│
◇  Show Homebrew install command?
│  No
│
◇  Install failed: summarize — brew not installed — Homebrew is not installed. Install it from https://brew.sh or install "steipete/tap/summarize" manually using your sys…
Tip: run `openclaw doctor` to review skills + requirements.
Docs: https://docs.openclaw.ai/skills
│
◇  Set GOOGLE_PLACES_API_KEY for goplaces?
│  No
│
◇  Set GEMINI_API_KEY for nano-banana-pro?
│  No
│
◇  Set NOTION_API_KEY for notion?
│  No
│
◇  Set OPENAI_API_KEY for openai-image-gen?
│  No
│
◇  Set OPENAI_API_KEY for openai-whisper-api?
│  No
│
◇  Set ELEVENLABS_API_KEY for sag?
│  No
│
◇  Hooks ──────────────────────────────────────────────────────────────────╮
│                                                                          │
│  Hooks let you automate actions when agent commands are issued.          │
│  Example: Save session context to memory when you issue /new or /reset.  │
│                                                                          │
│  Learn more: https://docs.openclaw.ai/automation/hooks                   │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────╯
│
◇  Enable hooks?
│  📝 command-logger, 💾 session-memory
│
◇  Hooks Configured ────────────────────────────────╮
│                                                   │
│  Enabled 2 hooks: session-memory, command-logger  │
│                                                   │
│  You can manage hooks later with:                 │
│    openclaw hooks list                            │
│    openclaw hooks enable <name>                   │
│    openclaw hooks disable <name>                  │
│                                                   │
├───────────────────────────────────────────────────╯
Config overwrite: /home/yourname/.openclaw/openclaw.json (sha256 3c108386ee32cfxxxxxxxxxxxxxxxxxxxx56d13f85ba0b -> 87edb502exxxxxxxxxxxxxxxxxxa5e34399a2d, backup=/home/yourname/.openclaw/openclaw.json.bak)
│
◇  Systemd ────────────────────────────────────────────────────────────────────────────────╮
│                                                                                          │
│  Linux installs use a systemd user service by default. Without lingering, systemd stops  │
│  the user session on logout/idle and kills the Gateway.                                  │
│  Enabling lingering now (may require sudo; writes /var/lib/systemd/linger).              │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────╯
Failed to execute /usr/bin/pkttyagent: No such file or directory
Failed to enable lingering: spawn sudo ENOENT
│
◇  Systemd ──────────────────────────────────────────╮
│                                                    │
│  Run manually: sudo loginctl enable-linger yourname  │
│                                                    │
├────────────────────────────────────────────────────╯
│
◇  Gateway service runtime ────────────────────────────────────────────╮
│                                                                      │
│  QuickStart uses Node for the Gateway service (stable + supported).  │
│                                                                      │
├──────────────────────────────────────────────────────────────────────╯
│
◑  Installing Gateway service…
Installed systemd service: /home/yourname/.config/systemd/user/openclaw-gateway.service
◇  Gateway service installed.
│
◇
Agents: main (default)
Heartbeat interval: 30m (main)
Session store (main): /home/yourname/.openclaw/agents/main/sessions/sessions.json (0 entries)
│
◇  Optional apps ────────────────────────╮
│                                        │
│  Add nodes for extra features:         │
│  - macOS app (system + notifications)  │
│  - iOS app (camera/canvas)             │
│  - Android app (camera/canvas)         │
│                                        │
├────────────────────────────────────────╯
│
◇  Control UI ─────────────────────────────────────────────────────────────────────╮
│                                                                                  │
│  Web UI: http://127.0.0.1:18789/                                                 │
│  Web UI (with token):                                                            │
│  http://127.0.0.1:18789/#token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │
│  Gateway WS: ws://127.0.0.1:18789                                                │
│  Gateway: reachable                                                              │
│  Docs: https://docs.openclaw.ai/web/control-ui                                   │
│                                                                                  │
├──────────────────────────────────────────────────────────────────────────────────╯
│
◇  Start TUI (best option!) ─────────────────────────────────╮
│                                                            │
│  This is the defining action that makes your agent you.    │
│  Please take your time.                                    │
│  The more you tell it, the better the experience will be.  │
│  We will send: "Wake up, my friend!"                       │
│                                                            │
├────────────────────────────────────────────────────────────╯
│
◇  Token ────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                            │
│  Gateway token: shared auth for the Gateway + Control UI.                                  │
│  Stored in: ~/.openclaw/openclaw.json (gateway.auth.token) or OPENCLAW_GATEWAY_TOKEN.      │
│  View token: openclaw config get gateway.auth.token                                        │
│  Generate token: openclaw doctor --generate-gateway-token                                  │
│  Web UI keeps dashboard URL tokens in memory for the current tab and strips them from the  │
│  URL after load.                                                                           │
│  Open the dashboard anytime: openclaw dashboard --no-open                                  │
│  If prompted: paste the token into Control UI settings (or use the tokenized dashboard     │
│  URL).                                                                                     │
│                                                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────╯
│
◇  How do you want to hatch your bot?
│  Open the Web UI
│
◇  Dashboard ready ────────────────────────────────────────────────────────────────╮
│                                                                                  │
│  Dashboard link (with token):                                                    │
│  http://127.0.0.1:18789/#token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │
│  Copy/paste this URL in a browser on this machine to control OpenClaw.           │
│  No GUI detected. Open from your computer:                                       │
│  ssh -N -L 18789:127.0.0.1:18789 yourname@172.16.160.11                            │
│  Then open:                                                                      │
│  http://localhost:18789/                                                         │
│  http://localhost:18789/#token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │
│  Docs:                                                                           │
│  https://docs.openclaw.ai/gateway/remote                                         │
│  https://docs.openclaw.ai/web/control-ui                                         │
│                                                                                  │
├──────────────────────────────────────────────────────────────────────────────────╯
│
◇  Workspace backup ────────────────────────────────────────╮
│                                                           │
│  Back up your agent workspace.                            │
│  Docs: https://docs.openclaw.ai/concepts/agent-workspace  │
│                                                           │
├───────────────────────────────────────────────────────────╯
│
◇  Security ──────────────────────────────────────────────────────╮
│                                                                 │
│  Running agents on your computer is risky — harden your setup:  │
│  https://docs.openclaw.ai/security                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────╯
│
◇  Shell completion ────────────────────────────────────────────────────────╮
│                                                                           │
│  Shell completion installed. Restart your shell or run: source ~/.bashrc  │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────╯
│
◇  Web search ───────────────────────────────────────╮
│                                                    │
│  Web search was skipped. You can enable it later:  │
│    openclaw configure --section web                │
│                                                    │
│  Docs: https://docs.openclaw.ai/tools/web          │
│                                                    │
├────────────────────────────────────────────────────╯
│
◇  What now ─────────────────────────────────────────────────────────────╮
│                                                                        │
│  What now: https://openclaw.ai/showcase ("What People Are Building").  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────╯
│
└  Onboarding complete. Use the dashboard link above to control OpenClaw.

```

- 非MacOS苹果系统不需要安装 `Homebrew` ，不用勾选 `Skills` 技能

```bash
◇  Show Homebrew install command?
│  No
│
◇  Install failed: summarize — brew not installed — Homebrew is not installed. Install it from https://brew.sh or install "steipete/tap/summarize" manually using your sys…
Tip: run `openclaw doctor` to review skills + requirements.
Docs: https://docs.openclaw.ai/skills
```


## 升级

- 升级指南：https://docs.openclaw.ai/zh-CN/install/updating

```bash
openclaw update --channel beta
openclaw update --channel dev
openclaw update --channel stable
```


## 入门指南

- 完整入门指南（认证、配对、通道）：https://docs.openclaw.ai/zh-CN/start/getting-started

```bash
openclaw onboard --install-daemon

openclaw gateway --port 18789 --verbose

# 发送测试消息
openclaw message send --to +1234567890 --message "Hello from OpenClaw"

# 链接到聊天助手 (optionally deliver back to any connected channel: WhatsApp/Telegram/Slack/Discord/Google Chat/Signal/iMessage/BlueBubbles/IRC/Microsoft Teams/Matrix/Feishu/LINE/Mattermost/Nextcloud Talk/Nostr/Synology Chat/Tlon/Twitch/Zalo/Zalo Personal/WebChat)
openclaw agent --message "Ship checklist" --thinking high
```

网关服务管理命令：

```bash
openclaw gateway install
openclaw gateway start
openclaw gateway stop
openclaw gateway restart
openclaw gateway uninstall
```

参考：https://docs.openclaw.ai/cli/gateway
