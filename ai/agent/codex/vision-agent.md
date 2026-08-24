---
title: "Codex 视觉模型调度方案"
description: "纯文本模型无法看图时，用自定义视觉 Agent 子代理读取图片：view_image 机制、配置步骤、替代方案"
tags: ["AI", "AI Agent", "Codex"]
order: 3
---

# Codex 视觉模型调度方案（纯文本模型看图）

## 背景

配置了多家供应商、很多模型，其中只有少数模型支持原生图片输入（非 OCR），大部分是纯文本模型，无法识别图片内容。目标：纯文本模型遇到图片时，调用能识图的模型看图，把文字结果交给纯文本模型继续处理。

## 结论：支持"配置模型自行调度"，但没有自动内容路由开关

- Codex **没有**"检测到图片就自动路由给视觉模型"的原生开关。
- 但支持**自定义 Agent（子代理）+ 不同模型**：主模型（纯文本）遇到图片任务时 spawn 绑定视觉模型的子代理，子代理看图后返回文字结果，主线程汇总。
- 官方文档明确：本地 Codex 在直接要求、或 AGENTS.md / skill 指令要求时会委派子代理；每个子代理的模型、推理强度、沙箱可单独配置。

## 关键机制

- Codex 按模型目录（`input_modalities`）判断模型能否收图；纯文本模型粘贴图片会被拒绝（提示 "model does not support image input"）。
- 只有声明支持图片输入的模型才会获得 `view_image` 工具，可自主读取磁盘上的图片文件路径。
- 因此正确姿势：图片在磁盘上有路径 → 主模型把路径交给视觉子代理 → 子代理用 `view_image` 读取并返回文字描述。

## 配置步骤

### 1. 配置视觉模型供应商（如尚未配置）

视觉模型与普通模型不在同一供应商时，先在用户级 `~/.codex/config.toml` 增加 `[model_providers.<id>]`，完整配置见 [model-providers.md](model-providers.md)。

### 2. 定义视觉 Agent

用户级：`~/.codex/agents/vision.toml`；项目级：`.codex/agents/vision.toml`。

```toml
name = "vision"
description = "读图和描述图片内容的代理；当出现图片文件路径或需要查看截图/设计稿时使用"
model = "你的视觉模型ID"
model_provider = "视觉模型所在供应商ID"   # 与普通模型不同供应商时必填
model_reasoning_effort = "medium"

developer_instructions = """
使用 view_image 工具读取主代理提供的图片路径，用自然语言详细描述图片内容、界面元素和图中文字。
只做看图任务，返回文字结论，不修改代码。
"""
```

### 3. 让主模型知道要调度

在 `~/.codex/AGENTS.md` 或会话提示词中写：

```markdown
规则：用户提供图片文件路径时，先 spawn `vision` 子代理读取并描述图片，再基于描述继续任务；不要自己尝试读取图片。
```

## 使用方式

- 会话中直接说："用 vision 代理看一下 xxx.png"；
- 手动切换：会话内 `/model` 选视觉模型；
- 启动指定：`codex -m <视觉模型>`；
- 非交互：`codex exec -m <视觉模型> --image 图1.png,图2.png "描述并对比"`（Codex 0.149.1 已验证支持 `--image`）。

## 局限与替代方案

- 粘贴到纯文本模型的图片会被拒绝，图片必须存在于磁盘且有路径，视觉子代理才能 `view_image`。
- 子代理消息是文本，传文件路径即可；视觉子代理自身按需读文件，不占主模型上下文。
- 若图片来自工具截图（如浏览器截图），可写 skill/脚本：模型调用脚本，脚本执行 `codex exec -m <视觉模型> --image <路径> "描述图片"`，把文本结果交回主模型。这是社区常用的"外挂视觉"做法，比子代理多一层，但适合全自动截图场景。

## 参考

- Subagents（自定义 Agent）：https://developers.openai.com/codex/subagents
- Models（模型选择、Chat Completions 弃用说明）：https://developers.openai.com/codex/models
- GitHub Discussion #2085（Codex CLI 图片输入方式）：https://github.com/openai/codex/discussions/2085
- view_image 按模型模态门控的官方提交：https://github.com/openai/codex/commit/409ec76fbcd40dfaf82851669352534c15427aeb

> 说明：developers.openai.com 在当前网络直连被 403，内容经代理（127.0.0.1:7897）从官方仓库与 Web Archive 存档核对。

---

- 返回：[README.md](README.md)