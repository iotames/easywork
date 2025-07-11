## 容器启动

```bash
docker run -d --name promtail \
  -v /opt/promtail/config.yaml:/etc/promtail/config.yaml \  # 配置文件
  -v /var/log/odoo:/var/log/odoo \  # 挂载Odoo日志目录
  -v /data/promtail:/var/log \  # 持久化positions文件 ★核心挂载★
  grafana/promtail:2.9.4
```

- positions.yaml: 无需手动创建，Promtail 首次启动时自动生成。用于记录日志文件的读取位置（偏移量）。
- /data/promtail：宿主机目录，用于保存自动生成的positions.yaml


## 配置文件

`promtail-config.yaml`

### 静态配置

```yaml
scrape_configs:
- job_name: odoo_logs
  static_configs:
  - targets: [localhost]   # 标识数据来源节点（非功能参数）
    labels:
      job: odoo17          # 主标签（Grafana按此筛选）
      env: prod            # 环境标签
      app: erp             # 应用类型
      __path__: /var/log/odoo/*.log  # 关键！监控路径（支持通配符）
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
    docker kill -s HUP promtail_container_name
  endscript
}
```


```bash
# 检查Promtail状态
docker exec promtail wc -l /var/log/positions.yaml
```