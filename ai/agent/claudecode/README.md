## 简介

ClaudeCode 是 Claude AI 的编程智能助手。

```bash
npm install -g @anthropic-ai/claude-code
claude --version

# 安装指定版本
npm uninstall -g @anthropic-ai/claude-code
npm install -g @anthropic-ai/claude-code@2.1.153
```

## 设置

### 禁用更新

1. 修改 `~/.claude/settings.json` 配置文件
2. Linux/Mac 执行 `echo "export DISABLE_AUTOUPDATER=1" >> ~/.bashrc`
3. Windows 使用 `PowerShell` 执行命令：`[System.Environment]::SetEnvironmentVariable("DISABLE_AUTOUPDATER", "1", "User")`

- Windows: `C:\Users\<用户名>\.claude\settings.json`
- macOS / Linux: `~/.claude/settings.json`

```json
{
  "env": {
    "DISABLE_AUTOUPDATER": "1",
    "DISABLE_UPDATES": "1"
  },
  "model": "deepseek-v4-flash",
  "theme": "auto"
}
```

- `DISABLE_AUTOUPDATER=1` — 阻断后台静默更新
- `DISABLE_UPDATES=1` — 阻断所有更新（含手动 claude update）

验证：

```bash
# 尝试手动更新（应被阻断）
claude update
Updates are disabled by your administrator. Contact your IT team to get the latest version.
```

### 切换DeepSeek模型

- https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code

Linux / Mac 用户执行以下命令配置 DeepSeek Anthropic API 环境变量

```bash
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN=<你的 DeepSeek API Key>
# export ANTHROPIC_MODEL=deepseek-v4-pro[1m] 默认模型pro太费token了我这改了
export ANTHROPIC_MODEL=deepseek-v4-flash
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash
# 取消思考级别设置
# export CLAUDE_CODE_EFFORT_LEVEL=max
# 禁用更新
export DISABLE_AUTOUPDATER="1"
```

Windows 用户执行：

```powershell
$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="<你的 DeepSeek API Key>"
# $env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]" 默认模型pro太费token了我这改了
$env:ANTHROPIC_MODEL="deepseek-v4-flash"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
# 取消思考级别设置
# $env:CLAUDE_CODE_EFFORT_LEVEL="max"
# 禁用更新
$env:DISABLE_AUTOUPDATER="1"

# 设置中文编码
# chcp 65001
```
