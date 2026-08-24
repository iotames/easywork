# CODEX_BUILD.md — 编译 codex（Rust 版）

本文记录从工具链就绪到编译出 codex 二进制的完整流程与踩坑经验。
工具链安装（rustup / cargo / just / rsproxy 镜像）见
[RUST_INSTALL.md](./RUST_INSTALL.md)，本文不再重复。

适用环境：Deepin 25 / x86_64。

## 快速复现（新窗口/新机器照着做）

1. 首次装工具链：按 [RUST_INSTALL.md](./RUST_INSTALL.md) 第 0~5 步完成；
2. 配置 git 全局代理：见 [RUST_INSTALL.md](./RUST_INSTALL.md) 第 8 节；
3. 一键构建（脚本自动处理 V8 资产、代理、系统库自检）：

   ```bash
   cd /persistent/home/hankin/projects/codex
   ./build.sh            # release 版（推荐）
   ./build.sh debug      # 调试版
   ```

4. 产物：`codex-rs/target/release/codex`（构建后如需瘦身：`strip` 该文件，
   1.2 GB → 249 MB）；验证：`./target/release/codex --version`。

## 构建命令速查

| 命令 | 二进制产物位置 | 说明 |
| --- | --- | --- |
| `cargo build` | `codex-rs/target/debug/codex` | 调试版，约 1.3 GB（含符号与静态 V8），编译快，适合开发 |
| `cargo build --release` | `codex-rs/target/release/codex` | 发布版，约一两百 MB，运行快，**日常使用推荐** |

> 两个命令都必须在 `codex-rs/` 目录下执行，且 release 版需要先设置
> V8 相关环境变量（见第 11 节），否则会撞上 404 坑。推荐直接用
> 仓库根目录的 `build.sh`（见附录 C）。

## 1. 前置条件

按 [RUST_INSTALL.md](./RUST_INSTALL.md) 第 0~5 步完成后，确认：

```bash
rustc --version
cargo --version
just --version
```

预期各输出一行版本号（本文记录时：rustc/cargo 1.98.0、just 1.58.0）。

## 2. 项目结构：为什么进 codex-rs 目录

- codex 的 GitHub 仓库是 monorepo，根目录混放多种语言，**没有 `Cargo.toml`，
  不是 Rust 项目根**；
- Rust 代码集中在 `codex-rs/` 子目录，那里才有 `Cargo.toml`；
- 通用规则：任何 Rust 项目，含 `Cargo.toml` 的目录就是项目根，
  `cargo build` 必须在该目录（或其子目录）下执行；
- 产物永远是 `target/debug/<二进制名>`，二进制名由 `Cargo.toml` 决定
  （codex 的二进制名就是 `codex`）。

## 3. 网络问题：git 依赖加速（关键经验）

### 现象

`cargo build` 卡死在：

```
Updating git repository `https://github.com/openai-oss-forks/xxx`
```

### 原因

- rsproxy 镜像**只覆盖 crates.io** 的依赖；
- codex 有部分依赖是 **git 依赖**（直接从 GitHub clone），
  如 `tungstenite-rs`、`crossterm` 的 fork；
- 国内直连 GitHub：HTTPS 匿名下载限速 + 连接不稳定，经常卡死。

### 方案 A（推荐）：HTTPS + 本地代理

配置 git 走本地代理（写入全局 `~/.gitconfig`，任何仓库的 git 拉取都生效）：

```bash
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

前提：`~/.cargo/config.toml` 里已有
`[net] git-fetch-with-cli = true`（rust 安装指南第 4 步已配置），
确保 cargo 拉 git 依赖时调用系统 git、从而读到代理配置。

> **重点提醒：配置必须带 `--global`（写入 `~/.gitconfig`）。**
> cargo 拉取 git 依赖时是在 `~/.cargo/git/` 下运行 git，
> **读不到任何项目仓库的本地配置**（如 `codex/.git/config`）。
> 踩坑记录：曾漏掉 `--global`，代理和 `insteadOf` 只写进了 codex
> 仓库本级，cargo 完全没吃到，结果是 https 直连 GitHub 被限速到
> ~26 KiB/s、Clash 无日志。验证时也建议先 `cd /tmp` 再跑
> `git ls-remote`，排除项目级配置干扰，并看 Clash 是否有
> `github.com` 443 日志。

验证代理 + 确认 Clash 有日志：

```bash
git ls-remote https://github.com/openai-oss-forks/crossterm HEAD
```

- 预期耗时：5~15 秒
- 预期输出：一行 commit hash + `HEAD`
- 同时看 Clash 日志：应出现 `github.com` 的 443 流量记录
  （有日志 = 走了代理；没日志 = 没走）

### 方案 B（不推荐，踩坑记录）：SSH 别名 + insteadOf

曾尝试用 SSH 别名加速：

```bash
git config --global url."github:".insteadOf "https://github.com/"
```

结果：`git ls-remote` 秒回（连接通了），但真正 clone 时只有
**26~36 KiB/s**，因为 SSH 直连 22 端口**不走 HTTP 代理**，
Clash 完全看不到日志。国内直连 GitHub SSH 的裸速度就是这个水平，
对首次全量下载不可用。若要恢复 https 直连，删除该重写：

```bash
git config --global --unset-all url."github:".insteadOf
```

> 注意：自己的 codex 仓库 origin 若用的是 `github:openai/codex`
> 这种仓库级 SSH 配置，不受全局 insteadOf 影响，无需处理。

### 如何判断下载是否走了代理

1. **看 Clash 日志**：HTTPS 走代理时必然出现 `github.com` 443 记录；
   SSH 直连不会出现（22 端口不走 HTTP 代理）；
2. **看连接**：`ss -tnp | grep 7897` 有连接 = 在走代理。

### 无效做法（别浪费时间）

手动下载 git 依赖的源码文件夹塞进 cargo 目录，**不会生效**：
cargo 的 git 依赖缓存在 `~/.cargo/git/db/`，是 git 裸仓库格式，
不是普通源码目录，cargo 仍会强制 fetch 并校验。

## 4. 编译

> 注意：无论 debug 还是 release，**都必须先设置第 11 节的 V8 环境变量**
> （否则 v8 crate 会去 denoland 下不存在的文件而失败）。下面命令为
> 完整可复制版，等价于 `./build.sh debug`。

```bash
cd /persistent/home/hankin/projects/codex/codex-rs
export HTTPS_PROXY=http://127.0.0.1:7897
export HTTP_PROXY=http://127.0.0.1:7897
export RUSTY_V8_ARCHIVE="https://github.com/openai/codex/releases/download/rusty-v8-v150.4.0/librusty_v8_ptrcomp_sandbox_release_x86_64-unknown-linux-gnu.a.gz"
export RUSTY_V8_SRC_BINDING_PATH="/tmp/rusty_v8_binding/src_binding_ptrcomp_sandbox_release_x86_64-unknown-linux-gnu.rs"
cargo build
```

- 预期耗时：10~40 分钟（首次全量下载 + 编译；之后增量几秒到几分钟）
- 预期输出：下载阶段 → 大量 `Compiling xxx v1.x.x` → 最后
  `Finished 'dev' profile [unoptimized + debuginfo] target(s) in XXm XXs`
- 产物：`codex-rs/target/debug/codex`
- 备注：项目自带 `rust-toolchain.toml` 锁定 1.95.0，`cargo build` 时
  rustup 会自动下载切换该版本，属正常现象，不用管

## 5. 中断后的恢复

编译被 Ctrl+C 中断后，cargo 的 git 缓存可能残留半成品，导致重跑时
再次卡在同一个仓库或报锁错误。处理（纯下载缓存，删了会自动重建）：

```bash
rm -rf ~/.cargo/git/db ~/.cargo/git/checkouts
cd /persistent/home/hankin/projects/codex/codex-rs
cargo build
```

## 6. 验证产物

```bash
./target/debug/codex --version
```

预期输出：`codex 0.x.x` 之类的一行版本号。能输出版本号即编译成功。

## 7. 常见报错：缺少系统库

现象：编译报 `Could not find openssl via pkg-config` 或
`The system library 'openssl' required by crate 'openssl-sys' was not found`。

原因：部分 Rust crate 需要系统级 C 库的开发文件（头文件 + `*.pc`），
apt 里对应的是 `-dev` 包，光有运行库不够。

解决（Debian / Deepin / Ubuntu 系）：

```bash
sudo apt update
sudo apt install -y libssl-dev pkg-config
```

- 预期耗时：几十秒到几分钟（apt 国内源）
- 装完直接重跑 `cargo build`，**不需要清缓存**

后续若再报 `Could not find xxx via pkg-config`，同理装对应的 `xxx-dev`
包，把报错发出来确认包名即可。本项目实际踩过的：`libssl-dev`（openssl）、
`libcap-dev`（codex-bwrap 的 bubblewrap 沙箱）。

## 8. 发布版（最终使用建议）

**必须先设置 V8 环境变量再跑**：直接裸跑 `cargo build --release` 会撞
404 坑（v8 的下载器读不到这些变量，会去 denoland 下不存在的文件）。
推荐直接用仓库根目录的 `build.sh`：

```bash
cd /persistent/home/hankin/projects/codex
./build.sh
```

手动方式（与脚本等价）：

```bash
cd /persistent/home/hankin/projects/codex/codex-rs
export HTTPS_PROXY=http://127.0.0.1:7897
export HTTP_PROXY=http://127.0.0.1:7897
export RUSTY_V8_ARCHIVE="https://github.com/openai/codex/releases/download/rusty-v8-v150.4.0/librusty_v8_ptrcomp_sandbox_release_x86_64-unknown-linux-gnu.a.gz"
export RUSTY_V8_SRC_BINDING_PATH="/tmp/rusty_v8_binding/src_binding_ptrcomp_sandbox_release_x86_64-unknown-linux-gnu.rs"
cargo build --release
```

- 预期耗时：10~30 分钟（全量优化编译）。**比 debug 慢是正常的**，两个原因：
  1. release 使用独立缓存目录（`target/release/`），不共享 debug 缓存，
     1400+ crate 全部从零编译；
  2. release 开启优化（`-O`），优化编译本身耗时就是 debug 的数倍。
  对比：debug 版之前已编译过的话，第二次 debug 构建只需几秒~1 分钟，
  容易误以为 release 卡住，其实它是在全量优化编译。
- 产物：`target/release/codex`，体积更小、运行更快
- 该文件是自包含二进制，可复制到任意目录直接运行

> 注意：`export` 只对当前终端有效，重开终端后必须重新设置，
> 或直接跑 `build.sh`（脚本会自动设置）。

## 9. 常用 just 命令（开发流程）

```bash
just --list   # 列出所有可用命令
just fmt      # 格式化代码（cargo fmt）
just fix      # Clippy 检查并修复
just test     # 跑测试
```

## 10. 当前状态

- [x] 工具链：rustc/cargo 1.98.0、just 1.58.0
- [x] crates.io 国内镜像（rsproxy）
- [x] git 依赖走全局代理（HTTPS + 127.0.0.1:7897），Clash 可见
- [x] debug 版编译完成，`target/debug/codex` 可运行
- [x] release 版编译完成（22 分 25 秒），`target/release/codex` 可运行
- [x] `./target/release/codex --version` 输出 `codex-cli 0.0.0`
- [x] `strip` 瘦身完成：1.2 GB → 249 MB
- [ ] Docker 容器化增量编译（规划中，见附录 D）

## 11. V8 预编译资产 404 的坑（必读）

现象：`cargo build` 到 `v8 v150.4.0` 时下载
`https://github.com/denoland/rusty_v8/releases/download/v150.4.0/
librusty_v8_ptrcomp_sandbox_release_x86_64-unknown-linux-gnu.a.gz`
返回 **HTTP 404**。

原因：

- codex 在 `code-mode-runtime/Cargo.toml` 里给 v8 开了
  `v8_enable_sandbox` feature，需要 `ptrcomp_sandbox` 变体；
- denoland 官方 release **只发布了普通 `release` 变体**，
  `ptrcomp` 和 `ptrcomp_sandbox` 都没有（实测 404）；
- codex 官方自己构建并发布了带 sandbox 的 rusty_v8 资产，
  在 `openai/codex` 仓库的 `rusty-v8-v<版本>` release 下。

解决（照抄 workflow `.github/workflows/rusty-v8-release.yml` 的做法）：

```bash
export HTTPS_PROXY=http://127.0.0.1:7897
export HTTP_PROXY=http://127.0.0.1:7897
export RUSTY_V8_ARCHIVE="https://github.com/openai/codex/releases/download/rusty-v8-v150.4.0/librusty_v8_ptrcomp_sandbox_release_x86_64-unknown-linux-gnu.a.gz"
export RUSTY_V8_SRC_BINDING_PATH="/tmp/rusty_v8_binding/src_binding_ptrcomp_sandbox_release_x86_64-unknown-linux-gnu.rs"
```

其中 binding 文件需先下载：

```bash
mkdir -p /tmp/rusty_v8_binding
curl -x http://127.0.0.1:7897 -L -sS -o /tmp/rusty_v8_binding/src_binding_ptrcomp_sandbox_release_x86_64-unknown-linux-gnu.rs \
  https://github.com/openai/codex/releases/download/rusty-v8-v150.4.0/src_binding_ptrcomp_sandbox_release_x86_64-unknown-linux-gnu.rs
```

要点：v8 的下载器用 Python/curl，**不读 git 配置**，所以必须显式传
`HTTPS_PROXY`/`HTTP_PROXY`；`RUSTY_V8_ARCHIVE` 给库文件、
`RUSTY_V8_SRC_BINDING_PATH` 给 binding 文件，两者缺一不可。

## 12. 编译日志落盘（可选）

长命令输出可重定向到日志文件，自己随时查看：

```bash
cd /persistent/home/hankin/projects/codex/codex-rs
cargo build > /tmp/codex-build.log 2>&1
```

跑完 `tail -n 40 /tmp/codex-build.log` 看结尾。

## 13. 产物说明（debug 与 release 均已完成）

六个二进制（相互独立，各自静态链接依赖）：

| 二进制 | release | debug | 用途 |
| --- | --- | --- | --- |
| `codex` | 1.2 GB | 1.3 GB | 主入口（命令行/TUI，含 V8） |
| `codex-tui` | 1.1 GB | 1.2 GB | 终端界面层 |
| `codex-app-server` | 964 MB | 1022 MB | 后台应用服务 |
| `codex-exec` | 918 MB | 1009 MB | 执行服务器（沙箱） |
| `codex-mcp-server` | 674 MB | 867 MB | MCP 服务器 |
| `logs_client` | 159 MB | 637 MB | 日志客户端 |

> 体积说明：Rust release 默认**保留符号表且不开 LTO**，所以 release 并不比
> debug 小多少（logs_client 除外）。`codex` 经 `strip` 后实测 1.2 GB → 249 MB，
> 达到官方发布版（247 MB）级别。

验证：`./target/release/codex --version` 输出 `codex-cli 0.0.0`。

启动时若提示 `could not create PATH aliases: Read-only file system`：
是只读系统（Deepin）无法写 PATH 符号链接，不影响程序使用。

## 14. 二进制瘦身（已完成）

`strip target/release/codex` 实测：**1.2 GB → 249 MB**（秒级完成），
`--version` 验证正常，达到官方发布版级别，**日常使用无需再做任何优化**。

可选（一般不需要）：

- 若不想每次构建后手动 strip，可在 `~/.cargo/config.toml` 配置
  `[profile.release] strip = true`；
- LTO 重建需 30~60 分钟且收益甚微（strip 后已接近官方体积），不建议。

## 15. 为什么 codex 这么大：V8 引擎

**作用**：codex 的 code-mode 功能需要一个 JS/TS 运行时，在隔离的 V8
沙箱里执行模型生成的代码（项目对应 `code-mode-runtime`、`v8-poc` crate，
构建时开启 `v8_enable_sandbox`）。

**体积关系（实测）**：

| 对象 | 大小 | 说明 |
| --- | --- | --- |
| `librusty_v8.a`（静态库） | 149 MB | 链接进 codex 前的完整库 |
| `codex`（strip 后） | 249 MB | 含 V8 |
| 非 V8 部分 | ~100 MB | codex 自身 + 其它依赖 |
| `logs_client`（无 V8） | 159 MB | 对照 |

**结论**：V8 约占 codex 体积的六成（149/249，此为上限——链接器会丢弃
未引用的目标文件，实际嵌入略少），是体积绝对大头。

**影响**：

- 官方发布版 247 MB 也瘦不下来，根因就是 V8 被静态链接；
- `strip` 只能去掉符号表，去不掉 V8 的代码段；
- debug 版 1.3 GB 更大，因为 V8 与 codex 都带调试符号；
- 想再压缩，方向在 V8 构建选项（裁剪 feature）或上游调整，本地空间有限。

## 附录 A：踩坑速查表

| 现象 | 原因 | 解决 |
| --- | --- | --- |
| `cargo search` 报 replaced source 错误 | cargo 已知限制，搜索不走替换源 | 忽略，不影响编译 |
| `Updating git repository https://github.com/...` 卡死 | git 依赖直连 GitHub，国内不通 | git 配置必须 `--global` 代理：`git config --global http.proxy http://127.0.0.1:7897` |
| 代理/`insteadOf` 配了却不生效 | 只写进了项目本地 `.git/config`，cargo 在 `~/.cargo/git/` 下跑 git 读不到 | 全部用 `--global`；验证时 `cd /tmp` 再测 |
| SSH `insteadOf` 秒连但下载 26 KiB/s | SSH 直连不走 HTTP 代理，国内裸速度 | 放弃 SSH 方案，用 HTTPS + 全局代理 |
| `Could not find openssl via pkg-config` | 缺 OpenSSL 开发库 | `sudo apt install -y libssl-dev pkg-config` |
| `The system library 'libcap' ... not found` | 缺 libcap 开发库（bubblewrap 沙箱） | `sudo apt install -y libcap-dev` |
| v8 下载 `librusty_v8_ptrcomp_sandbox...` 404 | denoland 官方没发布 sandbox 变体 | 用 codex 官方资产 + `RUSTY_V8_ARCHIVE`/`RUSTY_V8_SRC_BINDING_PATH`（见第 11 节） |
| v8 缺 `src_binding_ptrcomp_sandbox...rs` | binding 文件不在 crate 内 | 下载 codex release 里的 binding，用 `RUSTY_V8_SRC_BINDING_PATH` 指定 |
| 启动提示 `Read-only file system` | Deepin 只读系统无法写 PATH 软链 | 忽略，不影响使用 |

## 附录 B：依赖本地化（类似 go mod vendor）

Rust 对应 `go mod vendor` 的命令是 **`cargo vendor`**，把 crates.io 的
依赖全部下载到项目内目录（默认 `vendor/`），之后可离线构建。

```bash
cd /persistent/home/hankin/projects/codex/codex-rs
cargo vendor vendor/
```

按提示把生成的配置合并进 `codex-rs/.cargo/config.toml`：

```toml
[source.crates-io]
replace-with = "vendored-sources"

[source.vendored-sources]
directory = "vendor"
```

之后构建可加 `--offline`：

```bash
cargo build --release --offline
```

局限（务必知道）：

- `cargo vendor` 只覆盖 **crates.io 的 registry 依赖**；
- **git 依赖无法 vendor**（codex 有 `tungstenite-rs`、`crossterm` 等
  GitHub fork），离线时仍需这些 git 依赖已在本地缓存
  （`~/.cargo/git/`），否则要联网；
- V8 预编译库不在 vendor 范围：可先下载 `.a.gz` 到本地，
  用 `RUSTY_V8_ARCHIVE=/本地路径/xxx.a.gz` 指定
  （build.rs 支持非 http 路径直接复制），即可完全离线。

## 附录 C：build.sh 一键构建

仓库根目录的 `build.sh` 封装了全部踩坑经验：

```bash
cd /persistent/home/hankin/projects/codex
./build.sh            # 默认 release 版
./build.sh debug      # 调试版
```

脚本会自动：自检工具链与系统库、下载 V8 binding 文件、设置 V8 与代理
环境变量、构建并把日志写入 `/tmp/codex-build-<模式>.log`。详见脚本内注释。

## 附录 D：Docker 容器化增量编译（规划）

目标：上游 `git pull` 新代码后，用本地依赖 + 容器快速增量编译。

核心思路——三层依赖缓存：

1. crates.io 依赖 → `cargo vendor`（附录 B），可打进镜像或挂载；
   仅当上游更新了 crates.io 依赖版本时才需要刷新；
2. git 依赖（tungstenite/crossterm 等 fork）→ **无法 vendor**，
   预置或挂载 `~/.cargo/git` 缓存；commit 不变时离线命中，
   上游改了 commit 才需要联网拉一次；
3. V8 预编译资产 → 下载 `.a.gz` + binding 存本地，
   `RUSTY_V8_ARCHIVE` 指向本地文件（build.rs 对非 http 路径直接复制），
   完全离线。

增量编译的关键：**持久化 `target/` 目录**（cargo 增量编译完全依赖它），
且容器内路径要固定（fingerprint 含路径，路径变了会全量重编）。

推荐运行形态：

```bash
docker run --rm \
  -v /persistent/home/hankin/projects/codex:/workspace \
  -v /persistent/home/hankin/projects/codex/codex-rs/target:/workspace/codex-rs/target \
  -v "$HOME/.cargo":/root/.cargo \
  --user "$(id -u):$(id -g)" \
  codex-builder ./build.sh
```

注意事项：

- 以宿主同 UID 运行，避免 target 文件属主混乱；
- 上游更新依赖：crates.io 版本变 → 刷新 vendor；git 依赖 commit 变 →
  需一次联网（代理）；
- V8 版本变 → 更新 build.sh 的 `V8_VERSION`；
- 工具链版本由 `rust-toolchain.toml` 锁定，镜像预装对应版本避免下载；
- target 体积很大（数十 GB），确认磁盘空间。

待办：

- [ ] 本机跑通 `cargo vendor` + `--offline` 构建
- [ ] 编写 `Dockerfile`（工具链 + 系统库 + vendor/V8 资产预置）
- [ ] 编写 `docker-build.sh`（自动挂载 target/vendor/cargo 缓存、代理、同 UID）
- [ ] 模拟上游更新验证增量编译
