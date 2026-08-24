# Rust 工具链安装指南（国内镜像版）

适用环境：Deepin 25（x86_64），Linux 系通用。全程不需要 sudo，工具链装在 `$HOME`。

## 0. 确认平台

```bash
uname -m
cat /etc/os-release
```

- 预期耗时：1 秒
- 预期输出：`x86_64`（或 `aarch64`）；系统信息如 `PRETTY_NAME="Deepin 25"`

## 1. 安装 Rust 工具链（rustup，rsproxy 国内源）

```bash
export RUSTUP_DIST_SERVER=https://rsproxy.cn
export RUSTUP_UPDATE_ROOT=https://rsproxy.cn/rustup
curl --proto '=https' --tlsv1.2 -sSf https://rsproxy.cn/rustup-init.sh | sh -s -- -y
```

- 预期耗时：1~3 分钟（主要是下载，走国内源，不需要代理）
- 预期输出：一串 `info: downloading ...` 进度，最后一行 `Rust is installed now. Great!`
- 产物位置：工具链 `~/.rustup`，cargo 可执行文件 `~/.cargo/bin`

## 2. 把国内源写入 shell 配置（可选但推荐）

重开终端后环境变量会丢，写入 `~/.bashrc` 一劳永逸（重复执行不会写两遍）：

```bash
grep -q 'rsproxy.cn' ~/.bashrc || cat >> ~/.bashrc <<'EOF'
export RUSTUP_DIST_SERVER=https://rsproxy.cn
export RUSTUP_UPDATE_ROOT=https://rsproxy.cn/rustup
EOF
```

- 预期耗时：10 秒
- 预期输出：无

## 3. 让 cargo 生效并验证

```bash
. "$HOME/.cargo/env"
rustc --version
cargo --version
```

- 预期耗时：5 秒
- 预期输出：
  - `rustc 1.98.0 (88d9e12ae 2026-08-18)`
  - `cargo 1.98.0 (797e8a9bc 2026-08-05)`

## 4. cargo 依赖走国内镜像

```bash
mkdir -p ~/.cargo
cat > ~/.cargo/config.toml <<'EOF'
[source.crates-io]
replace-with = 'rsproxy-sparse'

[source.rsproxy-sparse]
registry = "sparse+https://rsproxy.cn/index/"

[net]
git-fetch-with-cli = true
EOF
```

- 预期耗时：30 秒
- 预期输出：无

> 注意：配置后 `cargo search` 会报错
> `crates-io is replaced with non-remote-registry source registry 'rsproxy-sparse'`。
> 这是 cargo 的已知限制（搜索不支持走替换源），**不影响任何编译工作**，忽略即可。

## 5. just 是什么 + 安装

### just 是什么

`just` 是一个命令行任务运行器（task runner）：项目里放一个 `justfile`，
把常用长命令压缩成短命令。类似 Makefile，但更简单直接。

codex 的 Rust 代码（`codex-rs/`）就以 `just` 为命令入口，例如：

- `just fmt`：格式化代码（内部是 `cargo fmt`）
- `just test`：跑测试
- `just fix`：跑 Clippy 并修复
- `just --list`：列出项目里所有可用命令

编译二进制本身用 `cargo` 就够了，但后续开发流程（格式化、测试、检查）都走 `just`。

### 安装

```bash
cargo install just --locked
```

- 预期耗时：1~5 分钟（下载 1 个 crate，编译约 1 分钟）
- 预期输出：`Updating 'rsproxy-sparse' index` → 大量 `Compiling xxx` →
  `Installed package 'just v1.58.0' (executable 'just')`
- 产物位置：`~/.cargo/bin/just`

验证：

```bash
just --version
```

- 预期输出：`just 1.58.0`

## 6. 网络故障备选

rsproxy 是国内源，正常情况下无需代理。若遇到下载卡住或超时，
可用本地代理 `127.0.0.1:7897` 兜底，例如：

```bash
curl -x http://127.0.0.1:7897 -sS -m 10 -o /dev/null -w 'HTTP %{http_code}\n' https://www.google.com/generate_204
```

返回 `HTTP 204` 表示代理可用。

## 7. 当前进度

- [x] 平台确认：Deepin 25 / x86_64
- [x] rustup + Rust 1.98.0
- [x] 国内镜像（rsproxy）
- [x] just 1.58.0
- [ ] 编译 codex（下一步：`cd codex-rs && cargo build`，产物 `target/debug/codex`）

## 8. git 依赖的国内网络问题（代理兜底）

现象：`cargo build` 卡在 `Updating git repository https://github.com/...`。

原因：rsproxy 镜像只覆盖 crates.io 的依赖；部分依赖直接从 GitHub clone
（git 依赖），国内直连 GitHub 会卡死。

解决：给 git 配本地代理（写入 `~/.gitconfig`，永久生效）：

```bash
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

验证代理对 GitHub 是否通：

```bash
git ls-remote https://github.com/openai-oss-forks/tungstenite-rs HEAD
```

- 预期耗时：5~10 秒
- 预期输出：一行 commit hash（如 `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx	HEAD`）

之后重跑 `cargo build` 即可。取消代理：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 9. 通用 Rust 项目的编译流程（原理版）

任何 Rust 项目，结构都一样：

- 项目根 = 含 `Cargo.toml` 的目录。`Cargo.toml` 声明包名（`[package] name`）
  和依赖列表；`src/main.rs` 是程序入口；`Cargo.lock` 锁定所有依赖的精确版本；
  `target/` 是编译产物目录。
- 依赖有三个来源：crates.io（registry，用 rsproxy 镜像覆盖）、
  GitHub 等 git 仓库（走 git，国内需代理）、本地路径。

通用编译步骤：

1. 装工具链：`rustup`（见本文第 1~3 步）；
2. 配置源：crates.io 走 rsproxy、git 走代理（见第 4、8 步）；
3. 进入项目根：`cd <含 Cargo.toml 的目录>`；
4. 编译：`cargo build`；
5. 产物：`target/debug/<二进制名>`。二进制名由 `Cargo.toml` 里
   `[package] name`（单入口）或 `[[bin]] name`（多入口）决定。

Codex 的情况：GitHub 仓库根目录不是 Rust 项目根——整个仓库是 monorepo
（多语言混放），Rust 代码集中在 `codex-rs/` 子目录，那里才有 `Cargo.toml`，
所以编译前先 `cd codex-rs`。判断方法：看目录下有没有 `Cargo.toml`，
有就是项目根。

## 10. 当前进度（更新）

- [x] 工具链：rustc/cargo 1.98.0、just 1.58.0
- [x] crates.io 国内镜像（rsproxy）
- [x] git 依赖走本地代理（127.0.0.1:7897）
- [x] 项目锁定工具链 1.95.0（rustup 自动下载，属正常）
- [ ] 编译 codex（`cd codex-rs && cargo build`）
