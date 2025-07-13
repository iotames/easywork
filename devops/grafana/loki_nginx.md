## Loki收集nginx日志

### 修改nginx配置

为了方便grafana dashbord展示，我们把日志格式修改为json

`vim nginx.conf`:

```
  log_format json escape=json '{'
                    '"remote_addr": "$remote_addr", '
                    '"request_uri": "$request_uri", '
                    '"request_length": "$request_length", '
                    '"request_time": "$request_time", '
                    '"request_method": "$request_method", '                   
                    '"status": "$status", '
                    '"body_bytes_sent": "$body_bytes_sent", '
                    '"http_referer": "$http_referer", '
                    '"http_user_agent": "$http_user_agent", '
                    '"http_x_forwarded_for": "$http_x_forwarded_for", '
                    '"http_host": "$http_host", '
                    '"server_name": "$server_name", '
                    '"upstream": "$upstream_addr", '
                    '"upstream_response_time": "$upstream_response_time", '
                    '"upstream_status": "$upstream_status", '
                    #'"geoip_country_code": "$geoip2_data_country_code", '
                    #'"geoip_country_name": "$geoip2_data_country_name", '
                    #'"geoip_city_name": "$geoip2_data_city_name"'
                    '}';

# 应用日志格式
access_log /var/log/nginx/json_access.log json;
```


### nginx服务器上二进制安装promtail

```bash
#Loki,promtail二进制文件下载
wget https://github.com/grafana/loki/releases/download/v2.8.1/promtail-linux-amd64.zip

#解压
unzip promtail-linux-amd64.zip

#移动到对应目录
mkdir -p /opt/loki/promtail
mv promtail-linux-amd64 /opt/loki/promtail
```

创建配置文件:

```bash
cat > /opt/loki/promtail/promtail-local-config.yaml <<"EOF"
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://192.168.11.60:3100/loki/api/v1/push

scrape_configs:
- job_name: system
  static_configs:
  - targets:
      - localhost
    labels:
      job: varlogs
      __path__: /var/log/*log
  - targets:
      - localhost
    labels:
      job: nginxlogs
      __path__: /var/log/nginx/*log
EOF
```

- nginx日志路径/var/log/nginx，根据实际修改
- 192.168.11.60:3100 为loki服务器地址，根据实际修改

```bash
# 创建用户
useradd -M -s /usr/sbin/nologin loki
# 更改loki文件夹权限
chown loki:loki -R /opt/loki
```

创建 systemd 服务:

```bash
cat > /etc/systemd/system/promtail.service <<"EOF"
[Unit]
Description=promtail
Documentation=https://github.com/topics/promtail
After=network.target
[Service]
User=loki
Group=loki
Type=simple
ExecStart=/opt/loki/promtail/promtail-linux-amd64 --config.file=/opt/loki/promtail/promtail-local-config.yaml
Restart=on-failure
[Install]
WantedBy=multi-user.target
EOF
```

启动 loki和 promtail

```bash
systemctl daemon-reload
systemctl start promtail
```

### grafana图形展示nginx日志

点击设置里面的 `数据源` --点插件--然后搜索 `loki` --点击搜索出来的loki插件, 创建loki数据源。填写loki数据源地址，应用并保存

- 添加doshbarod

1. id：16101
2. https://grafana.com/grafana/dashboards/16101-grafana-loki-dashboard-for-nginx-service-mesh/?tab=revisions


## grafana图形展示nginx日志中客户端ip的国家和城市

### Nginx安装ngx_http_geoip2_module扩展

二选一：

1. nginx编译安装ngx_http_geoip2_module（略）
2. docker安装已经编译好ngx_http_geoip2_module的nginx

```bash
# 如通过docker-compose安装好的tengine，已经安装了ngx_http_geoip2_module模块，如下命令检查
docker exec -it tengine nginx -V|grep "ngx_http_geoip2_module-3.4"
```

### 下载GeoLite2数据库

- 官网下载(`GeoLite2 City` 对应的zip压缩包)：https://www.maxmind.com/en/accounts/current/geoip/downloads
- 阿里云盘下载：https://www.aliyundrive.com/s/QDMPjoknb8b

把下载好的GeoLite2解压得到的GeoLite2-City.mmdb数据库文件放在nginx服务器上
编译安装nginx存放位置：/etc/nginx/geoip2/GeoLite2-City.mmdb
docker安装tengine存放位置：docker-compose/tengine/geoip2/GeoLite2-City.mmdb

### 修改配置

`docker-compose.yml`配置：

```yaml
services:
  tengine:
    image: registry.cn-shenzhen.aliyuncs.com/linge360/tengine:2.4.0-geoip2
    volumes:    
      - ./geoip2:/etc/nginx/geoip2
```

`nginx.conf` 配置

`vim nginx.conf` 增加如下配置：`/etc/nginx/geoip2/GeoLite2-City.mmdb` 根据实际填写

```
http {
  log_format json escape=json '{'
                    ...
                    ...
                    '"geoip_country_code": "$geoip2_data_country_code", '
                    '"geoip_country_name": "$geoip2_data_country_name", '
                    '"geoip_city_name": "$geoip2_data_city_name"'
                    '}'


    geoip2 /etc/nginx/geoip2/GeoLite2-City.mmdb {
        $geoip2_data_country_code country iso_code; #字符显示国家
        $geoip2_data_city_name city names zh-CN; #中文显示城市名
        $geoip2_data_country_name country names zh-CN; #中文显示国家名
    }
}
```

重启容器：

```
docker compose restart
```

### 修改图形

修改Top 10 visitor IPs这张图形，表达式修改如下

```
topk(10, sum by(remote_addr, geoip_country_code, geoip_country_name, geoip_city_name) (count_over_time({$label_name=~"$label_value", job=~"$job", instance=~"$instance"} | json | __error__="" [$__interval])))
```

新增加请求非200的图形
```
{$label_name=~"$label_value", job=~"$job", instance=~"$instance"} | json | status >= 400 and request_uri !="/favicon.ico" | line_format "➡️ {{.remote_addr}} {{.geoip_country_name}} {{.geoip_city_name}} {{.request_method}} {{.http_host}}{{.request_uri}} status: {{.status}} "
```


## 参考资料

> Loki收集nginx日志 https://www.yuque.com/linge365/bfgv2p/tlap3n4k4tnky32v
> https://www.bilibili.com/video/BV1nw411D7n7