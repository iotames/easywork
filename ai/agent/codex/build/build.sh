#!/usr/bin/env bash
# =============================================================================
# codex 一键构建脚本（Linux x86_64，Deepin 25 实测通过）
#
# 用法：
#   ./build.sh             # 默认构建 release 发布版（推荐日常使用）
#   ./build.sh debug       # 构建 debug 调试版
#
# 本脚本封装了本项目编译的全部踩坑经验（详见 CODEX_BUILD.md）：
#   1. cargo 的 git 依赖必须走全局代理（--global），否则国内直连 GitHub 卡死
#   2. 缺系统库时按提示 apt 安装 -dev 包（openssl / libcap）
#   3. v8 crate 需要 codex 官方发布的预编译资产，denoland 官方 404
#      → 用 RUSTY_V8_ARCHIVE / RUSTY_V8_SRC_BINDING_PATH 指定
#   4. v8 的下载器用 Python/curl，不读 git 配置 → 必须显式导出 HTTP(S)_PROXY
#
# 构建日志写入 /tmp/codex-build-<模式>.log，可用 tail -f 查看进度。
# =============================================================================

# 体积优化（已实测完成，见 CODEX_BUILD.md 第 14 节）：
#   strip target/release/codex 后 1.2 GB → 249 MB，达到官方发布版级别。
#   可选：若不想每次构建后手动 strip，可配置 ~/.cargo/config.toml：
#     [profile.release]
#     strip = true

set -euo pipefail

# -----------------------------------------------------------------------------
# 可配置区（按需修改）
# -----------------------------------------------------------------------------

# 本地代理端口（Clash 等）。若环境变量已设置则沿用，否则用默认值。
PROXY="${HTTP_PROXY:-http://127.0.0.1:7897}"

# v8 crate 版本，必须与 codex-rs/Cargo.lock 中 v8 版本一致。
V8_VERSION="150.4.0"

# codex 官方在 openai/codex 仓库发布自己的 rusty_v8 资产（denoland 无 sandbox 变体）。
RUSTY_V8_BASE="https://github.com/openai/codex/releases/download/rusty-v8-v${V8_VERSION}"

# 预编译库文件名（codex 开了 v8_enable_sandbox，必须用 ptrcomp_sandbox 变体）。
V8_ARCHIVE_FILE="librusty_v8_ptrcomp_sandbox_release_x86_64-unknown-linux-gnu.a.gz"

# 配套的 binding 源文件（crate 内没有，需要从 release 下载）。
V8_BINDING_FILE="src_binding_ptrcomp_sandbox_release_x86_64-unknown-linux-gnu.rs"

# binding 文件的本地存放目录（下载一次后复用）。
BINDING_DIR="${BINDING_DIR:-$HOME/.rusty_v8_assets}"

# 构建模式：debug | release
MODE="${1:-release}"

# -----------------------------------------------------------------------------
# 固定路径
# -----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CODEX_RS="${SCRIPT_DIR}/codex-rs"   # Rust 项目根（含 Cargo.toml 的目录）
LOG="/tmp/codex-build-${MODE}.log"

# -----------------------------------------------------------------------------
# 辅助函数
# -----------------------------------------------------------------------------
die() {
  echo "错误: $*" >&2
  exit 1
}

# -----------------------------------------------------------------------------
# 1. 参数与工具链自检
# -----------------------------------------------------------------------------
case "$MODE" in
  debug|release) ;;
  *) die "用法: $0 [debug|release]" ;;
esac

command -v cargo >/dev/null 2>&1 \
  || die "未找到 cargo，请先按 RUST_INSTALL.md 安装 Rust 工具链"
command -v curl >/dev/null 2>&1 \
  || die "未找到 curl，请先安装（sudo apt install -y curl）"

# -----------------------------------------------------------------------------
# 2. 系统库自检（踩坑：缺 libssl-dev / libcap-dev 时编译直接失败）
# -----------------------------------------------------------------------------
pkg-config --exists openssl \
  || die "缺 OpenSSL 开发库，请先执行: sudo apt install -y libssl-dev pkg-config"
pkg-config --exists libcap \
  || die "缺 libcap 开发库，请先执行: sudo apt install -y libcap-dev"

# -----------------------------------------------------------------------------
# 3. 准备 V8 预编译资产
#    - binding 文件：下载到本地（已存在则跳过，幂等）
#    - 库文件：通过 RUSTY_V8_ARCHIVE 交给 build.rs
#      （build.rs 会缓存到 ~/.cargo/.rusty_v8/，重复构建不重复下载；
#        也支持改成本地路径，非 http 路径会被直接复制，可实现完全离线）
# -----------------------------------------------------------------------------
mkdir -p "$BINDING_DIR"
BINDING_PATH="${BINDING_DIR}/${V8_BINDING_FILE}"

if [[ ! -f "$BINDING_PATH" ]]; then
  echo "下载 V8 binding 文件（代理 ${PROXY}）..."
  curl -x "$PROXY" -L -sS -m 120 -o "$BINDING_PATH" \
    "${RUSTY_V8_BASE}/${V8_BINDING_FILE}" \
    || die "binding 文件下载失败，请检查代理 ${PROXY} 是否可用"
fi

# -----------------------------------------------------------------------------
# 4. 导出构建环境变量
#    注意：v8 的下载器是 Python/curl，不读 git 配置，必须显式给代理。
# -----------------------------------------------------------------------------
export HTTPS_PROXY="$PROXY"
export HTTP_PROXY="$PROXY"
# 强制使用 codex 官方资产地址（不沿用外部可能残留的错误值）。
# 若想离线：可把下面改成本地路径，例如
#   RUSTY_V8_ARCHIVE="/home/hankin/librusty_v8_ptrcomp_sandbox_release_x86_64-unknown-linux-gnu.a.gz"
# build.rs 对非 http 路径会直接复制，不再下载。
export RUSTY_V8_ARCHIVE="${RUSTY_V8_BASE}/${V8_ARCHIVE_FILE}"
export RUSTY_V8_SRC_BINDING_PATH="$BINDING_PATH"

# 打印关键配置，方便确认环境变量真的生效（踩坑：变量没带上时会静默去 denoland 下 404）
echo "构建配置: MODE=${MODE}  PROXY=${PROXY}"
echo "V8 库:     ${RUSTY_V8_ARCHIVE}"
echo "V8 binding: ${RUSTY_V8_SRC_BINDING_PATH}"

# -----------------------------------------------------------------------------
# 5. 执行构建（日志落盘 + 屏幕实时显示）
#
# 说明：release 比 debug 慢是正常的——
#   1. release 用独立缓存目录 target/release/，不共享 debug 缓存，
#      首次要全量编译 1400+ crate；
#   2. release 开启优化（-O），优化编译本身耗时数倍于 debug。
#   别急着中断，日志在增长就是正常的。
# -----------------------------------------------------------------------------
echo "开始构建 ${MODE} 版，预计 10~30 分钟（日志: ${LOG}）..."
echo "另开终端执行 tail -f ${LOG} 可实时查看进度。"

cd "$CODEX_RS"
if [[ "$MODE" == "release" ]]; then
  cargo build --release 2>&1 | tee "$LOG"
else
  cargo build 2>&1 | tee "$LOG"
fi

# -----------------------------------------------------------------------------
# 6. 验证产物
# -----------------------------------------------------------------------------
BIN="${CODEX_RS}/target/${MODE}/codex"
[[ -x "$BIN" ]] || die "构建结束但未找到产物 ${BIN}，请查看日志: ${LOG}"

echo "============================================================"
echo "构建成功！"
echo "产物位置: ${BIN}"
echo "============================================================"
"$BIN" --version
