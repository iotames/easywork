---
title: "Codex 多模型供应商配置"
description: "自定义模型供应商、多供应商与多模型配置、Profile 切换、字段参考、注意事项"
tags: ["AI", "AI Agent", "Codex"]
order: 2
---
# Codex 多模型供应商配置

Codex 用「供应商 + 模型」两层选择模型：`[model_providers.<id>]` 定义一个供应商（base_url、认证、协议等连接信息），`model_provider` 选择用哪个供应商，`model` 选择该供应商下的具体模型。**一个供应商可配多个模型，同一供应商内切换只改 `model`**。

配置文件为用户级 `~/.codex/config.toml`（Windows：`%USERPROFILE%\.codex\config.toml`）。

### 内置供应商

| ID | 说明 |
| --- | --- |
| `openai` | OpenAI 官方，默认；改地址用顶层 `openai_base_url`，不要新建 `[model_providers.openai]` |
| `ollama` / `lmstudio` | 本地开源模型（`--oss` 模式，可用 `oss_provider = "ollama"` 设默认） |
| `amazon-bedrock` | AWS Bedrock，认证走 `[model_providers.amazon-bedrock.aws]`（`profile` / `region`） |

内置 ID 保留、不可覆盖；自定义供应商需另起 ID。

### 多供应商配置示例

```toml
# 默认组合
model = "gpt-5.4"
model_provider = "openai"

# 只把内置 openai 指到代理/网关（二选一，不必新建 provider）：
# openai_base_url = "https://us.api.openai.com/v1"

[model_providers.proxy]
name = "OpenAI using LLM proxy"
base_url = "http://proxy.example.com"
env_key = "OPENAI_API_KEY"

[model_providers.local_ollama]
name = "Ollama"
base_url = "http://localhost:11434/v1"

[model_providers.mistral]
name = "Mistral"
base_url = "https://api.mistral.ai/v1"
env_key = "MISTRAL_API_KEY"

[model_providers.azure]
name = "Azure OpenAI"
base_url = "https://YOUR_PROJECT_NAME.openai.azure.com/openai"
env_key = "AZURE_OPENAI_API_KEY"
query_params = { api-version = "2025-04-01-preview" }
wire_api = "responses"
request_max_retries = 4
stream_max_retries = 10
stream_idle_timeout_ms = 300000
```

### 一个供应商多个模型

模型不需预登记，`model` 填该端点支持的 ID 即可，切换方式：

- 会话内 `/model` 切换供应商与模型；
- 单次运行 `codex --model gpt-5.4` 或 `codex --config model='"gpt-5.4"'`；
- 把「供应商 + 模型」组合存成 profile 文件一键切换（见下）。

### Profile：固定供应商+模型组合

Codex 0.134.0 起，`--profile` 读取独立文件 `~/.codex/profile-name.config.toml`（顶层键直接写，不再用 `[profiles.<name>]` 表，也不再支持顶层 `profile = "..."`）：

```toml
# ~/.codex/proxy-code.config.toml
model = "deepseek-chat"
model_provider = "proxy"
```

```bash
codex --profile proxy-code
codex exec --profile proxy-code "review this change"
```

### 供应商字段参考

| 字段 | 说明 |
| --- | --- |
| `name` | 界面显示名 |
| `base_url` | API 基础地址（不含请求路径，Codex 自动拼接） |
| `env_key` | 从该环境变量读 API key，放入 `Authorization: Bearer <token>` |
| `env_key_instructions` | API key 获取/设置指引（可选） |
| `wire_api` | 协议：官方当前文档标注 `responses`（默认）；旧版支持 `chat`，以安装版本为准 |
| `query_params` | 追加查询参数（如 Azure 的 `api-version`） |
| `http_headers` / `env_http_headers` | 固定请求头 / 从环境变量取值的请求头 |
| `requires_openai_auth` | true 用 OpenAI 登录/API key 认证；false（默认）用 `env_key` |
| `experimental_bearer_token` | 明文 token，官方不推荐 |
| `auth` | 命令式动态 token（`command`/`args`/`timeout_ms`/`refresh_interval_ms`），不与 `env_key`/`experimental_bearer_token`/`requires_openai_auth` 混用 |
| `request_max_retries` / `stream_max_retries` / `stream_idle_timeout_ms` | 网络重试与超时（默认 4 / 5 / 300000） |
| `supports_websockets` | 是否支持 Responses API WebSocket 传输 |

### 注意事项

- 项目级 `.codex/config.toml` 中的 `model_provider`、`model_providers`、`openai_base_url` 等会被忽略并告警，供应商配置必须放用户级 `~/.codex/config.toml`。
- 密钥走环境变量（`env_key`），不要明文写入配置文件；桌面应用/IDE 扩展不继承 shell 环境变量时，把密钥写入 `~/.codex/.env`。
- 改完配置后桌面应用/IDE 需重启或开新会话生效；CLI 可用 `/status` 核对当前供应商。
- 自定义供应商不能使用保留 ID（`openai`/`ollama`/`lmstudio`）。
- 想自定义 UI 里可选的模型清单，可配 `model_catalog_json` 指向模型目录 JSON（可选）。

### 参考

- 高级配置：https://developers.openai.com/codex/config-advanced
- 配置参考：https://developers.openai.com/codex/config-reference
- 基础配置：https://developers.openai.com/codex/config-basic
- Amazon Bedrock 配置：https://help.openai.com/en/articles/20001253

> 说明：developers.openai.com 在当前网络直连被 403，本内容经代理（127.0.0.1:7897）从官方仓库与 Web Archive 存档核对。


---

- 返回：[README.md](README.md)
