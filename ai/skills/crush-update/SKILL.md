---
name: crush-update
description: 更新 Crush 主程序到最新正式发布版。触发条件：用户提到更新 Crush、升级 crush 版本、下载新版本的 crush、执行 crush 自动更新等。
---

# Crush 自动更新技能

从 GitHub Releases (`https://github.com/charmbracelet/crush/releases`) 检测并下载最新 Windows 正式版，替换当前运行的 Crush 可执行文件。

## 原理

1. 运行 `crush --version` 获取当前版本
2. 通过 GitHub API 获取最新 release 的 tag 名（如 `v0.86.0`）
3. 版本相同则跳过，不同则下载对应 Windows x86_64 的 zip 包
4. 解压出 `crush.exe`，重命名为 `crush.x.x.x.exe` 保存到原目录
5. 不替换当前运行中的文件，用户可自行决定何时使用新版

## 使用方式

```powershell
# 使用代理下载（推荐，中国大陆网络环境）
python "<skill_dir>\scripts\update-crush.py" --proxy "http://127.0.0.1:7897"

# 直连下载
python "<skill_dir>\scripts\update-crush.py"
```

或在 Crush 对话中直接描述更新意图，Crush 会自动调用本脚本。

## 环境要求

- 支持平台：Windows x86_64 / arm64 / i386、macOS (Intel / Apple Silicon)、Linux (x86_64 / arm64 / armv7 / i386)
- Python 3.8+
- crush 可执行文件需在 PATH 中
- 原 crush 所在目录有写入权限
- 可选：`--proxy` 参数或 `HTTPS_PROXY` 环境变量

## 脚本说明

`scripts/update-crush.py` — Python 更新脚本：
- 自动从 GitHub API 获取最新版本号
- 与当前版本对比，无需更新时跳过
- 支持 `--proxy` 参数走代理下载
- 保留旧版本备份
- 校验 zip 包完整性
- 生成替换脚本，当前进程退出后自动完成替换

## 安全说明

- 不从非 GitHub 官方源下载
- 更新前备份当前版本
- 校验下载文件是有效的 zip 包
