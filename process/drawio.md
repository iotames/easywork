---
lang: zh-CN
title: draw.io简介
---

## Draw.io简介

Draw.io（现官方域名 `diagrams.net`）是由英国软件公司 JGraph Ltd 开发并维护的一款**免费、开源**的图表绘制软件。它原生支持多种文件格式，并能与其他专业图表工具高效协作。

-   **官方网站**: [https://www.drawio.com](https://www.drawio.com)
-   **在线使用**: [https://app.diagrams.net](https://app.diagrams.net)
-   **GitHub 组织主页**: [https://github.com/jgraph](https://github.com/jgraph)
-   **Web 端源码**: [https://github.com/jgraph/drawio](https://github.com/jgraph/drawio)
-   **桌面端项目**: [https://github.com/jgraph/drawio-desktop](https://github.com/jgraph/drawio-desktop)
-   **使用示例**: [https://drawio-app.com/examples/](https://drawio-app.com/examples/)


## 支持格式

Draw.io 提供了强大的格式转换能力，表格整理了主要支持的导入和导出格式。

| 操作 | 格式 |
| :--- | :--- |
| 导入 | `.vsdx`, `.gliffy`, `.json` (Lucidchart), `.drawio`, `.png`, `.jpeg`, `.svg`, `.csv` |
| 导出 | `.drawio` (XML), `.png`, `.jpeg`, `.svg`, `.pdf`, `.html`, `.vsdx` |

- 原生文件 `.drawio` 本质是 XML 纯文本，便于 Git 等版本管理。
- 可在 `.svg` 或 `.png` 中嵌入可编辑数据，直接在 GitHub 等平台预览和再编辑。

### 行业标准格式支持：

- BPMN 2.0
- UML 2.5：支持UML统一建模语言。包含用例图、类图、时序图、活动图、状态机图、组件图、部署图等。
- 实体关系图 (ERD)
- 网络拓扑图 (含 AWS、Azure、GCP、Kubernetes 等)
- ISO 流程图：支持 `ISO/IEC 5807` 标准
