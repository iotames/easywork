import{_ as s,c as a,e,o as l}from"./app-B9UTOBRb.js";const i={};function p(c,n){return l(),a("div",null,[...n[0]||(n[0]=[e(`<h2 id="安装环境" tabindex="-1"><a class="header-anchor" href="#安装环境"><span>安装环境</span></a></h2><p>提示：OpenClaw不推荐运行在Windows系统上，Win上可以推荐WSL2</p><p>推荐使用MacOS桌面系统本地安装，其次是Linux系统。</p><h2 id="安装nodejs" tabindex="-1"><a class="header-anchor" href="#安装nodejs"><span>安装NodeJS</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">wget</span> <span class="token parameter variable">-c</span> https://nodejs.org/dist/v24.14.0/node-v24.14.0-linux-x64.tar.xz</span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-xf</span> node-v24.14.0-linux-x64.tar.xz</span>
<span class="line"><span class="token comment"># 添加bin目录到PATH环境变量中</span></span>
<span class="line"><span class="token comment"># 例：export PATH=$PATH:$(pwd)/node-v24.14.0-linux-x64/bin</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装openclaw命令" tabindex="-1"><a class="header-anchor" href="#安装openclaw命令"><span>安装OpenClaw命令</span></a></h2><p>三种OpenClaw安装方式，推荐使用npm包安装。</p><ol><li>npm包安装【推荐】</li></ol><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 或者使用pnpm安装: pnpm add -g openclaw@latest</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> openclaw@latest</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装 Gateway 守护进程（launchd/systemd 用户服务），使其保持运行。</span></span>
<span class="line"><span class="token comment"># 具体步骤查看下一步：安装向导</span></span>
<span class="line">openclaw onboard --install-daemon</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>源码安装【开发者使用】</li></ol><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">git</span> clone https://github.com/openclaw/openclaw.git</span>
<span class="line"><span class="token builtin class-name">cd</span> openclaw</span>
<span class="line"><span class="token function">pnpm</span> <span class="token function">install</span></span>
<span class="line"><span class="token comment"># 首次运行时自动安装 UI 依赖</span></span>
<span class="line"><span class="token function">pnpm</span> ui:build</span>
<span class="line"><span class="token function">pnpm</span> build</span>
<span class="line"></span>
<span class="line"><span class="token comment"># # 全局安装</span></span>
<span class="line"><span class="token comment"># # 指定环境变量 export PNPM_HOME=&quot;$HOME/.local/share/pnpm&quot;，并将其加入PATH环境变量中。</span></span>
<span class="line"><span class="token comment"># pnpm setup</span></span>
<span class="line"><span class="token comment"># source ~/.bashrc</span></span>
<span class="line"><span class="token comment"># pnpm link --global</span></span>
<span class="line"><span class="token comment"># openclaw onboard --install-daemon</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装</span></span>
<span class="line"><span class="token function">pnpm</span> openclaw onboard --install-daemon</span>
<span class="line"><span class="token comment"># Dev loop (auto-reload on TS changes)</span></span>
<span class="line"><span class="token function">pnpm</span> gateway:watch</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>容器安装</li></ol><ul><li>https://docs.openclaw.ai/zh-CN/install/docker</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 仓库根目录执行脚本</span></span>
<span class="line"><span class="token comment"># 如报错，执行：sudo rm -rf /var/lib/docker/buildkit &amp;&amp; DOCKER_BUILDKIT=0 ./docker-setup.sh</span></span>
<span class="line">./docker-setup.sh</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装向导" tabindex="-1"><a class="header-anchor" href="#安装向导"><span>安装向导</span></a></h2><ol><li>I understand this is personal-by-default and shared/multi-user use requires lock-down. Continue?: <code>Yes</code></li><li>Onboarding mode: <code>QuickStart</code></li><li>Model/auth provider: <code>vLLM</code>。我这边是自建模型，所以选择vLLM。</li><li>Select channel (QuickStart): <code>Skip for now</code></li><li>Search provider: Web联网搜索提供商配置，选择跳过 <code>Skip for now</code>。 国内可选 <code>Kimi (Moonshot)</code> 月之暗面。</li><li>Install missing skill dependencies： 非 <code>MacOS</code> 苹果系统，直接 <code>Skip for now</code>，然后按 <code>回车键</code> 继续。苹果系统可在列表中按 <code>空格键</code> 选择 <code>summarize</code>​ 和 <code>nano-pdf</code>。</li><li>Show Homebrew install command?: 非 <code>MacOS</code> 苹果系统，请选择 <code>No</code>。苹果系统使用 Homebrew 安装 summarize 等技能依赖。</li><li>Set GOOGLE_PLACES_API_KEY for goplaces?: 选择 <code>No</code>。goplaces技能依赖此密钥来实现地理位置相关操作（如查找附近餐厅、获取地点信息等）。但国内用户无法使用。</li><li>Set GEMINI_API_KEY for nano-banana-pro?: 选择 <code>No</code>。</li><li>接下来的一系列API_KEY相关的，一律选择 <code>No</code></li><li>Enable hooks?：选择 <code>📝 command-logger</code> 和 <code>💾 session-memory</code></li></ol><p><code>OpenClaw默认只允许本地机器访问</code>。 局域网或外网机器访问，需要特别配置。 │</p><ul><li>https://docs.openclaw.ai/gateway/remote │</li><li>https://docs.openclaw.ai/web/control-ui</li></ul><p>安装过程如下所示：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">openclaw onboard --install-daemon</span>
<span class="line"></span>
<span class="line">🦞 OpenClaw <span class="token number">2026.3</span>.8 <span class="token punctuation">(</span>3caab92<span class="token punctuation">)</span> — Built by lobsters, <span class="token keyword">for</span> humans. Don<span class="token string">&#39;t question the hierarchy.</span>
<span class="line"></span>
<span class="line">▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄</span>
<span class="line">██░▄▄▄░██░▄▄░██░▄▄▄██░▀██░██░▄▄▀██░████░▄▄▀██░███░██</span>
<span class="line">██░███░██░▀▀░██░▄▄▄██░█░█░██░█████░████░▀▀░██░█░█░██</span>
<span class="line">██░▀▀▀░██░█████░▀▀▀██░██▄░██░▀▀▄██░▀▀░█░██░██▄▀▄▀▄██</span>
<span class="line">▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀</span>
<span class="line">                  🦞 OPENCLAW 🦞</span>
<span class="line"></span>
<span class="line">┌  OpenClaw onboarding</span>
<span class="line">│</span>
<span class="line">◇  Security ─────────────────────────────────────────────────────────────────────────────────╮</span>
<span class="line">│                                                                                            │</span>
<span class="line">│  Security warning — please read.                                                           │</span>
<span class="line">│                                                                                            │</span>
<span class="line">│  OpenClaw is a hobby project and still in beta. Expect sharp edges.                        │</span>
<span class="line">│  By default, OpenClaw is a personal agent: one trusted operator boundary.                  │</span>
<span class="line">│  This bot can read files and run actions if tools are enabled.                             │</span>
<span class="line">│  A bad prompt can trick it into doing unsafe things.                                       │</span>
<span class="line">│                                                                                            │</span>
<span class="line">│  OpenClaw is not a hostile multi-tenant boundary by default.                               │</span>
<span class="line">│  If multiple users can message one tool-enabled agent, they share that delegated tool      │</span>
<span class="line">│  authority.                                                                                │</span>
<span class="line">│                                                                                            │</span>
<span class="line">│  If you’re not comfortable with security hardening and access control, don’t run           │</span>
<span class="line">│  OpenClaw.                                                                                 │</span>
<span class="line">│  Ask someone experienced to help before enabling tools or exposing it to the internet.     │</span>
<span class="line">│                                                                                            │</span>
<span class="line">│  Recommended baseline:                                                                     │</span>
<span class="line">│  - Pairing/allowlists + mention gating.                                                    │</span>
<span class="line">│  - Multi-user/shared inbox: split trust boundaries (separate gateway/credentials, ideally  │</span>
<span class="line">│    separate OS users/hosts).                                                               │</span>
<span class="line">│  - Sandbox + least-privilege tools.                                                        │</span>
<span class="line">│  - Shared inboxes: isolate DM sessions (\`session.dmScope: per-channel-peer\`) and keep      │</span>
<span class="line">│    tool access minimal.                                                                    │</span>
<span class="line">│  - Keep secrets out of the agent’s reachable filesystem.                                   │</span>
<span class="line">│  - Use the strongest available model for any bot with tools or untrusted inboxes.          │</span>
<span class="line">│                                                                                            │</span>
<span class="line">│  Run regularly:                                                                            │</span>
<span class="line">│  openclaw security audit --deep                                                            │</span>
<span class="line">│  openclaw security audit --fix                                                             │</span>
<span class="line">│                                                                                            │</span>
<span class="line">│  Must read: https://docs.openclaw.ai/gateway/security                                      │</span>
<span class="line">│                                                                                            │</span>
<span class="line">├────────────────────────────────────────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  I understand this is personal-by-default and shared/multi-user use requires lock-down. Continue?</span>
<span class="line">│  Yes</span>
<span class="line">│</span>
<span class="line">◇  Onboarding mode</span>
<span class="line">│  QuickStart</span>
<span class="line">│</span>
<span class="line">◇  Existing config detected ──────────────╮</span>
<span class="line">│                                         │</span>
<span class="line">│  workspace: ~/.openclaw/workspace       │</span>
<span class="line">│  model: vllm/unsloth/Qwen3.5-0.8B-GGUF  │</span>
<span class="line">│  gateway.mode: local                    │</span>
<span class="line">│  gateway.port: 18789                    │</span>
<span class="line">│  gateway.bind: loopback                 │</span>
<span class="line">│                                         │</span>
<span class="line">├─────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Config handling</span>
<span class="line">│  Use existing values</span>
<span class="line">│</span>
<span class="line">◇  QuickStart ─────────────────────────────╮</span>
<span class="line">│                                          │</span>
<span class="line">│  Keeping your current gateway settings:  │</span>
<span class="line">│  Gateway port: 18789                     │</span>
<span class="line">│  Gateway bind: Loopback (127.0.0.1)      │</span>
<span class="line">│  Gateway auth: Token (default)           │</span>
<span class="line">│  Tailscale exposure: Off                 │</span>
<span class="line">│  Direct to chat channels.                │</span>
<span class="line">│                                          │</span>
<span class="line">├──────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Model/auth provider</span>
<span class="line">│  vLLM</span>
<span class="line">│</span>
<span class="line">◇  vLLM base URL</span>
<span class="line">│  http://127.0.0.1:8086/v1</span>
<span class="line">│</span>
<span class="line">◇  vLLM API key</span>
<span class="line">│  your-api-key-替换成你自己的密钥</span>
<span class="line">│</span>
<span class="line">◇  vLLM model</span>
<span class="line">│  unsloth/Qwen3.5-0.8B-GGUF</span>
<span class="line">│</span>
<span class="line">◇  Model configured ────────────────────────────────────╮</span>
<span class="line">│                                                       │</span>
<span class="line">│  Default model set to vllm/unsloth/Qwen3.5-0.8B-GGUF  │</span>
<span class="line">│                                                       │</span>
<span class="line">├───────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Default model</span>
<span class="line">│  Keep current (vllm/unsloth/Qwen3.5-0.8B-GGUF)</span>
<span class="line">│</span>
<span class="line">◇  Channel status ────────────────────────────╮</span>
<span class="line">│                                             │</span>
<span class="line">│  Telegram: needs token                      │</span>
<span class="line">│  WhatsApp (default): not linked             │</span>
<span class="line">│  Discord: needs token                       │</span>
<span class="line">│  Slack: needs tokens                        │</span>
<span class="line">│  Signal: needs setup                        │</span>
<span class="line">│  signal-cli: missing (signal-cli)           │</span>
<span class="line">│  iMessage: needs setup                      │</span>
<span class="line">│  imsg: missing (imsg)                       │</span>
<span class="line">│  IRC: not configured                        │</span>
<span class="line">│  Google Chat: not configured                │</span>
<span class="line">│  LINE: not configured                       │</span>
<span class="line">│  Feishu: install plugin to enable           │</span>
<span class="line">│  Google Chat: install plugin to enable      │</span>
<span class="line">│  Nostr: install plugin to enable            │</span>
<span class="line">│  Microsoft Teams: install plugin to enable  │</span>
<span class="line">│  Mattermost: install plugin to enable       │</span>
<span class="line">│  Nextcloud Talk: install plugin to enable   │</span>
<span class="line">│  Matrix: install plugin to enable           │</span>
<span class="line">│  BlueBubbles: install plugin to enable      │</span>
<span class="line">│  LINE: install plugin to enable             │</span>
<span class="line">│  Zalo: install plugin to enable             │</span>
<span class="line">│  Zalo Personal: install plugin to enable    │</span>
<span class="line">│  Synology Chat: install plugin to enable    │</span>
<span class="line">│  Tlon: install plugin to enable             │</span>
<span class="line">│                                             │</span>
<span class="line">├─────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  How channels work ───────────────────────────────────────────────────────────────────────╮</span>
<span class="line">│                                                                                           │</span>
<span class="line">│  DM security: default is pairing; unknown DMs get a pairing code.                         │</span>
<span class="line">│  Approve with: openclaw pairing approve &lt;channel&gt; &lt;code&gt;                                  │</span>
<span class="line">│  Public DMs require dmPolicy=&quot;open&quot; + allowFrom=[&quot;*&quot;].                                    │</span>
<span class="line">│  Multi-user DMs: run: openclaw config set session.dmScope &quot;per-channel-peer&quot; (or          │</span>
<span class="line">│  &quot;per-account-channel-peer&quot; for multi-account channels) to isolate sessions.              │</span>
<span class="line">│  Docs: channels/pairing              │</span>
<span class="line">│                                                                                           │</span>
<span class="line">│  Telegram: simplest way to get started — register a bot with @BotFather and get going.    │</span>
<span class="line">│  WhatsApp: works with your own number; recommend a separate phone + eSIM.                 │</span>
<span class="line">│  Discord: very well supported right now.                                                  │</span>
<span class="line">│  IRC: classic IRC networks with DM/channel routing and pairing controls.                  │</span>
<span class="line">│  Google Chat: Google Workspace Chat app with HTTP webhook.                                │</span>
<span class="line">│  Slack: supported (Socket Mode).                                                          │</span>
<span class="line">│  Signal: signal-cli linked device; more setup (David Reagans: &quot;Hop on Discord.&quot;).         │</span>
<span class="line">│  iMessage: this is still a work in progress.                                              │</span>
<span class="line">│  LINE: LINE Messaging API webhook bot.                                                    │</span>
<span class="line">│  Feishu: 飞书/Lark enterprise messaging with doc/wiki/drive tools.                        │</span>
<span class="line">│  Nostr: Decentralized protocol; encrypted DMs via NIP-04.                                 │</span>
<span class="line">│  Microsoft Teams: Bot Framework; enterprise support.                                      │</span>
<span class="line">│  Mattermost: self-hosted Slack-style chat; install the plugin to enable.                  │</span>
<span class="line">│  Nextcloud Talk: Self-hosted chat via Nextcloud Talk webhook bots.                        │</span>
<span class="line">│  Matrix: open protocol; install the plugin to enable.                                     │</span>
<span class="line">│  BlueBubbles: iMessage via the BlueBubbles mac app + REST API.                            │</span>
<span class="line">│  Zalo: Vietnam-focused messaging platform with Bot API.                                   │</span>
<span class="line">│  Zalo Personal: Zalo personal account via QR code login.                                  │</span>
<span class="line">│  Synology Chat: Connect your Synology NAS Chat to OpenClaw with full agent capabilities.  │</span>
<span class="line">│  Tlon: decentralized messaging on Urbit; install the plugin to enable.                    │</span>
<span class="line">│                                                                                           │</span>
<span class="line">├───────────────────────────────────────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Select channel (QuickStart)</span>
<span class="line">│  Skip for now</span>
<span class="line">Config overwrite: /home/yourname/.openclaw/openclaw.json (sha256 xxxxxxxxxxxxxxx3251aa361e05d11b1169fcbf2736edf4e65a45fxxxxxxxxxx -&gt; xxxxxxxxxxxxcf512a699a4e77cd3ad8a41c147f8309128ef33256xxxxxxxxxx, backup=/home/yourname/.openclaw/openclaw.json.bak)</span>
<span class="line">Updated ~/.openclaw/openclaw.json</span>
<span class="line">Workspace OK: ~/.openclaw/workspace</span>
<span class="line">Sessions OK: ~/.openclaw/agents/main/sessions</span>
<span class="line">│</span>
<span class="line">◇  Web search ────────────────────────────────────────╮</span>
<span class="line">│                                                     │</span>
<span class="line">│  Web search lets your agent look things up online.  │</span>
<span class="line">│  Choose a provider and paste your API key.          │</span>
<span class="line">│  Docs: https://docs.openclaw.ai/tools/web           │</span>
<span class="line">│                                                     │</span>
<span class="line">├─────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Search provider</span>
<span class="line">│  Skip for now</span>
<span class="line">│</span>
<span class="line">◇  Skills status ─────────────╮</span>
<span class="line">│                             │</span>
<span class="line">│  Eligible: 2                │</span>
<span class="line">│  Missing requirements: 42   │</span>
<span class="line">│  Unsupported on this OS: 7  │</span>
<span class="line">│  Blocked by allowlist: 0    │</span>
<span class="line">│                             │</span>
<span class="line">├─────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Configure skills now? (recommended)</span>
<span class="line">│  Yes</span>
<span class="line">│</span>
<span class="line">◇  Install missing skill dependencies</span>
<span class="line">│  🧾 summarize</span>
<span class="line">│</span>
<span class="line">◇  Homebrew recommended ──────────────────────────────────────────────────────────╮</span>
<span class="line">│                                                                                 │</span>
<span class="line">│  Many skill dependencies are shipped via Homebrew.                              │</span>
<span class="line">│  Without brew, you&#39;</span>ll need to build from <span class="token builtin class-name">source</span> or download releases manually.  │</span>
<span class="line">│                                                                                 │</span>
<span class="line">├─────────────────────────────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Show Homebrew <span class="token function">install</span> command?</span>
<span class="line">│  No</span>
<span class="line">│</span>
<span class="line">◇  Install failed: summarize — brew not installed — Homebrew is not installed. Install it from https://brew.sh or <span class="token function">install</span> <span class="token string">&quot;steipete/tap/summarize&quot;</span> manually using your sys…</span>
<span class="line">Tip: run <span class="token variable"><span class="token variable">\`</span>openclaw doctor<span class="token variable">\`</span></span> to review skills + requirements.</span>
<span class="line">Docs: https://docs.openclaw.ai/skills</span>
<span class="line">│</span>
<span class="line">◇  Set GOOGLE_PLACES_API_KEY <span class="token keyword">for</span> goplaces?</span>
<span class="line">│  No</span>
<span class="line">│</span>
<span class="line">◇  Set GEMINI_API_KEY <span class="token keyword">for</span> nano-banana-pro?</span>
<span class="line">│  No</span>
<span class="line">│</span>
<span class="line">◇  Set NOTION_API_KEY <span class="token keyword">for</span> notion?</span>
<span class="line">│  No</span>
<span class="line">│</span>
<span class="line">◇  Set OPENAI_API_KEY <span class="token keyword">for</span> openai-image-gen?</span>
<span class="line">│  No</span>
<span class="line">│</span>
<span class="line">◇  Set OPENAI_API_KEY <span class="token keyword">for</span> openai-whisper-api?</span>
<span class="line">│  No</span>
<span class="line">│</span>
<span class="line">◇  Set ELEVENLABS_API_KEY <span class="token keyword">for</span> sag?</span>
<span class="line">│  No</span>
<span class="line">│</span>
<span class="line">◇  Hooks ──────────────────────────────────────────────────────────────────╮</span>
<span class="line">│                                                                          │</span>
<span class="line">│  Hooks <span class="token builtin class-name">let</span> you automate actions when agent commands are issued.          │</span>
<span class="line">│  Example: Save session context to memory when you issue /new or /reset.  │</span>
<span class="line">│                                                                          │</span>
<span class="line">│  Learn more: https://docs.openclaw.ai/automation/hooks                   │</span>
<span class="line">│                                                                          │</span>
<span class="line">├──────────────────────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Enable hooks?</span>
<span class="line">│  📝 command-logger, 💾 session-memory</span>
<span class="line">│</span>
<span class="line">◇  Hooks Configured ────────────────────────────────╮</span>
<span class="line">│                                                   │</span>
<span class="line">│  Enabled <span class="token number">2</span> hooks: session-memory, command-logger  │</span>
<span class="line">│                                                   │</span>
<span class="line">│  You can manage hooks later with:                 │</span>
<span class="line">│    openclaw hooks list                            │</span>
<span class="line">│    openclaw hooks <span class="token builtin class-name">enable</span> <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span>                   │</span>
<span class="line">│    openclaw hooks disable <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span>                  │</span>
<span class="line">│                                                   │</span>
<span class="line">├───────────────────────────────────────────────────╯</span>
<span class="line">Config overwrite: /home/yourname/.openclaw/openclaw.json <span class="token punctuation">(</span>sha256 3c108386ee32cfxxxxxxxxxxxxxxxxxxxx56d13f85ba0b -<span class="token operator">&gt;</span> 87edb502exxxxxxxxxxxxxxxxxxa5e34399a2d, <span class="token assign-left variable">backup</span><span class="token operator">=</span>/home/yourname/.openclaw/openclaw.json.bak<span class="token punctuation">)</span></span>
<span class="line">│</span>
<span class="line">◇  Systemd ────────────────────────────────────────────────────────────────────────────────╮</span>
<span class="line">│                                                                                          │</span>
<span class="line">│  Linux installs use a systemd user <span class="token function">service</span> by default. Without lingering, systemd stops  │</span>
<span class="line">│  the user session on logout/idle and kills the Gateway.                                  │</span>
<span class="line">│  Enabling lingering now <span class="token punctuation">(</span>may require <span class="token function">sudo</span><span class="token punctuation">;</span> writes /var/lib/systemd/linger<span class="token punctuation">)</span>.              │</span>
<span class="line">│                                                                                          │</span>
<span class="line">├──────────────────────────────────────────────────────────────────────────────────────────╯</span>
<span class="line">Failed to execute /usr/bin/pkttyagent: No such <span class="token function">file</span> or directory</span>
<span class="line">Failed to <span class="token builtin class-name">enable</span> lingering: spawn <span class="token function">sudo</span> ENOENT</span>
<span class="line">│</span>
<span class="line">◇  Systemd ──────────────────────────────────────────╮</span>
<span class="line">│                                                    │</span>
<span class="line">│  Run manually: <span class="token function">sudo</span> loginctl enable-linger yourname  │</span>
<span class="line">│                                                    │</span>
<span class="line">├────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Gateway <span class="token function">service</span> runtime ────────────────────────────────────────────╮</span>
<span class="line">│                                                                      │</span>
<span class="line">│  QuickStart uses Node <span class="token keyword">for</span> the Gateway <span class="token function">service</span> <span class="token punctuation">(</span>stable + supported<span class="token punctuation">)</span>.  │</span>
<span class="line">│                                                                      │</span>
<span class="line">├──────────────────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◑  Installing Gateway service…</span>
<span class="line">Installed systemd service: /home/yourname/.config/systemd/user/openclaw-gateway.service</span>
<span class="line">◇  Gateway <span class="token function">service</span> installed.</span>
<span class="line">│</span>
<span class="line">◇</span>
<span class="line">Agents: main <span class="token punctuation">(</span>default<span class="token punctuation">)</span></span>
<span class="line">Heartbeat interval: 30m <span class="token punctuation">(</span>main<span class="token punctuation">)</span></span>
<span class="line">Session store <span class="token punctuation">(</span>main<span class="token punctuation">)</span>: /home/yourname/.openclaw/agents/main/sessions/sessions.json <span class="token punctuation">(</span><span class="token number">0</span> entries<span class="token punctuation">)</span></span>
<span class="line">│</span>
<span class="line">◇  Optional apps ────────────────────────╮</span>
<span class="line">│                                        │</span>
<span class="line">│  Add nodes <span class="token keyword">for</span> extra features:         │</span>
<span class="line">│  - macOS app <span class="token punctuation">(</span>system + notifications<span class="token punctuation">)</span>  │</span>
<span class="line">│  - iOS app <span class="token punctuation">(</span>camera/canvas<span class="token punctuation">)</span>             │</span>
<span class="line">│  - Android app <span class="token punctuation">(</span>camera/canvas<span class="token punctuation">)</span>         │</span>
<span class="line">│                                        │</span>
<span class="line">├────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Control UI ─────────────────────────────────────────────────────────────────────╮</span>
<span class="line">│                                                                                  │</span>
<span class="line">│  Web UI: http://127.0.0.1:18789/                                                 │</span>
<span class="line">│  Web UI <span class="token punctuation">(</span>with token<span class="token punctuation">)</span>:                                                            │</span>
<span class="line">│  http://127.0.0.1:18789/<span class="token comment">#token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │</span></span>
<span class="line">│  Gateway WS: ws://127.0.0.1:18789                                                │</span>
<span class="line">│  Gateway: reachable                                                              │</span>
<span class="line">│  Docs: https://docs.openclaw.ai/web/control-ui                                   │</span>
<span class="line">│                                                                                  │</span>
<span class="line">├──────────────────────────────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Start TUI <span class="token punctuation">(</span>best option<span class="token operator">!</span><span class="token punctuation">)</span> ─────────────────────────────────╮</span>
<span class="line">│                                                            │</span>
<span class="line">│  This is the defining action that makes your agent you.    │</span>
<span class="line">│  Please take your time.                                    │</span>
<span class="line">│  The <span class="token function">more</span> you tell it, the better the experience will be.  │</span>
<span class="line">│  We will send: <span class="token string">&quot;Wake up, my friend!&quot;</span>                       │</span>
<span class="line">│                                                            │</span>
<span class="line">├────────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Token ────────────────────────────────────────────────────────────────────────────────────╮</span>
<span class="line">│                                                                                            │</span>
<span class="line">│  Gateway token: shared auth <span class="token keyword">for</span> the Gateway + Control UI.                                  │</span>
<span class="line">│  Stored in: ~/.openclaw/openclaw.json <span class="token punctuation">(</span>gateway.auth.token<span class="token punctuation">)</span> or OPENCLAW_GATEWAY_TOKEN.      │</span>
<span class="line">│  View token: openclaw config get gateway.auth.token                                        │</span>
<span class="line">│  Generate token: openclaw doctor --generate-gateway-token                                  │</span>
<span class="line">│  Web UI keeps dashboard URL tokens <span class="token keyword">in</span> memory <span class="token keyword">for</span> the current tab and strips them from the  │</span>
<span class="line">│  URL after load.                                                                           │</span>
<span class="line">│  Open the dashboard anytime: openclaw dashboard --no-open                                  │</span>
<span class="line">│  If prompted: <span class="token function">paste</span> the token into Control UI settings <span class="token punctuation">(</span>or use the tokenized dashboard     │</span>
<span class="line">│  URL<span class="token punctuation">)</span>.                                                                                     │</span>
<span class="line">│                                                                                            │</span>
<span class="line">├────────────────────────────────────────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  How <span class="token keyword">do</span> you want to hatch your bot?</span>
<span class="line">│  Open the Web UI</span>
<span class="line">│</span>
<span class="line">◇  Dashboard ready ────────────────────────────────────────────────────────────────╮</span>
<span class="line">│                                                                                  │</span>
<span class="line">│  Dashboard <span class="token function">link</span> <span class="token punctuation">(</span>with token<span class="token punctuation">)</span>:                                                    │</span>
<span class="line">│  http://127.0.0.1:18789/<span class="token comment">#token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │</span></span>
<span class="line">│  Copy/paste this URL <span class="token keyword">in</span> a browser on this machine to control OpenClaw.           │</span>
<span class="line">│  No GUI detected. Open from your computer:                                       │</span>
<span class="line">│  <span class="token function">ssh</span> <span class="token parameter variable">-N</span> <span class="token parameter variable">-L</span> <span class="token number">18789</span>:127.0.0.1:18789 yourname@172.16.160.11                            │</span>
<span class="line">│  Then open:                                                                      │</span>
<span class="line">│  http://localhost:18789/                                                         │</span>
<span class="line">│  http://localhost:18789/<span class="token comment">#token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │</span></span>
<span class="line">│  Docs:                                                                           │</span>
<span class="line">│  https://docs.openclaw.ai/gateway/remote                                         │</span>
<span class="line">│  https://docs.openclaw.ai/web/control-ui                                         │</span>
<span class="line">│                                                                                  │</span>
<span class="line">├──────────────────────────────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Workspace backup ────────────────────────────────────────╮</span>
<span class="line">│                                                           │</span>
<span class="line">│  Back up your agent workspace.                            │</span>
<span class="line">│  Docs: https://docs.openclaw.ai/concepts/agent-workspace  │</span>
<span class="line">│                                                           │</span>
<span class="line">├───────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Security ──────────────────────────────────────────────────────╮</span>
<span class="line">│                                                                 │</span>
<span class="line">│  Running agents on your computer is risky — harden your setup:  │</span>
<span class="line">│  https://docs.openclaw.ai/security                              │</span>
<span class="line">│                                                                 │</span>
<span class="line">├─────────────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Shell completion ────────────────────────────────────────────────────────╮</span>
<span class="line">│                                                                           │</span>
<span class="line">│  Shell completion installed. Restart your shell or run: <span class="token builtin class-name">source</span> ~/.bashrc  │</span>
<span class="line">│                                                                           │</span>
<span class="line">├───────────────────────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  Web search ───────────────────────────────────────╮</span>
<span class="line">│                                                    │</span>
<span class="line">│  Web search was skipped. You can <span class="token builtin class-name">enable</span> it later:  │</span>
<span class="line">│    openclaw configure <span class="token parameter variable">--section</span> web                │</span>
<span class="line">│                                                    │</span>
<span class="line">│  Docs: https://docs.openclaw.ai/tools/web          │</span>
<span class="line">│                                                    │</span>
<span class="line">├────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">◇  What now ─────────────────────────────────────────────────────────────╮</span>
<span class="line">│                                                                        │</span>
<span class="line">│  What now: https://openclaw.ai/showcase <span class="token punctuation">(</span><span class="token string">&quot;What People Are Building&quot;</span><span class="token punctuation">)</span>.  │</span>
<span class="line">│                                                                        │</span>
<span class="line">├────────────────────────────────────────────────────────────────────────╯</span>
<span class="line">│</span>
<span class="line">└  Onboarding complete. Use the dashboard <span class="token function">link</span> above to control OpenClaw.</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>非MacOS苹果系统不需要安装 <code>Homebrew</code> ，不用勾选 <code>Skills</code> 技能</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">◇  Show Homebrew <span class="token function">install</span> command?</span>
<span class="line">│  No</span>
<span class="line">│</span>
<span class="line">◇  Install failed: summarize — brew not installed — Homebrew is not installed. Install it from https://brew.sh or <span class="token function">install</span> <span class="token string">&quot;steipete/tap/summarize&quot;</span> manually using your sys…</span>
<span class="line">Tip: run <span class="token variable"><span class="token variable">\`</span>openclaw doctor<span class="token variable">\`</span></span> to review skills + requirements.</span>
<span class="line">Docs: https://docs.openclaw.ai/skills</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,22)])])}const o=s(i,[["render",p]]),t=JSON.parse('{"path":"/ai/openclaw/install.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1773306291000,"contributors":[{"name":"Hankin","username":"Hankin","email":"554553400@qq.com","commits":4,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"3ab26ddaf1d3c47830829efe41e84c2a28fc8c76","time":1773306291000,"email":"554553400@qq.com","author":"Hankin","message":"UPDATE openclaw"},{"hash":"caedf889e3fb7ed08fef02234bcc5dcf27835807","time":1773223584000,"email":"554553400@qq.com","author":"Hankin","message":"UPDATE openclaw"},{"hash":"7127c5eb7dd6b3e3db837a0c6faf19a841a57b7a","time":1773222325000,"email":"554553400@qq.com","author":"Hankin","message":"UPDATE openclaw"},{"hash":"903ae6ef6e242b903c6285e9710b38ba1f6edb05","time":1773067037000,"email":"554553400@qq.com","author":"Hankin","message":"ADD OpenClaw"}]},"filePathRelative":"ai/openclaw/install.md"}');export{o as comp,t as data};
