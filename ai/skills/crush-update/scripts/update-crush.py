#!/usr/bin/env python3
"""
Crush 自动更新脚本
从 GitHub Releases 下载最新 Windows x86_64 版，重命名后保存到原目录。
"""

import argparse
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.request
import zipfile

API_URL = "https://api.github.com/repos/charmbracelet/crush/releases/latest"


def run(args):
    """运行命令并返回 (stdout, stderr, code)"""
    try:
        r = subprocess.run(args, capture_output=True, text=True, timeout=30)
        return r.stdout.strip(), r.stderr.strip(), r.returncode
    except FileNotFoundError:
        return "", f"未找到: {args[0]}", -1
    except subprocess.TimeoutExpired:
        return "", "命令超时", -1


PLATFORM_MAP = {
    ("win32", "AMD64"):     ("Windows_x86_64", ".zip"),
    ("win32", "ARM64"):    ("Windows_arm64", ".zip"),
    ("win32", "x86"):      ("Windows_i386", ".zip"),
    ("darwin", "arm64"):   ("Darwin_arm64", ".tar.gz"),
    ("darwin", "x86_64"): ("Darwin_x86_64", ".tar.gz"),
    ("linux", "x86_64"):  ("Linux_x86_64", ".tar.gz"),
    ("linux", "aarch64"): ("Linux_arm64", ".tar.gz"),
    ("linux", "armv7l"):  ("Linux_armv7", ".tar.gz"),
    ("linux", "i686"):    ("Linux_i386", ".tar.gz"),
}


OS_MAP = {"win32": "exe", "darwin": None, "linux": None}


def get_platform_suffix():
    """根据当前机器确定下载文件名后缀和扩展名"""
    sys_name = sys.platform
    arch = platform.machine()
    key = (sys_name, arch)
    if key in PLATFORM_MAP:
        return PLATFORM_MAP[key]
    # 尝试模糊匹配
    for (os_name, os_arch), val in PLATFORM_MAP.items():
        if os_name == sys_name and arch.startswith(os_arch.rstrip("64").rstrip("86")):
            return val
    raise RuntimeError(f"不支持的平台: {sys_name}/{arch}")


def find_crush():
    """通过 PATH 定位 crush 可执行文件的完整路径"""
    crush_name = "crush.exe" if sys.platform == "win32" else "crush"
    if sys.platform == "win32":
        out, _, code = run(["where", crush_name])
        if code == 0 and out:
            path = out.splitlines()[0].strip()
            if os.path.isfile(path):
                return path
    else:
        out, _, code = run(["which", "crush"])
        if code == 0 and out:
            path = out.strip()
            if os.path.isfile(path):
                return path
    return None


def get_current_version(crush_path):
    """获取当前 crush 版本号"""
    out, _, code = run([crush_path, "--version"])
    if code != 0:
        return None
    m = re.search(r"v(\d+\.\d+\.\d+)", out)
    return m.group(1) if m else None


def get_latest_version(proxy=None):
    """从 GitHub API 获取最新版本号"""
    req = urllib.request.Request(API_URL, headers={"Accept": "application/json"})
    handler = urllib.request.ProxyHandler({"http": proxy, "https": proxy}) if proxy else None
    opener = urllib.request.build_opener(handler) if handler else urllib.request.build_opener()
    with opener.open(req, timeout=30) as resp:
        data = json.loads(resp.read().decode())
    tag = data["tag_name"]
    return tag.lstrip("v"), tag


def download_file(url, dest, proxy=None):
    """下载文件到指定路径"""
    req = urllib.request.Request(url)
    handler = urllib.request.ProxyHandler({"http": proxy, "https": proxy}) if proxy else None
    opener = urllib.request.build_opener(handler) if handler else urllib.request.build_opener()
    with opener.open(req, timeout=300) as resp:
        with open(dest, "wb") as f:
            shutil.copyfileobj(resp, f)


def main():
    parser = argparse.ArgumentParser(description="下载最新版 Crush")
    parser.add_argument("--proxy", help="HTTP/HTTPS 代理地址，如 http://127.0.0.1:7897")
    args = parser.parse_args()

    proxy = args.proxy or os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY")

    # 0. 定位 crush.exe 路径
    crush_path = find_crush()
    if not crush_path:
        print("错误: 未找到 crush.exe，请确保它在 PATH 中")
        sys.exit(1)

    crush_dir = os.path.dirname(crush_path)
    print(f"Crush 路径: {crush_path}")

    # 1. 获取当前版本
    current = get_current_version(crush_path)
    if current:
        print(f"当前版本: v{current}")

    # 2. 获取最新版本
    print("正在检查 GitHub 最新版本...")
    try:
        version, tag = get_latest_version(proxy)
    except Exception as e:
        print(f"获取发布信息失败: {e}")
        sys.exit(1)
    print(f"最新版本: v{version}")

    # 3. 版本对比，相同则跳过
    if current and current == version:
        print("已是最新版本，无需下载")
        return

    # 4. 确定平台后缀
    try:
        plat_suffix, ext = get_platform_suffix()
    except RuntimeError as e:
        print(f"错误: {e}")
        sys.exit(1)

    crush_name = f"crush_{version}_{plat_suffix}{ext}"
    download_url = f"https://github.com/charmbracelet/crush/releases/download/{tag}/{crush_name}"
    print(f"平台: {sys.platform}/{platform.machine()} -> {plat_suffix}")

    # 5. 检查本地是否已存在此版本文件
    local_suffix = OS_MAP.get(sys.platform, "")
    if local_suffix:
        dest_name = f"crush.{version}.{local_suffix}"
    else:
        dest_name = f"crush.{version}"
    dest_path = os.path.join(crush_dir, dest_name)
    if os.path.exists(dest_path):
        print(f"已存在: {dest_path}")
        return

    # 6. 下载
    print(f"正在下载: {crush_name}")

    tmp_dir = tempfile.mkdtemp(prefix="crush-update-")
    arc_path = os.path.join(tmp_dir, crush_name)
    try:
        download_file(download_url, arc_path, proxy)
    except Exception as e:
        print(f"下载失败: {e}")
        shutil.rmtree(tmp_dir)
        sys.exit(1)
    print("下载完成")

    # 7. 解压 / 提取 binary
    if ext == ".zip":
        if not zipfile.is_zipfile(arc_path):
            print("ZIP 包损坏")
            shutil.rmtree(tmp_dir)
            sys.exit(1)
        print("ZIP 包校验通过")
        with zipfile.ZipFile(arc_path, "r") as zf:
            zf.extractall(tmp_dir)
    else:
        # tar.gz
        import tarfile
        with tarfile.open(arc_path, "r:gz") as tf:
            tf.extractall(tmp_dir)

    # 查找 binary
    binary_name = "crush.exe" if sys.platform == "win32" else "crush"
    extracted = None
    for root, _, files in os.walk(tmp_dir):
        for f in files:
            if f == binary_name:
                extracted = os.path.join(root, f)
                break
        if extracted:
            break

    if not extracted:
        print(f"解压后未找到 {binary_name}")
        shutil.rmtree(tmp_dir)
        sys.exit(1)

    # 非 Windows 下加执行权限
    if sys.platform != "win32":
        os.chmod(extracted, 0o755)

    # 8. 复制到目标位置
    os.makedirs(crush_dir, exist_ok=True)
    shutil.copy2(extracted, dest_path)

    # 9. 清理
    shutil.rmtree(tmp_dir)

    print(f"下载完成: {dest_path}")


if __name__ == "__main__":
    main()
