## Grafana介绍

 Grafana是一款用 `Go` 语言写的开源跨平台 `度量分析` 和可视化工具。是应用分析中最流行的 `时序数据` 展示工具，目前已支持大部分常用的 `时序数据库`。 可以与整个团队共享，有助于培养团队的数据驱动文化。


## 主要用途

1. Grafana 能够查询、可视化、提醒和探索指标、`日志` 和跟踪，无论它们存储在何处。Grafana OSS 插件框架还使您能够连接其他数据源，例如 NoSQL/SQL 数据库。

2. 通知提醒：以可视方式定义最重要指标的警报规则，Grafana将不断计算并发送通知，在数据达到阈值时（可置顶告警规则）通过 飞书、钉钉、企业微信 等获得通知


## 下载和安装

- 项目主页：https://github.com/grafana/grafana
- 下载地址：https://dl.grafana.com/oss/release/grafana-12.0.2.linux-amd64.tar.gz

```bash
# 下载指定版本的Grafana
# 可以添加 -e 参数指定代理，以加速下载。
# wget -e https_proxy=http://127.0.0.1:7890 -c https://dl.grafana.com/oss/release/grafana-12.0.2.linux-amd64.tar.gz
wget -c https://dl.grafana.com/oss/release/grafana-12.0.2.linux-amd64.tar.gz

# 解压缩
tar -zxvf grafana-12.0.2.linux-amd64.tar.gz

# 进入目录
cd grafana-12.0.2

# 启动Grafana
./bin/grafana-server web
```



## 日志监控方案

`Promtail` 日志采集器（Loki官方） + `Loki` 日志存储系统（日志聚合）+ `Grafana` 数据展示和告警

以监控 `Odoo` 应用的运行日志为例：

1. 首先配置Odoo日志确保正确输出
2. 部署和配置Promtail来采集odoo.log文件
3. 部署Loki作为日志存储
4. 配置Grafana连接Loki数据源并进行日志查询


### 日志输出和权限配置

Odoo配置文件 `odoo.conf`

```odoo.conf
logfile = /var/log/odoo/odoo-server.log  # 日志文件路径
log_level = info  # 日志级别（debug/info/warning/error）
log_handler = :DEBUG  # 模块级日志调试

# 此格式与Promtail的regex表达式完全匹配，避免解析失败
log_format = %(asctime)s %(process)d %(levelname)s %(name)s: %(message)s
```

权限设置

```bash
sudo mkdir /var/log/odoo
sudo chown odoo:odoo /var/log/odoo  # odoo为运行用户
```

### ​部署Promtail（日志采集）

配置文件：promtail-config.yaml

```yaml
server:
  http_listen_port: 9080
clients:
  - url: http://loki:3100/loki/api/v1/push  # Loki服务地址
scrape_configs:
  - job_name: odoo
    static_configs:
      - targets: [localhost]
        labels:
          job: odoo  # 标签用于Grafana筛选
          __path__: /var/log/odoo/*.log  # Odoo日志路径
```

Docker启动：

```bash
docker run -d --name promtail -v ./promtail-config.yaml:/etc/promtail/config.yaml -v /var/log/odoo:/var/log/odoo grafana/promtail
```

### 部署Loki（日志存储）

```bash
docker pull grafana/loki:3.5.1
```

配置文件：loki-config.yaml

```yaml
auth_enabled: false
server:
  http_listen_port: 3100
storage_config:
  filesystem:
    directory: /tmp/loki/chunks  # 存储路径（生产环境建议用S3）
```

Docker启动：

```bash
docker run -d --name loki -p 3100:3100 -v ./loki-config.yaml:/etc/loki/config.yaml grafana/loki:3.5.1
```

### 配置Grafana连接Loki

```bash
docker pull grafana/grafana:12.0.2
```

1. 登录Grafana → ​​Configuration​​ → ​​Data Sources​​ → ​​Add data source​： 选择Loki作为数据源类型，配置Loki的URL（容器内通信地址示例：http://loki:3100）

2. 查询与可视化日志​​：进入 Explore 页面，选择 Loki 数据源，输入查询语句。

```
{job="odoo"} |= "error"  # 筛选包含"error"的日志
{job="odoo"} | logfmt     # 解析结构化日志（如JSON格式）
```

3. ​​创建监控仪表盘

- 将常用查询保存为Dashboard面板（如错误日志统计、登录频率）

​- ​日志表格​​：展示原始日志细节
​- ​柱状图​​：按时间统计错误次数（如count_over_time({job="odoo"} |~ "error" [5m])）



----------------

## 参考资料


> Grafana官方文档：https://grafana.com/docs/grafana/latest/getting-started

> Loki官方文档 https://grafana.com/docs/loki/latest

> Grafana 应用总结 https://blog.csdn.net/m0_62066780/article/details/131580224

> Grafana+Loki使用文档 https://blog.csdn.net/weixin_73610377/article/details/147264197

> Grafana快速入门指南下篇 https://www.cnblogs.com/yinzhengjie/p/18538430

> Grafana安装与使用指南：从基础到进阶 https://edu.51cto.com/article/note/25701.html