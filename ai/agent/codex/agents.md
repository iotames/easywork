---
title: "Codex 子 Agent 与多智能体角色团队配置"
description: "内置角色、自定义 agent 文件、[agents] 全局设置、角色覆盖、multi_agent_v2 后端及与 agents.enabled 的优先级关系"
tags: ["AI", "AI Agent", "Codex"]
order: 4
---

# Codex 子 Agent 与多智能体角色团队配置

## 概览：两套后端

| 后端 | 状态 | 角色定义方式 | 编排工具 |
| --- | --- | --- | --- |
| V1 子代理 | 默认启用（`multi_agent` stable） | `~/.codex/agents/*.toml` 自定义 agent 文件 | spawn（内置）、`/agent` 线程切换 |
| V2 多智能体 | 实验性，默认关闭（`multi_agent_v2` stable false） | `AgentRoleToml` 角色（`config_file` / `description` / `nickname_candidates`） | `spawn_agent` / `wait_agent` |

本机 0.149.1 实测：`codex features list` 显示 `multi_agent = stable true`、`multi_agent_v2 = stable false`。

## 1. 子 Agent 基础（V1，默认启用）

主线程可并行 spawn 多个子代理，等全部结果后汇总到主线程。触发方式：

- 直接在提示词里要求（"spawn 两个代理"、"按角色并行"）；
- AGENTS.md / skill 指令要求委派；
- 官方示例："Spawn one agent per point, wait for all of them, and summarize the result for each point."

管理与查看：CLI 用 `/agent` 切换/查看各子线程；`codex agents` 浏览所有 agent 会话。

内置角色：

| 角色 | 定位 |
| --- | --- |
| `default` | 通用兜底 |
| `worker` | 执行型：实现与修复 |
| `explorer` | 只读代码库探索 |

## 2. 全局 [agents] 设置（V1）

```toml
[agents]
enabled = true                              # 是否启用多智能体工具，默认 true
max_concurrent_threads_per_session = 6      # 并发子线程上限（不含主线程）
default_subagent_model = "gpt-5.6-terra"    # spawn 未指定模型时的默认
default_subagent_reasoning_effort = "medium"
interrupt_message = true                    # 中断时给子代理记一条可见消息
```

其他说明（官方 schema / 文档）：

- `max_concurrent_threads_per_session` 不设置时由后端选默认；`max_threads` 是旧别名。
- `enabled = false` 时模型拿不到 spawn 工具，所有任务只能主线程串行；它不影响 `~/.codex/agents/` 文件本身，只影响能否 spawn。
- V1 还有 `max_depth`（子线程最大嵌套深度），V2 忽略它。

## 3. 自定义 agent（角色）文件

位置：`~/.codex/agents/<name>.toml`（个人）或 `.codex/agents/<name>.toml`（项目）。

必填字段：`name`、`description`、`developer_instructions`。可叠加任意 config.toml 键：`model`、`model_reasoning_effort`、`sandbox_mode`、`mcp_servers`、`skills.config` 等。

```toml
# ~/.codex/agents/explorer.toml
name = "explorer"
description = "只读代码库探索：先收集证据再提建议"
model = "gpt-5.6-luna"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"

developer_instructions = """
只做探索：追踪真实执行路径、引用文件和符号；除非主代理要求，否则不提修改方案。
"""
```

优先级：spawn 显式值 > agent 文件内设置 > `[agents]` 默认 > 父线程值。自定义 agent 与内置同名时，自定义优先。

角色覆盖（`[agents.<role>]` 指向 role 配置层）：

```toml
[agents.reviewer]
description = "审查正确性、安全性和测试风险"
config_file = "./agents/reviewer.toml"   # 相对定义它的 config.toml 解析
```

## 4. 多智能体 V2（实验性）

开启：

```toml
[features]
multi_agent_v2 = true
```

角色字段（`AgentRoleToml`）：

| 字段 | 说明 |
| --- | --- |
| `config_file` | 角色专属配置层路径 |
| `description` | spawn 工具里展示的角色说明（角色文件未提供时必填） |
| `nickname_candidates` | 该角色 spawn 出的 agent 候选昵称 |

V2 级联配置（`MultiAgentV2ConfigToml`）常用字段：

- `enabled`：V2 开关（优先于 `agents.enabled`）
- `max_concurrent_threads_per_session`：并发子线程上限
- `wait_agent_enabled`：是否暴露 `wait_agent` 工具
- `expose_spawn_agent_model_overrides`：spawn 工具直接选模型/推理强度
- `subagent_developer_instructions`：无角色专属指令时的子代理默认指令

注意：V2 开启后，V1 的 `~/.codex/agents/*.toml` 自定义 agent 入口可能被隐藏（官方仓库 issue #31097 反馈：部分版本强制切 V2 并隐藏文档化的自定义 agent 控件）。选择 V2 就按角色方式配置，别混用。

## 5. agents.enabled 与 multi_agent_v2 的关系（不冲突，优先级覆盖）

官方 schema 原文（`agents.enabled`）：

> Whether multi-agent tools are enabled. Defaults to true. An enabled `features.multi_agent_v2` setting takes precedence.

| 配置组合 | 实际效果 |
| --- | --- |
| 默认（V2 不写或 false） | V1 子代理生效，`agents.enabled` 管开关，角色用 `~/.codex/agents/*.toml` |
| `multi_agent_v2 = true` + `agents.enabled = true` | V2 接管，spawn/wait 工具可用，角色按 V2 方式配置 |
| `multi_agent_v2 = true` + `agents.enabled = false` | 仍然启用多智能体工具——V2 优先，`agents.enabled=false` 被覆盖 |

结论：二选一。继续用 V1 就保持 `multi_agent_v2 = false`；想用 V2 就显式开启并把角色迁到 role 配置层。要彻底禁用多智能体，必须同时关掉 V2（`multi_agent_v2 = false`）并设 `agents.enabled = false`（或运行时 `--disable multi_agent_v2`）。

## 6. 团队配置完整示例

```toml
# ~/.codex/config.toml
[agents]
max_concurrent_threads_per_session = 6
default_subagent_model = "gpt-5.6-terra"
default_subagent_reasoning_effort = "medium"
```

```toml
# ~/.codex/agents/explorer.toml
name = "explorer"
description = "只读探索代码库、收集证据"
model = "gpt-5.6-luna"
sandbox_mode = "read-only"
developer_instructions = """追踪执行路径，返回文件与符号引用。"""
```

```toml
# ~/.codex/agents/worker.toml
name = "worker"
description = "按已确认方案做最小实现与修复"
model = "gpt-5.6"
sandbox_mode = "workspace-write"
developer_instructions = """只改与任务相关的文件，改完自测。"""
```

```toml
# ~/.codex/agents/reviewer.toml
name = "reviewer"
description = "审查正确性、安全、回归与测试覆盖"
model = "gpt-5.6-terra"
model_reasoning_effort = "high"
sandbox_mode = "read-only"
developer_instructions = """只读审查，先给结论再给证据，不代改代码。"""
```

会话编排示例：

```
让 explorer 梳理影响路径，worker 实现最小修复，reviewer 审查最终 diff。
三个并行执行，全部完成后按角色汇总结果。
```

## 7. 注意事项

- 每个子代理独立跑模型和工具，token 消耗明显高于单代理；读多写少的并行最划算，并行改同一批文件易冲突。
- 子代理继承父线程的沙箱/审批运行时覆盖（如 `/permissions`、`--yolo`），会覆盖 agent 文件里的默认值。
- 角色文件等于"模型 + 用途 + 权限"的固化清单，模型多时按角色名 spawn，不用记模型 ID。
- 纯文本模型看图可复用同一套角色机制，见 [vision-agent.md](vision-agent.md)。

## 参考

- 官方 Subagents 文档：https://developers.openai.com/codex/subagents
- 官方 config schema（openai/codex 仓库 `codex-rs/core/config.schema.json`）
- MultiAgentV2 强制切换问题：https://github.com/openai/codex/issues/31097

> 说明：developers.openai.com 在当前网络直连被 403，内容经代理（127.0.0.1:7897）从官方仓库与 Web Archive 存档核对。

---

- 返回：[README.md](README.md)