---
name: feedback-md-to-pdf
description: Windows环境下将Markdown转PDF的可靠流程，避免npm/puppeteer/weasyprint等不可行方案
metadata: 
  node_type: memory
  type: feedback
---

Windows 环境下 Markdown 转 PDF 的可靠流程：

1. 用 Python `markdown` 库将 md 转为 HTML（pip install markdown，纯Python无系统依赖）
2. 用 Edge headless + `--print-to-pdf` 将 HTML 转为 PDF
3. Edge 路径：`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

**Why:** 此机器 npm 存在 EBUSY 问题，安装依赖频繁失败；weasyprint 缺少 GTK 系统库无法运行；puppeteer/md-to-pdf 需下载 Chromium 且常因锁冲突失败。Edge 已预装且 headless 模式可用，Python `markdown` 库安装简单无依赖。

**How to apply:** 当需要将 markdown 转为 PDF 时，直接使用 Python `markdown` 库 + Edge headless 方案，不要尝试 npm 包、pandoc 或 weasyprint。
