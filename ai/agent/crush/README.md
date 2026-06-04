## 简介

Crush 是 Charm 开发的终端 AI Agent 工具，它把本地命令行、代码上下文和 LLM 提供商连接起来，支持多模型切换、会话上下文、LSP 增强和可扩展 MCP 插件。

- 项目地址：https://github.com/charmbracelet/crush


## 下载

- Windows：https://github.com/charmbracelet/crush/releases/download/v0.75.0/crush_0.75.0_Windows_x86_64.zip
- Linux：https://github.com/charmbracelet/crush/releases/download/v0.75.0/crush_0.75.0_Linux_x86_64.tar.gz

```bash
# Go语言命令直接安装
go install github.com/charmbracelet/crush@latest
```


## 配置和运行数据

可以通过设置来覆盖用户和数据配置位置：

- CRUSH_GLOBAL_CONFIG
- CRUSH_GLOBAL_DATA

1. 配置文件存储位置：

- .crush.json
- crush.json
- $HOME/.config/crush/crush.json

2. 应用程序状态等临时数据存储位置：

```bash
# Unix
$HOME/.local/share/crush/crush.json

# Windows
%LOCALAPPDATA%\crush\crush.json
```

### 模型配置

1. OpenAI 的 API

```json
{
  "$schema": "https://charm.land/crush.json",
  "providers": {
    "deepseek": {
      "type": "openai-compat",
      "base_url": "https://api.deepseek.com/v1",
      "api_key": "$DEEPSEEK_API_KEY",
      "models": [
        {
          "id": "deepseek-chat",
          "name": "Deepseek V3",
          "cost_per_1m_in": 0.27,
          "cost_per_1m_out": 1.1,
          "cost_per_1m_in_cached": 0.07,
          "cost_per_1m_out_cached": 1.1,
          "context_window": 64000,
          "default_max_tokens": 5000
        }
      ]
    }
  }
}
```

2. Anthropic 兼容的API

```json
{
  "$schema": "https://charm.land/crush.json",
  "providers": {
    "custom-anthropic": {
      "type": "anthropic",
      "base_url": "https://api.anthropic.com/v1",
      "api_key": "$ANTHROPIC_API_KEY",
      "extra_headers": {
        "anthropic-version": "2023-06-01"
      },
      "models": [
        {
          "id": "claude-sonnet-4-20250514",
          "name": "Claude Sonnet 4",
          "cost_per_1m_in": 3,
          "cost_per_1m_out": 15,
          "cost_per_1m_in_cached": 3.75,
          "cost_per_1m_out_cached": 0.3,
          "context_window": 200000,
          "default_max_tokens": 50000,
          "can_reason": true,
          "supports_attachments": true
        }
      ]
    }
  }
}
```

3. 本地模型

```json
{
  "providers": {
    "ollama": {
      "name": "Ollama",
      "base_url": "http://localhost:11434/v1/",
      "type": "openai-compat",
      "models": [
        {
          "name": "Qwen 3 30B",
          "id": "qwen3:30b",
          "context_window": 256000,
          "default_max_tokens": 20000
        }
      ]
    }
  }
}
{
  "providers": {
    "lmstudio": {
      "name": "LM Studio",
      "base_url": "http://localhost:1234/v1/",
      "type": "openai-compat",
      "models": [
        {
          "name": "Qwen 3 30B",
          "id": "qwen/qwen3-30b-a3b-2507",
          "context_window": 256000,
          "default_max_tokens": 20000
        }
      ]
    }
  }
}
```

### LSP 配置

```json
{
  "$schema": "https://charm.land/crush.json",
  "lsp": {
    "go": {
      "command": "gopls",
      "env": {
        "GOTOOLCHAIN": "go1.24.5"
      }
    },
    "typescript": {
      "command": "typescript-language-server",
      "args": ["--stdio"]
    },
    "nix": {
      "command": "nil"
    }
  }
}
```

### 权限配置

可以允许工具在不提示权限的情况下执行。请谨慎使用此功能。

```json
{
  "$schema": "https://charm.land/crush.json",
  "permissions": {
    "allowed_tools": [
      "view",
      "ls",
      "grep",
      "edit",
      "mcp_context7_get-library-doc"
    ]
  }
}
```

### Agent Skills技能

Crush 支持 [Agent Skills开放标准](https://agentskills.io/)，允许使用可重用的技能包扩展代理的功能，技能是包含SKILL.md指令文件的文件夹。
技能路径：

1. $CRUSH_SKILLS_DIR
2. ~/.config/agents/skills/
3. ~/.config/crush/skills/
4. ~/.agents/skills/
5. 通过 `crush.json` 配置 `options.skills_paths`

配置技能路径：

```json
{
  "$schema": "https://charm.land/crush.json",
  "options": {
    "skills_paths": [
      "~/.config/crush/skills", // Windows: "%LOCALAPPDATA%\\crush\\skills",
      "./project-skills",
    ],
  },
}
```

下载技能：

```bash
# Unix
mkdir -p ~/.config/crush/skills
cd ~/.config/crush/skills
git clone https://github.com/anthropics/skills.git _temp
mv _temp/skills/* . && rm -rf _temp
```

### 禁用自动更新

```bash
export CRUSH_DISABLE_PROVIDER_AUTO_UPDATE=1
```

```json
{
  "$schema": "https://charm.land/crush.json",
  "options": {
    "disable_provider_auto_update": true
  }
}
```


## 日志

日志存储位置: `.crush/logs/crush.log`

```bash
# Print the last 1000 lines
crush logs

# Print the last 500 lines
crush logs --tail 500

# Follow logs in real time
crush logs --follow
```

想要查看更多日志？请crush使用该--debug标志运行命令，或在配置中启用它：

```json
{
  "$schema": "https://charm.land/crush.json",
  "options": {
    "debug": true,
    "debug_lsp": true
  }
}
```
