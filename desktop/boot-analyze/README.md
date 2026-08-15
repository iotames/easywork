# boot-analyze 开机耗时分析工具

记录每次开机完整启动周期耗时，并绘制历史曲线，用于对比优化前后开机速度变化。

## 功能

1. **异步记录开机耗时**（不阻塞开机）
2. **持久化历史数据**（趋势 + 完整生命周期原始数据双日志）
3. **绘制历史曲线图**（浏览器图表）

## 文件结构

```
boot-analyze/
├── README.md                # 本说明
├── boot-analyze-record.sh   # 开机耗时记录脚本（登录后异步）
├── boot-analyze-plot.sh     # 历史曲线图绘制脚本
└── boot-analyze-record.desktop  # 图形登录后自动触发的配置
```

## 脚本说明

| 文件名 | 作用 |
|--------|------|
| `boot-analyze-record.sh` | 每次图形登录后，延迟 30 秒异步读取系统启动日志，写入历史数据（不阻塞开机） |
| `boot-analyze-plot.sh` | 读取历史数据，生成开机总耗时 HTML 曲线图并在浏览器打开 |
| `boot-analyze-record.desktop` | DDE 图形登录自启动配置，登录后自动运行记录脚本 |

## 数据日志

| 文件 | 作用 | 格式 |
|------|------|------|
| `~/logs/boot-history.log` | **趋势数据**（绘图用，轻量） | `DATA,日期时间,开机编号,总耗时(秒)` |
| `~/logs/boot-timeline.log` | **原始数据**（分析用，完整生命周期） | `TL,时间,编号,firmware,loader,kernel,userspace,total,graph` + 分阶段/关键链路/Top服务详情 |

### timeline 原始数据含义
```
firmware  固件启动耗时(秒)
loader    引导加载耗时(秒)
kernel    内核启动耗时(秒)
userspace 用户空间占用耗时(秒)
total     完整周期总耗时(firmware+loader+kernel+userspace)
graph     图形目标(graphical.target)就绪耗时(秒)
```

## 使用方法

### 安装（root）

```bash
# 记录脚本放到系统可执行路径
sudo cp boot-analyze-record.sh /usr/local/bin/boot-analyze-record.sh
sudo chmod +x /usr/local/bin/boot-analyze-record.sh

# 绘图脚本放到系统可执行路径
sudo cp boot-analyze-plot.sh /usr/local/bin/boot-analyze-plot.sh
sudo chmod +x /usr/local/bin/boot-analyze-plot.sh

# DDE 登录自启动：复制到 autostart 目录
mkdir -p ~/.config/autostart
cp boot-analyze-record.desktop ~/.config/autostart/
```

### 记录（自动）

安装后每次**图形登录 30 秒后**，自动记录本次开机耗时，无需手动操作。

### 查看历史曲线

```bash
# 默认画最近 10 次开机总耗时曲线（浏览器打开）
/usr/local/bin/boot-analyze-plot.sh

# 画最近 16 次
/usr/local/bin/boot-analyze-plot.sh -n 16

# 自定义输出文件
/usr/local/bin/boot-analyze-plot.sh -n 7 -o /tmp/my-plot.html
```

### 查看原始数据

```bash
cat ~/logs/boot-history.log     # 趋势数据(总耗时)
cat ~/logs/boot-timeline.log    # 完整生命周期原始数据
```

## 设计要点

- **不阻塞开机**：记录脚本由图形登录后 autostart 触发，异步后台执行，不影响开机速度和启动链路。
- **双数据分离**：轻量趋势日志给曲线图；完整生命周期原始日志给深入分析，各司其职不混淆。
- **零丢数据**：登录后 `systemd-analyze` 数据必定已就绪，避免开机早期数据缺失问题。

## 常见问题

**Q: 开机变慢时记录脚本会不会拖慢开机？**
A: 不会。脚本是登录后异步后台运行，完全在开机完成之后执行。

**Q: 曲线图为什么打不开浏览器？**
A: 若系统缺少 GUI 浏览器，脚本会提示 HTML 路径，可手动打开：
`~/logs/boot-history-plot.html`
