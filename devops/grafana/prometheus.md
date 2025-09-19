## 资源

- prometheus下载中心：https://prometheus.io/download/
- node_exporter(CPU占用等服务器指标导出): https://github.com/prometheus/node_exporter/releases
- Prometheus(指标数据存储和查询): https://github.com/prometheus/prometheus/releases


## 快速开始

### 下载并启动导出器：node_exporter

在节点服务器`172.16.160.18`, `172.16.160.10`运行数据采集工具。

```bash
# 下载并安装
wget -c https://github.com/prometheus/node_exporter/releases/download/v1.9.1/node_exporter-1.9.1.linux-amd64.tar.gz
tar xzf node_exporter-*.tar.gz
mv node_exporter-*/node_exporter /usr/local/bin/

# 启动
node_exporter --web.listen-address=:9100 --collector.systemd --collector.systemd.unit-whitelist="(docker|sshd)"
```

### 启动Prometheus数据存储与查询

- https://github.com/prometheus/prometheus/releases

1. 下载和安装prometheus: 把下载的prometheus可执行文件，放入 `/usr/local/bin` 目录。
2. 使用命令行启动：`prometheus --config.file=prometheus.yml`

```bash
# prometheus --config.file=prometheus.yml
/usr/local/bin/prometheus \
    --config.file=/etc/prometheus/prometheus.yml \
    --storage.tsdb.path=/var/lib/prometheus/data \
    --web.enable-lifecycle \
    --storage.tsdb.retention.time=30d \
    --storage.tsdb.retention.size=50GB

```

1. 在启动命令中添加 `--web.enable-lifecycle`，使得prometheus支持热更新配置文件。

```bash
# 热更新配置文件
curl -X POST http://localhost:9090/-/reload
```

2. 防止Prometheus服务器的数据存储空间无限增长，导致存储空间爆炸。在Prometheus `启动命令` 或 `配置文件`，通过 `--storage.tsdb.retention.time` 参数指定数据保留时长，`--storage.tsdb.retention.size` 参数限制TSDB占用的最大磁盘空间。

```bash
# 支持单位：y, w, d, h, m, s, ms。
--storage.tsdb.retention.time=30d
# 支持单位：B, KB, MB, GB, TB, PB, EB。
--storage.tsdb.retention.size=50GB
```

- 配置文件：[prometheus.yml](prometheus.yml):

```yaml
# 全局配置
global:
# 设置数据采集频率为2分钟1次。默认1分钟1次。可以设置scrape_configs中覆盖。
  scrape_interval: 2m
# 评估告警规则的间隔，默认为1分钟。一般和scrape_interval设置相同的值。
  evaluation_interval: 2m
# 每次抓取数据的超时时间，默认为10秒 
  scrape_timeout: 10s

# 数据保留策略配置
storage:
  tsdb:
    retention:
    # 数据保留时间，例如30天。单位支持: s, m, h, d, w, y
      time: 30d
    # （可选）同时限制存储空间大小。支持单位：B, KB, MB, GB, TB, PB, EB。
      size: 500MB

scrape_configs:
  - job_name: "server_node"
    static_configs:
      - targets: ["172.16.160.18:9100"]
        labels:
          role: "kanban"
      - targets: ["172.16.160.10:9100"]
        labels:
          role: "gitlab"
```

### 在Grafana中接入Prometheus数据

1. ​​添加数据源: http://172.16.160.18:9090
2. 导入仪表盘​​：模板ID：​​1860​​（Node Exporter全指标看板）或 11074​​（精简单面板）


点击右上角 Last 24 hours → 改为 ​​Last 5 minutes​​（确保时间窗口内有数据）


## 脚本

- `start.sh`

```bash
#!/bin/bash

nohup node_exporter > node_exporter.log 2>&1 &
nohup prometheus --web.enable-lifecycle --config.file=prometheus.yml > prometheus.log 2>&1 &
```
- `stop.sh`

```bash
#!/bin/bash

kill -9 $(ps -aux | grep node_exporter | grep -v grep | awk '{print $2}')
kill -9 $(ps -aux | grep prometheus | grep -v grep | awk '{print $2}')
```