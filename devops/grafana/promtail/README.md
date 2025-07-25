## Promtail简介

`Promtail` 是 Grafana Labs 专为 `Loki` 打造的 `Log Agent`，主要任务是收集、处理 `Log` 並將之送至 `Loki`。

`Promtail` 目前已并入 [Grafana Alloy](https://github.com/grafana/alloy)：https://grafana.com/blog/2025/02/13/grafana-loki-3.4-standardized-storage-config-sizing-guidance-and-promtail-merging-into-alloy/

### promtail下载

- https://github.com/grafana/loki/releases/
- https://github.com/grafana/loki/releases/download/v3.4.5/promtail-linux-amd64.zip


## 安装Promtail

### 容器安装

```bash
docker pull grafana/promtail:3.5.1

docker run -d --name promtail \
  -v /opt/promtail/config.yaml:/etc/promtail/config.yml \  # 配置文件
  -v /var/log/odoo:/var/log/odoo \  # 挂载Odoo日志目录
  -v /data/promtail:/var/log \  # 持久化positions文件 ★核心挂载★
  grafana/promtail:3.5.1
```

- positions.yaml: 无需手动创建，Promtail 首次启动时自动生成。用于记录日志文件的读取位置（偏移量）。
- /data/promtail：宿主机目录，用于保存自动生成的positions.yaml

### 原生安装

- 安装说明：https://grafana.com/docs/loki/latest/setup/install/local/

1. 下载二进制文件：https://github.com/grafana/loki/releases/download/v3.4.5/promtail-linux-amd64.zip

2. 添加配置文件 `/etc/systemd/system/promtail.service` 或 `/usr/lib/systemd/system/promtail.service`

```conf
[Unit]
Description=promtail
Documentation=https://github.com/topics/promtail
After=network.target

[Service]
Type=simple
User=loki
Group=loki

# ExecStart=/usr/local/bin/promtail -config.file /etc/promtail/config.yml
ExecStart=/usr/local/bin/promtail --config.file=/etc/promtail/config.yml
Restart=on-failure
MemoryLimit=128M

[Install]
WantedBy=multi-user.target
```

或者使用简单的启动和停止命令：

```bash
nohup promtail --config.file=./conf/config.yml > promtail.log 2>&1 &
kill -9 $(ps -aux | grep promtail | grep -v grep | awk '{print $2}')
```


## 配置文件

`promtail-config.yaml`

`scrape_configs` 配置部分有两种模式：静态配置和动态发现。推荐使用动态发现。

### 静态配置

```yaml
server:
  http_listen_port: 9080  # 管理端口（可访问 /metrics 查看状态）
  grpc_listen_port: 0     # 禁用GRPC（非必需）

positions:
  filename: /var/log/positions.yaml  # 关键！记录文件读取位置

clients:
  - url: http://loki:3100/loki/api/v1/push  # Loki接收地址
    batchwait: 1s          # 批量发送等待时间
    batchsize: 102400       # 每批最大字节数(100KB)

scrape_configs:
- job_name: odoo_logs
  static_configs:
  - targets: [localhost]   # 标识数据来源节点（非功能参数）
    labels:
      job: odoo17          # 主标签（Grafana按此筛选）
      env: prod            # 环境标签
      app: erp             # 应用类型
      __path__: /var/log/odoo/*.log  # 关键！监控路径（支持通配符）
  pipeline_stages:         # 日志处理管道（增强功能）
    - match:
        selector: '{job="odoo17"}'
        stages:
        - regex: 
            expression: '.*(?P<level>WARNING|ERROR|CRITICAL).*'  # 提取日志级别
        - labels:
            level:  # 将提取的level转为标签
```

### 动态发现

```yaml
scrape_configs:
- job_name: odoo_logs
  file_sd_configs:            # 动态文件发现
    - files: ['/etc/promtail/odoo_targets.json'] 
```

`odoo_targets.json`

```json 
[{
  "targets": [ "localhost" ],
  "labels": {
    "__path__": "/var/log/odoo/*.log",
    "job": "odoo17",
    "env": "prod",
    "app": "erp"
  }
}]
```


## 日志轮转方案

```conf
# 配置Odoo日志轮转（/etc/logrotate.d/odoo）
/var/log/odoo/*.log {
  daily
  rotate 7
  missingok
  compress
  delaycompress
  notifempty
  create 644 odoo odoo
  postrotate
    docker kill -s USR1 odoo_container_name
    # pkill -HUP promtail || true
    docker kill -s HUP promtail_container_name
  endscript
}
```

如果非容器环境，在宿主机直接运行 Promtail ，日志轮转通过 ​​logrotate 的 postrotate 脚本发送 HUP 信号​​通知 Promtail 刷新文件句柄：`pkill -HUP promtail`

```bash
# 检查Promtail状态
docker exec promtail wc -l /var/log/positions.yaml
```

--------------

> Promtail — Loki 御用 Log 收集器 https://ithelp.ithome.com.tw/articles/10331661