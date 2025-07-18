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
    --web.enable-lifecycle
```

在启动命令中添加 `--web.enable-lifecycle`，使得prometheus支持热更新配置文件。

```bash
# 热更新配置文件
curl -X POST http://localhost:9090/-/reload
```

- 配置文件：[prometheus.yml](prometheus.yml):

```yaml
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