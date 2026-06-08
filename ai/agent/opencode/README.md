## 简介

OpenCode 是一个开源的 AI 编码代理。它提供终端界面、桌面应用和 IDE 扩展等多种使用方式。

- https://opencode.ai/docs/zh-cn/


## 安装和使用

### 使用容器沙箱

**构建容器沙箱**

创建 `Dockerfile` 文件，并添加以下内容：

```dockerfile
# 使用官方 Node.js 22 或者  24.x 镜像
FROM node:22

# 使用阿里云镜像源加速 npm 包的下载（可选，国内环境推荐）
RUN npm config set registry https://registry.npmmirror.com

# 也可以在 npm install 后面添加参数 --registry=https://registry.npmmirror.com

# 全局安装 bun 和 opencode
# 注意：bun 作为一个全局工具被安装，但运行 opencode 时不一定需要它。
RUN npm install -g bun
RUN npm install -g opencode-ai@latest

# 1. 预先创建容器内的目录结构，并赋予 node 用户权限
# 这样做是为了防止 Docker 在运行时以 root 身份初始化这些挂载点
RUN mkdir -p /home/node/.config/opencode && \
    mkdir -p /home/node/.local/share/opencode && \
    mkdir -p /home/node/.local/state && \
    mkdir -p /home/node/.cache/opencode && \
    mkdir -p /home/node/.agents/skills && \
    chown -R node:node /home/node

# 切换到非 root 用户来运行应用
USER node

# 设置入口点
ENTRYPOINT ["opencode"]
```

构建镜像：

```bash
docker image pull node:22
docker build -t my-opencode .
```

docker命令权限设置：

```bash
# 将当前用户加入 docker 组
sudo usermod -aG docker $USER
# 重启 WSL 或重新登录，使组生效
newgrp docker   # 临时在当前终端生效，或退出重进
# 然后直接运行脚本
```

**创建容器运行脚本**

创建 `opencode.sh` 文件，并添加以下内容：

```bash
#!/usr/bin/env bash
# export OPENCODE_CONF=$(pwd)/conf
# export OPENCODE_DATA=$(pwd)/data
# export OPENCODE_CACHE=$(pwd)/cache
# export AGENT_SKILLS=$(pwd)/skills

docker run -it --rm \
  -e OPENAI_API_KEY="${OPENAI_API_KEY:-}" \
  -e ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}" \
  -v "${OPENCODE_CONF:-${HOME}/.config/opencode}:/home/node/.config/opencode" \
  -v "${OPENCODE_DATA:-${HOME}/.local/share/opencode}:/home/node/.local/share/opencode" \
  -v "${OPENCODE_CACHE:-${HOME}/.cache/opencode}:/home/node/.cache/opencode" \
  -v "${AGENT_SKILLS:-${HOME}/.agents/skills}:/home/node/.agents/skills" \
  -v "${WORKSPACE:-$(pwd)}:/workspace" \
  -w /workspace \
  my-opencode "$@"
```

**权限**：容器内 node 用户的 UID 为 `1000`，请确保宿主机对该 UID 有读写权限。

### 使用系统命令

```bash
# 方式一
curl -fsSL https://opencode.ai/install | bash

# 方式二
npm install -g opencode-ai

# 方式三 2026-5-28 测试官方镜像无法启动TUI。
# docker run -it --rm ghcr.io/anomalyco/opencode

# 进入项目目录
cd /path/to/project
# 运行 OpenCode
opencode
# 项目初始化。OpenCode 会分析你的项目，并在项目根目录创建一个 AGENTS.md 文件。
/init
```


## 配置

1. 格式：OpenCode 支持 `JSON` 和 `JSONC`（带注释的 JSON）格式。
2. 覆盖方式：配置文件是合并在一起的，而不是替换。
3. 目录名称：`.opencode` 和 `~/.config/opencode` 目录的子目录使用复数名称：agents/、commands/、modes/、plugins/、skills/、tools/ 和 themes/。

### 全局配置

1. `$HOME/.config/opencode/opencode.jsonc`: 全局配置文件。
2. `$HOME/.local/share/opencode/auth.json`: 全局的登录凭证，如模型密钥。
3. `$HOME/.local/share/opencode/opencode.db`：

### 项目配置

1. `opencode.json`：项目特定设置
2. `.opencode` 目录：代理、命令、插件

### 自定义路径和目录

- 使用 `OPENCODE_CONFIG` 环境变量指定自定义配置文件路径。
- 优先级顺序中位于 `全局配置` 和 `项目配置` 之间加载。

### 配置自建模型

1. 注入环境变量：`echo "export OPENAI_API_KEY=sk-gSNAgxxxxxxxx" >> ~/.bashrc`
2. 在配置文件：`~/.config/opencode/opencode.jsonc` 添加新的 `provider`

```bash
cat ~/.config/opencode/opencode.jsonc
```

如下所示：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "my-model-api/deepseek-v4-flash",
  "provider": {
    "my-model-api": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Hankin",
      "options": {
        "baseURL": "https://hankin.mysite.com:666/v1",
        "apiKey": "{env:OPENAI_API_KEY}"
      },
      "models": {
        "deepseek-v4-flash": {
          "name": "DeepSeek V4 Flash"
        }
      }
    }
  }
}
```

注：如使用 `/connect` 命令，输入密钥连接模型，会在 `~/.local/share/opencode` 路径生成两个文件：`account.json` 和 `auth.json`。密钥被保存在 `auth.json` 文件中。还需要在 `opencode.jsonc` 配置 `provider` 才能用。

### 快捷键

OpenCode 的大多数快捷键使用 `leader`（前导键）。
默认情况下，`ctrl+x` 是前导键，大多数操作需要您先按下前导键，然后再按对应的快捷键。
例如，要新建一个会话，请先按 `ctrl+x`，然后按 `n`。

```json
{
  "$schema": "https://opencode.ai/config.json",
  "keybinds": {}
}
```

- 也可以通过 `tui.json` 进行自定义：https://opencode.ai/docs/keybinds


## Skills技能

- https://opencode.ai/docs/zh-cn/skills/

技能通过原生的 skill 工具按需加载——代理可以查看可用技能，并在需要时加载完整内容。

为每个技能名称创建一个文件夹，并在其中放入 SKILL.md。 OpenCode 会搜索以下位置：

- 项目配置：.opencode/skills/<name>/SKILL.md
- 全局配置：~/.config/opencode/skills/<name>/SKILL.md
- 项目 Claude 兼容：.claude/skills/<name>/SKILL.md
- 全局 Claude 兼容：~/.claude/skills/<name>/SKILL.md
- 项目代理兼容：.agents/skills/<name>/SKILL.md
- 全局代理兼容：~/.agents/skills/<name>/SKILL.md

### 下载技能

- https://github.com/anthropics/skills

```bash
cd ~
git clone https://github.com/anthropics/skills.git
mkdir -p ~/.agents/skills
mv skills/skills/* ~/.agents/skills
```
