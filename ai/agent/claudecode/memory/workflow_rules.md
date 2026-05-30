---
name: workflow-rules
description: 工作流程规则 — 提交确认、文档同步、先问再写、禁止AI标记
metadata:
  type: feedback
---

## 规则一：提交必须经用户确认

没有用户明确说"提交/commit"，绝不执行 git 写入操作。

**Why:** 用户对版本控制有严格管控，不希望 AI 擅自提交。
**How to apply:** 不自动执行 commit/push/add。除非用户明确指示"提交"或"commit"。

## 规则二：.md 文档与代码同步

修改代码后，同步更新相关 .md 文档（README.md、CLAUDE.md、usage.md 等）。

**Why:** 文档与代码脱节降低可维护性。
**How to apply:** 每次改代码后检查文档的描述、示例、配置说明，过时即更新。

## 规则三：交互式确认

任务存在歧义或未说明的决策点时，先提问澄清再执行。

**Why:** 避免返工，确保交付物符合预期。
**How to apply:** 接到任务先判断模糊之处，有则先问再写。复杂任务先出方案，认可后实施。

## 规则四：禁止 AI 协作标记

git commit message 中禁止添加 Co-Authored-By 或任何 AI 协作标记。

**Why:** 用户认为暴露 AI 协作信息是不必要的隐私问题。
**How to apply:** 所有 git commit 不添加此类标记。即使工具默认行为包含，也必须手动移除。
