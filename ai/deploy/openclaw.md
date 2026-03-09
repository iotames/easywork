## 介绍

OpenClaw是一个开源的自动化工具项目，主要用于简化重复性任务的处理流程。它通过模块化设计，支持用户根据需求灵活组合功能，常见于数据处理、文件管理或系统运维等场景。该项目由社区驱动，强调可扩展性和易用性，适合开发者和技术爱好者快速构建定制化解决方案。

- 项目主页：https://github.com/openclaw/openclaw
- 官方文档：http://docs.openclaw.ai/


## 安装

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build # 首次运行时自动安装 UI 依赖
pnpm build

# 全局安装
# 指定环境变量 export PNPM_HOME="$HOME/.local/share/pnpm"，并将其加入PATH环境变量中。
pnpm setup
source ~/.bashrc
pnpm link --global

# 如果没有全局安装成功，使用命令：pnpm openclaw onboard --install-daemon
openclaw onboard --install-daemon
```

提示：OpenClaw不推荐运行在Windows系统上，Win上可以推荐WSL2
