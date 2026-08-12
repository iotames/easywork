---
title: "Codex介绍"
description: "OpenAI Codex 编程智能助手：安装、全局配置、OTel 可观测性设置心得"
tags: ["AI", "AI Agent", "Codex"]
order: 1
---

## 简介

Codex 是 OpenAI 的编程智能助手，支持终端（CLI）和桌面应用。本机通过全局配置 `~/.codex/config.toml` 接入 DeepSeek API 模型。

- 官方文档：https://developers.openai.com/codex/

## 安装

```bash
codex --version
# 官方安装方式：npm install -g @openai/codex
```

## 全局配置

配置文件：`~/.codex/config.toml`。主要配置块：

| 配置块 | 说明 |
| --- | --- |
| model / model_provider | 模型与提供商（本机为 DeepSeek API） |
| plugins | 插件启用状态 |
| features | 功能开关 |
| mcp_servers | MCP 服务器 |
| projects | 项目信任级别 |
| otel | 可观测性（OTel）配置 |

修改配置前先备份：

```powershell
Copy-Item ~/.codex/config.toml config.toml.bak-$(Get-Date -Format yyyyMMdd-HHmmss)
```

## 可观测性配置（OTel）

痛点：Working/思考过程不可观测。Codex 原生支持 OpenTelemetry（OTel）遥测（官方定位：审计使用、问题调查、合规要求），默认关闭，需在全局配置显式开启。开启后把 traces/metrics 导出到 OTLP 兼容后端，即可将工作过程（工具调用、token、执行轨迹）可视化为 trace 时间线。

### 依赖接收端与端口

OTel 导出**依赖一个 OTLP 接收端**（OTel Collector、Jaeger、Datadog、Grafana Tempo、New Relic 等）。Codex 只负责发送遥测数据，不提供展示界面。端口约定：

| 协议 | 默认端口 | 说明 |
| --- | --- | --- |
| OTLP HTTP | 4318 | `otlp-http` 导出使用的标准端口 |
| OTLP gRPC | 4317 | `otlp-grpc` 导出使用的标准端口 |

当前本机**没有接收端**，`endpoint` 为预留配置，暂不产生实际导出。以后任意机器起了接收端并监听对应端口，无需再改配置即可生效。不要为此在机器上乱装软件。

### 配置结构（2026-08-12 实测确认）

`[otel]` 表字段：

- `environment`：环境标签（默认 dev）
- `log_user_prompt`：是否记录用户提示词内容，保持 `false`（防隐私泄露）
- `exporter` / `trace_exporter` / `metrics_exporter`：untagged 枚举
  - 字符串 `"none"` / `"statsig"`：关闭 / 官方遥测
  - 结构体变体 `otlp-http` / `otlp-grpc`：OTLP 导出，**必填 `endpoint` 和 `protocol`**（`binary` / `json`），可选 `headers`、`tls`

当前已写入全局配置：

```toml
[otel]
environment = "dev"
log_user_prompt = false

[otel.trace_exporter.otlp-http]
endpoint = "http://127.0.0.1:4318"
protocol = "binary"

[otel.metrics_exporter.otlp-http]
endpoint = "http://127.0.0.1:4318"
protocol = "binary"
```

### 验证方法

字段是否被当前版本识别，可用 `-c` 覆盖实测（不联网、不耗 API）：

```bash
codex features list -c 'otel.trace_exporter="otlp-http"'
# 报 invalid type / missing field => 结构不对，逐字段调整
```

配置写入后验证加载：`codex features list` 无 Error 即正常。

## 会话记录与日志

- 会话完整记录（消息、工具调用、token 用量）：`~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`，可自写脚本解析成报告/可视化
- 日志目录：`~/.codex/logs/`（含 codex-tui.log）
- 企业版：Codex analytics / Analytics API、合规日志（组织级指标）
- 自动化任务：Automations 运行记录 + Triage 收件箱
- 快速查看工作过程：直接读会话 JSONL；长期可视化：OTel 导出

## 插件与第三方工具

- 插件可含 MCP server、skills、仅 Codex 的 hooks、自定义 UI；ChatGPT 与 Codex 共享插件目录；`~/.codex/config.toml` 中 `enabled = false` 停用。理论上可自建专门展示工作过程的插件
- agenticants.ai：Coding-Agent Telemetry（聚合 Codex CLI / Claude Code / Copilot CLI 的 OTLP 导出）
- ai-code-sessions（GitHub）：同步 Codex/Claude 会话到 changelog

## 官方文档

- 可观测性 / OTel（Agent approvals & security）：https://learn.chatgpt.com/docs/agent-approvals-security
- 配置参考（otel.*）：https://learn.chatgpt.com/docs/config-file/config-reference
- ChatGPT Work admin FAQ（analytics）：https://learn.chatgpt.com/docs/enterprise/work-admin-faq
- 插件：https://developers.openai.com/codex/plugins
- 插件架构：https://developers.openai.com/plugins/concepts/plugins
- 自动化（Automations）：https://developers.openai.com/codex/app/automations
