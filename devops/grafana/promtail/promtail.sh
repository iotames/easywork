#!/bin/bash

# ./conf：宿主机目录，用于保存自动生成的positions.yaml
# positions.yaml: 无需手动创建，Promtail 首次启动时自动生成。用于记录日志文件的读取位置（偏移量）。
# config.yml 文件放在 /etc/promtail/config.yml

docker run -d --name promtail --restart always \
  -p 9080:9080 \
  -v /home/santic/erp/odoo/log:/var/log/odoodev \
  -v /home/santic/erp.test/odoo/log:/var/log/odootest \
  -v ./conf:/etc/promtail \
  grafana/promtail:3.5.1
