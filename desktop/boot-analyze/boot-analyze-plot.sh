#!/usr/bin/env bash
# 开机"总耗时"历史曲线图绘制脚本
# 读取 ~/logs/boot-history.log 的 DATA 行(趋势数据)，只画总耗时一条曲线，
# 直观对比历次开机速度变化。
# 完整生命周期/分阶段明细请用分析脚本或查看 ~/logs/boot-timeline.log
# 用法:
#   boot-analyze-plot                # 默认最近 10 次
#   boot-analyze-plot -n 16          # 最近 16 次
#   boot-analyze-plot -n 7 -o out   # 指定输出文件
set -uo pipefail

LOG="$HOME/logs/boot-history.log"
N=10
OUT=""
BROWSER="${BROWSER:-}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -n|--count) N="$2"; shift 2 ;;
    -o|--output) OUT="$2"; shift 2 ;;
    -h|--help)
      echo "用法: $0 [-n 次数] [-o 输出HTML文件]"
      echo "  默认绘制最近 10 次开机总耗时曲线；-n 可调次数"
      echo "  数据源: ~/logs/boot-history.log (趋势)"
      exit 0 ;;
    *) echo "未知参数: $1"; exit 1 ;;
  esac
done

if ! [[ "$N" =~ ^[0-9]+$ ]] || [[ "$N" -lt 1 ]]; then
  echo "错误: 次数必须为正整数"; exit 1
fi

mapfile -t rows < <(grep '^DATA,' "$LOG" 2>/dev/null)
count=${#rows[@]}
if [[ "$count" -eq 0 ]]; then
  echo "日志中暂无 DATA 记录：$LOG"; exit 1
fi

take=$(( count < N ? count : N ))
start=$(( count - take ))

labels=""
total=""
for i in $(seq $start $((count-1))); do
  IFS=',' read -r _ dt _ totalv <<< "${rows[$i]}"
  [[ -z "$dt" || -z "$totalv" ]] && continue
  labels="${labels}\"${dt}\","
  total="${total}\"${totalv}\","
done
labels="${labels%,}"
total="${total%,}"

[[ -z "$OUT" ]] && OUT="$HOME/logs/boot-history-plot.html"

cat > "$OUT" <<HTMLEOF
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>开机总耗时历史曲线（最近 $take 次）</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  body{font-family:"Microsoft YaHei",sans-serif;margin:30px;background:#1e1e2e;color:#eee}
  .wrap{max-width:1000px;margin:0 auto}
  h1{font-size:20px} h2{font-size:14px;color:#aaa;font-weight:normal}
  .note{color:#888;font-size:12px;margin-top:10px}
</style>
</head>
<body>
<div class="wrap">
  <h1>开机总耗时历史曲线</h1>
  <h2>数据: ~/logs/boot-history.log ｜ 展示最近 $take 次（累计 $count 条）</h2>
  <canvas id="bootChart" style="max-width:100%;"></canvas>
  <div class="note">纵轴: 秒 ｜ 曲线=开机完整周期总耗时(product开机到图形目标就绪)</div>
</div>
<script>
const labels = [$labels];
const total = [$total];
new Chart(document.getElementById('bootChart'), {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: '开机总耗时(秒)', data: total,
      borderColor: '#4fc3f7', backgroundColor: 'rgba(79,195,247,.2)',
      fill:true, tension:.3, pointRadius:6, pointBackgroundColor:'#4fc3f7'
    }]
  },
  options: {
    plugins:{ legend:{ labels:{ color:'#eee' } } },
    scales:{
      y:{ beginAtZero:true, title:{display:true,text:'秒',color:'#aaa'}, ticks:{color:'#ccc'} },
      x:{ ticks:{color:'#ccc', maxRotation:40, minRotation:20}, grid:{color:'#333'} }
    }
  }
});
</script>
</body>
</html>
HTMLEOF

echo "✅ 已生成曲线图: $OUT"
echo "   展示最近 $take 次开机总耗时（累计 $count 条）"

if [[ -z "$BROWSER" ]]; then
  for b in xdg-open google-chrome google-chrome-stable chromium chromium-browser firefox microsoft-edge; do
    command -v "$b" >/dev/null 2>&1 && { BROWSER="$b"; break; }
  done
fi
if [[ -n "$BROWSER" ]]; then
  "$BROWSER" "$OUT" >/dev/null 2>&1 &
  echo "   已尝试用 [$BROWSER] 打开"
else
  echo "   未找到浏览器，请手动打开: $OUT"
fi
