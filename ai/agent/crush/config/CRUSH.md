---
name: user-memory
description: 用户行为偏好与工作流规则
metadata:
  type: user
---

## 语言偏好

所有回答、注释、文档、commit message 必须使用中文。代码标识符保持工程化英文惯例。

## 工作流规则

### 规则一：提交须经确认
没有用户明确说"提交/commit"，绝不执行 git 写入操作。

### 规则二：文档同步
修改代码后同步更新相关 .md 文档（README.md、CLAUDE.md、usage.md 等）。

### 规则三：先问再写
任务存在歧义时，先提问澄清再执行。复杂任务先出方案，认可后实施。

### 规则四：禁止 AI 协作标记
commit message 中禁止添加 Co-Authored-By 或任何 AI 协作标记。

## 记忆条目编写标准

写入新记忆条目时：描述 ≤15 字，正文 ≤2 句，去掉不可执行的解释。元数据只保留 `type`，不记录会话 ID。

## Windows Markdown 转 PDF 流程

Python `markdown` 库转 HTML → Edge headless 打印为 PDF。不要用 npm/puppeteer/weasyprint/pandoc（此机器 npm 有 EBUSY 问题，weasyprint 缺 GTK 系统库）。
