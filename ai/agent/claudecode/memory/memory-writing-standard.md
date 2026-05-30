---
name: memory-writing-standard
description: 新增记忆须精简、指令可执行、去冗余元数据
metadata:
  type: feedback
---

新增记忆必须精简：描述 ≤15 字，正文 ≤2 句，去掉所有不可执行的解释。元数据只保留 `type`，不记录 `originSessionId` 等会话级字段。

**Why:** 记忆在每次对话开头载入，膨胀后浪费 token，且不可执行的叙述性文字降低指令清晰度。
**How to apply:** description 用短语不用完整句；正文只写"什么条件下做什么"；不写背景故事、来源追踪等元信息。
