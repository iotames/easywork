# CODEX_CONFIG — Codex 工作过程可观测性配置

## 目的

让 Codex 在回复之前的工作过程可观测：知道它在干嘛、在想什么、状态如何、何时完成。

核心诉求：**不可观测可不行**。已配置内容适用于 CLI / 桌面端 / IDE 插件（三端共用 `~/.codex/config.toml`）。

## 痛点

1. 默认 TUI 底部状态行只有模型名和当前目录，运行中不显示 Ready / Working / Thinking。
2. 推理过程默认只显示摘要甚至不显示，无法知道"在想什么"。
3. 长工具调用（如一条 shell 命令跑 30s）执行期间界面只有 Working + spinner，无中间播报，形成信息黑洞。
4. 完成后无提醒，终端失焦时会错过结果。

## 如何配置

全局配置 `~/.codex/config.toml`：

```toml
# ===== 工作过程可观测性配置 =====

# 推理显示
model_reasoning_summary = "detailed"   # 推理摘要详细度: auto | concise | detailed | none
show_raw_agent_reasoning = true        # 模型输出原始推理内容时直接显示（部分模型/提供商不支持）
# hide_agent_reasoning = true          # 需要隐藏推理事件时启用（CI 日志常用，同时影响 codex exec 输出）

# 日志
log_dir = "~/.codex/log"               # 日志目录（默认 $CODEX_HOME/log）；显式设置后启用纯文本 codex-tui.log

[tui]
animations = true                       # 终端动画（欢迎屏、shimmer、spinner），默认 true
status_line = [                         # 底部状态行项目，顺序即显示顺序
  "run-state",                          # Ready / Working / Thinking —— 回答"状态如何"
  "task-progress",                      # update_plan 清单进度（动态）—— 回答"进展如何"
  "model-with-reasoning",               # 模型名 + 推理档位
  "context-remaining",                  # 剩余上下文百分比
  "current-dir",                        # 当前目录
]
terminal_title = ["spinner", "project"] # 终端标签页显示旋转动画 + 项目名
notification_method = "osc9"            # 终端内通知，合法值: auto | osc9 | bel（auto 自动探测，osc9 为 OSC 9 终端控制序列）
notification_condition = "unfocused"    # 仅终端失焦时通知；"always" = 始终通知
notifications = true                    # 桌面通知
```

## 说明

- **status_line 可用项**：`model`、`model-with-reasoning`、`reasoning`、`current-dir`、`project-name`、`hostname`、`git-branch`、`pull-request-number`、`branch-changes`、`run-state`、`permissions`、`approval-mode`、`context-remaining`、`context-used`、`five-hour-limit`、`weekly-limit`、`codex-version`、`context-window-size`、`used-tokens`、`total-input-tokens`、`total-output-tokens`、`thread-credits`、`estimated-thread-cost`、`thread-id`、`fast-mode`、`raw-output`、`thread-title`、`workspace-headline`、`task-progress`。
- **推理显示**：`model_reasoning_summary = "none"` 可完全关闭摘要；`show_raw_agent_reasoning` 只在模型主动输出原始推理时生效。
- **日志**：RUST_LOG 控制日志级别（TUI 默认 `codex_core=info,codex_tui=info`）；`log_dir` 等路径字段的 `~` 会自动展开。
- **进阶观测**：`[otel]` 可导出结构化日志（`codex.api_request`、`codex.tool_result` 等事件），用于事后查证每次 API 请求与工具调用。
- **产品边界**：工具执行期间 TUI 只有 Working + 计时器，无"实时工具内容"显示；hooks 的 `statusMessage` 只显示 hook 脚本自身运行状态。这个空档靠 agent 行为规则补齐（见下）。
- **生效方式**：修改配置后重启 Codex / 新开会话加载；项目级 `.codex/config.toml` 可覆盖全局配置。

## 总结经验

1. **可观测分层**：状态行看状态 → 推理摘要/原始推理看思考 → 日志/OTel 事后查证 → 通知兜底。
2. **30s 静默的根因**是工具调用原子性：单条命令执行期间无法插入中间播报，产品层无纯配置方案，只能靠 agent 调用前播报：
   - `~/.codex/AGENTS.md` 工作流规则 5：**预计耗时>10s 的工具调用须先播报内容与预计耗时，完成后播报结果；禁止长时间静默**。
3. **配置要写到全局才三端生效**；`~` 在路径字段会被自动展开，无需写死绝对路径。
4. **通知默认"失焦才提醒"**，避免一直盯着终端时被刷屏；需要强提醒可改 `"always"`。
5. 本配置与规则沉淀于 2026-08-24，依据 OpenAI 官方文档（developers.openai.com/codex/config-reference、config-advanced）与本仓库实现。
