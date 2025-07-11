#!/bin/bash

# 创建所需目录结构
mkdir -p ./data/loki/chunks
mkdir -p ./data/grafana

# 设置Loki目录权限（Loki默认用户UID为10001）
sudo chown -R 10001:10001 ./data/loki

# 设置Grafana目录权限（Grafana默认用户UID为472）
sudo chown -R 472:472 ./data/grafana

docker-compose up -d
