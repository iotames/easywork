#!/usr/bin/env bash
# 开机耗时记录脚本（登录后异步版）
# 由 DDE 图形登录后的 autostart 触发，登录完全就绪后延迟 30 秒，
# 再读取 systemd-analyze 的系统启动日志，写入两份日志。全程后台、不阻塞开机。
#
#   ~/logs/boot-history.log   趋势数据(绘图): DATA,时间,开机编号,总耗时
#    ~/logs/boot-timeline.log 原始数据(分析): TL,时间,编号,firmware,loader,kernel,userspace,total,graph
set -uo pipefail

DIR="/home/hankin/logs"
HIST="$DIR/boot-history.log"
TL="$DIR/boot-timeline.log"
mkdir -p "$DIR"

# 登录后延迟 30 秒，等登录和系统完全稳定后再采集（异步、不阻塞）
sleep 30

NOW="$(date '+%Y-%m-%d %H:%M:%S')"
BOOTID="$(journalctl --list-boots 2>/dev/null | awk '$1==0{print $2}')"
ANALYZE="$(systemd-analyze 2>/dev/null)"

# 从 systemd-analyze 提取总耗时（登录后该数据必定已就绪）
TOTAL="$(echo "$ANALYZE" | grep 'Startup finished in' | sed -E \
  's/.*in ([0-9.]+)s \(firmware\) \+ ([0-9.]+)s \(loader\) \+ ([0-9.]+)s \(kernel\) \+ ([0-9.]+)s \(userspace\) = ([0-9.]+)s.*/\5/' )"
if [ -z "$TOTAL" ]; then
  echo "WARN $(date '+%F %T'): 无法从 systemd-analyze 提取总耗时，本次跳过" >> "$TL"
  exit 1
fi

# 分阶段
read -r FIRM LOADER KERNEL USERSPACE TOTAL <<< "$(echo "$ANALYZE" | grep 'Startup finished in' | sed -E \
  's/.*in ([0-9.]+)s \(firmware\) \+ ([0-9.]+)s \(loader\) \+ ([0-9.]+)s \(kernel\) \+ ([0-9.]+)s \(userspace\) = ([0-9.]+)s.*/\1 \2 \3 \4 \5/')"
GRAPH="$(echo "$ANALYZE" | grep -oE 'graphical.target reached after [0-9.]+s' | grep -oE '[0-9.]+s' | tr -d 's')"

# 趋势数据
echo "DATA,$NOW,$BOOTID,$TOTAL" >> "$HIST"

# 原始数据
{
  echo "==================================================="
  echo "TL,$NOW,$BOOTID,$FIRM,$LOADER,$KERNEL,$USERSPACE,$TOTAL,$GRAPH"
  echo "-- 生命周期分阶段耗时 --"
  echo "$ANALYZE" | head -2
  echo "-- 关键链路(graphical.target) --"
  systemd-analyze critical-chain graphical.target 2>/dev/null
  echo "-- Top 耗时服务 --"
  systemd-analyze blame | head -15
  echo
} >> "$TL"

exit 0
