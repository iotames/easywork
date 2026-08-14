---
title: "DeepSeek Harness (dsh) 介绍"
description: "DeepSeek AI 开源智能体框架：一切皆插件，基于 Cordis，Web UI 开发预览版"
tags: ["AI", "AI Agent", "DeepSeek", "dsh"]
order: 8
---

## 简介

DeepSeek Harness（`dsh`）是 [DeepSeek AI](https://deepseek.com) 开发的开源 agent harness（智能体框架）。它采用**一切皆插件**（Everything is a Plugin）的架构，由 [Cordis](https://github.com/cordiverse/cordis) 驱动。

- 开源主页：https://github.com/deepseek-ai/deepseek-harness
- 官网文档：https://deepseek.com/harness
- 定位：**开发者预览版**，正在快速迭代，**未来会出现破坏兼容性的变更**

## 架构理念

DSH 的核心思想是 **Everything is a Plugin**：几乎所有能力都以插件形式提供，通过 Cordis 组合起来。设计理论可参考论文 [_A Programming Paradigm for Spatiotemporal Composability_](https://github.com/cordiverse/paper)。

> 本目录下的 `whaleui/`（鲸鱼喷泉装饰）即以「插件 + 皮肤」身份挂载到 DSH Web UI 的 `shell.overlay` 浮动层，是其插件化架构的一个实例。

## 安装与运行

前置依赖：`Node.js`。

### 方式一：直接通过 npm 运行（推荐）

```bash
# 一行启动 Web UI，默认地址 http://127.0.0.1:3080
npx @deepseek-ai/dsh web
```

### 方式二：从源码运行

```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

## 核心特性

| 特性 | 说明 |
| --- | --- |
| **一切皆插件** | 工具、皮肤、扩展均以插件形式接入，可组合、可插拔 |
| **Cordis 内核** | 基于 Cordis 的模块化/生命周期管理 |
| **Web UI** | 开箱自带 Web 界面，默认端口 `3080` |
| **多模型 provider** | 支持配置自定义模型与 providers |
| **Python SDK** | 提供 Python SDK，便于编程集成 |

## 插件生态

| 类别 | 说明 |
| --- | --- |
| **dsh-plugin 话题** | 官方维护的插件发现分类，见 https://github.com/topics/dsh-plugin |
| **awesome-dsh-plugin** | 社区精选插件列表（任务看板、Git 图、宠物、皮肤中心等） |

发布插件时给仓库打上 `dsh-plugin` 话题便于被检索。

## 社区与支持

- 反馈 / bug 报告：https://github.com/deepseek-ai/deepseek-harness/discussions
- Discord 社区：https://discord.gg/Ycq5dCaS4
- 开发者预览阶段，文档见仓库 `docs/`：Web UI 指南、开发指南、架构文档

## 本目录内容

```
ai/agent/deepseek-harness/
└── whaleui/               # 一个 dsh 插件实例：Web UI 浮层的鲸鱼喷泉装饰
    ├── WHALE.md           # 插件使用文档
    ├── WhaleOverlay.tsx
    ├── WhaleOverlay.module.css
    ├── FishLogo.tsx
    ├── icons/props.ts
    └── env.d.ts
```

## 许可证

[MIT](LICENSE)，第三方依赖许可见 `THIRD_PARTY_NOTICES.md`。
