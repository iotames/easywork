## 下载并安装

```bash
# 下载并安装
wget -c https://github.com/prometheus/node_exporter/releases/download/v1.9.1/node_exporter-1.9.1.linux-amd64.tar.gz
tar xzf node_exporter-*.tar.gz
mv node_exporter-*/node_exporter /usr/local/bin/
```

## 启动

```bash
# 默认采集的指标非常多。这边指定采集关注的指标
node_exporter \
  --collector.disable-defaults \
  --collector.cpu \
  --collector.meminfo \
  --collector.diskstats \
  --collector.netdev \
  --collector.filesystem \
  --collector.loadavg \
  --collector.filesystem.mount-points-exclude='^/(dev|proc|sys|run|var/lib/(docker|kubelet)).+($|/)' \
  --web.listen-address=:9100 \
  --log.level="warn"
```

node_exporter.service:

```ini
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=prometheus
Group=prometheus
ExecStart=/usr/local/bin/node_exporter \
    --collector.disable-defaults \
    --collector.cpu \
    --collector.meminfo \
    --collector.diskstats \
    --collector.netdev \
    --collector.filesystem \
    --collector.loadavg \
    --collector.filesystem.mount-points-exclude='^/(dev|proc|sys|run|var/lib/(docker|kubelet)).+($|/)' \
    --web.listen-address=:9100 \
    --log.level=warn
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## 常用参数

--web.listen-address​​ 指定监听地址和端口（默认 :9100）可按需更改
​​--log.level​​ 设置日志级别（如 warn）生产环境建议调高，减少日志输出
--collector.disable-defaults 禁用所有默认收集器

- 常用指标：

1. --collector.cpu​​ 采集 CPU 使用时间（各模式）​启用​​，核心指标
​​2. --collector.meminfo​​ 采集内存使用情况 ​​启用​​，核心指标
​​3. --collector.diskstats​​ 采集磁盘 I/O 统计信息 ​启用​​，核心指标
​​4. --collector.netdev​​ 采集网络设备统计信息（流量、错误包等） ​启用​​，核心指标
​​5. --collector.filesystem​​ 采集文件系统磁盘空间使用情况 ​启用​​，核心指标
​6. --collector.loadavg​​ 采集系统平均负载 ​启用​​，核心指标
7. --collector.netstat 网络统计收集器