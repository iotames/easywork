---
title: "Pi介绍"
description: "开源命令行编码代理 Pi：安装、配置、资源加载机制、Skills、子代理、快捷键与使用命令"
tags: ["AI", "AI Agent", "Pi"]
order: 7
---

## 简介

Pi（`@earendil-works/pi-coding-agent`）是一个基于大语言模型的本机命令行编码代理，核心工作方式是"单主会话 + 工具调用"。通过读文件、跑命令、改代码等工具完成任务。

- 开源主页：https://github.com/earendil-works/pi

- 运行环境：Node.js（需预先安装）
- 单主代理模型：**主代理 = 当前对话会话**，没有多主代理并存
- 资源目录：`~/.pi/agent/`（即 `C:\Users\santic\.pi\agent\`）

## 下载与安装

```bash
# 通过 npm 全局安装
npm install -g --ignore-scripts @earendil-works/pi-coding-agent

# 验证
pi --version
```

## 配置

核心配置文件为 `~/.pi/agent/settings.json`，项目级配置为 `.pi/settings.json`（覆盖全局、嵌套合并）。登录凭证存 `~/.pi/agent/auth.json`，用 `/login` 管理。

示例：

```json
{
  "defaultProvider": "deepseek",
  "defaultModel": "deepseek-v4-flash",
  "defaultThinkingLevel": "off",
  "theme": "dark",
  "skills": ["D:/projects/ai/aiteams/skills"],
  "prompts": [],
  "extensions": [],
  "packages": []
}
```

| 项 | 作用 |
|---|---|
| `defaultProvider` / `defaultModel` | 默认模型 |
| `defaultThinkingLevel` | 默认思考等级 |
| `theme` | 主题 |
| `skills` | 技能目录/文件数组（支持 glob 和排除） |
| `prompts` | 模板目录/文件数组 |
| `extensions` | 扩展文件/目录数组 |
| `packages` | npm/git 资源包 |

数组支持：`!pattern` 排除、`+path` 强制包含、`-path` 排除。

### 思考等级

- 快捷键 `Shift+Tab` 循环切换思考等级（off → minimal → low → medium → high → xhigh）
- 可在配置中按模型映射（`models.<name>.thinkingLevelMap`），`null` 表示该等级不支持、从 UI 隐藏：

```json
{
  "models": {
    "deepseek-v4-flash": {
      "thinkingLevelMap": {
        "minimal": null, "low": null, "medium": null,
        "high": "high", "xhigh": "max"
      }
    }
  }
}
```

## 资源加载机制

Pi 从约定目录加载资源，规则**逐资源不同、并不统一递归**：

| 资源 | 目录 | 发现规则 |
|---|---|---|
| Skills 技能 | `~/.pi/agent/skills/`、项目 `.pi/skills/` | **递归**（含 SKILL.md 的子目录）+ 根目录零散 .md |
| Prompts 模板 | `~/.pi/agent/prompts/`、项目 `.pi/prompts/` | **仅根目录 .md，不递归** |
| Agents 子角色 | `~/.pi/agent/agents/` | **仅根目录 .md，不递归** |
| Extensions 扩展 | `~/.pi/agent/extensions/` | `*.ts` 或 `*/index.ts` |
| 上下文 | 从 cwd 向上回溯 | 各级 AGENTS.md / CLAUDE.md |

## Skills 技能

技能是独立的"按需加载的工作包"（SKILL.md + 脚本 + 参考文档目录）。

**渐进式披露机制**：
1. 启动时 Pi 只把技能的**名称 + description** 放进系统提示词
2. 模型判断"需要时"才用 `read` 载入完整 SKILL.md 指令
3. 完整指令不常驻上下文，按需读取

因此**触发是否准确取决于 description 写得够不够具体**。缺 description 的技能不加载。触发方式：模型自行判断，或 `/skill:my-skill` 强制。

自动发现目录：`~/.pi/agent/skills/`、`~/.agents/skills/`、项目 `.pi/skills/`、`.agents/skills/`。也可通过 `settings.json` 的 `skills` 字段直接指向外部目录（推荐用于 Git 管理）——**是"Git 单一来源"的正解，不需要软链、不需要复制**。

## Prompts 提示模板

提示模板用 `/名字` 触发，注入上下文片段。文件名即命令名，如 `review.md` → `/review`，输入框敲 `/` 自动补全。

- 只扫描根目录 `.md`，子目录不递归（放子目录不会生效）
- 仅注入当前会话上下文，不另起子进程
- 支持 `$1/$2/$@` 位置参数

配置：`settings.json` 的 `prompts` 字段指向外部目录（如 `["D:/projects/ai/aiteams/prompts"]`）。

## Extensions 扩展

扩展是 TypeScript 模块，能在事件钩子上拦截/改造行为、注册自定义工具和命令。典型用途：权限门（危险命令确认）、子代理编排、自定义工具/命令/快捷键、路径保护、git 检查点、自定义压缩。

- 目录：`~/.pi/agent/extensions/*.ts`（全局）或项目 `.pi/extensions/*.ts`
- 调试：`pi -e ./path.ts`
- 重载：`/reload`（扩展放自动发现目录可热重载）
- 扩展运行在用户完整权限下，**只装可信来源**

## 子代理（Agents）

Pi 代理模型是**单主 + 扁平子进程**，不是多主并存。角色是常驻的"定义/简历"（存于 `~/.pi/agent/agents/*.md`，带 `name / description / tools / model` frontmatter），进程是每次按需新开的独立 `pi` 子进程，用完即走、无状态。

三种调用模式：
- 单任务 `{ agent, task }`：一个角色干一件事
- 并行 `{ tasks: [...] }`：多角色并发（上限 8 任务 / 4 并发）
- 链式 `{ chain: [...] }`：顺序流水线，`{previous}` 占位符传上一步输出

子代理特性：隔离上下文、一次性无状态、可观测（工具链、过程文本、用量/成本可见，内部思考草稿不可见）。

官方 subagent 扩展要求角色**预先定义**（按名字查 `agents/*.md`），找不到报错。变通：定义"通用下属角色"，把每轮定向指令通过 task 参数临时注入，效果等同"实时新建聚焦角色"。

## 权限模式与安全

Pi 没有内置的"只读/询问/完全放开"三级权限开关（官方定位："No permission popups"）。靠两套机制实现：

1. **启动参数裁剪工具（等效权限档）**：

| 想要的模式 | 参数 |
|---|---|
| 只读（无工具） | `--no-tools` / `-nt` |
| 只读 + 少量工具 | `--no-builtin-tools` / `-nbt` 或 `--tools read,ls,grep` |
| 白名单 | `--tools <列表>` |
| 完全放开 | 默认（read/write/edit/bash） |

启动后不能在窗口内动态切换，需以不同参数开新会话。

2. **扩展实现"询问"模式**：用 `tool_call` 事件拦截 + `ctx.ui.confirm` 弹窗确认危险命令（参考 `examples/extensions/permission-gate.ts`）。

## 快捷键

| 键 | 作用 |
|---|---|
| `Shift+Tab` | 思考等级循环 |
| `Ctrl+T` | 折叠/展开思考块 |
| `Ctrl+L` | 模型选择器 |
| `Ctrl+P` / `Shift+Ctrl+P` | 下一个/上一个模型 |
| `Ctrl+O` | 展开折叠的工具输出 |
| `Ctrl+V`/`Alt+V`(Win) | 粘贴图片 |

## 使用与常用命令

```bash
pi                        # 启动交互
pi -c                     # 继续最近会话
pi -r                     # 浏览历史会话
pi @file.md "prompt"      # 关联文件
pi -p "prompt"            # 非交互：处理即退出
pi -t read,ls,grep "..."  # 白名单工具
```

会话内：
- `/new` `/resume` `/tree` `/fork` `/clone` 管理会话树
- `/model` 切换模型
- `/reload` 重载资源（改 AGENTS.md / skills / 扩展后）
- `!command` 跑命令并纳入上下文；`!!command` 跑命令不带入上下文

## 与其它 Agent 框架的差异

Pi 与 autogen / crewai / metagpt 等"多 Agent 框架"不同：

- Pi 是**单主代理 + 扁平子进程**，不是"多 Agent 相互对话/自动编排的角色网络"
- 没有显式的角色继承树；"多领域团队"需用 chain/parallel 自行编排子代理
- 其他框架的专属 frontmatter 字段（`mode: primary`、`temperature`、`permission`、`runAs` 等）Pi 不解析
