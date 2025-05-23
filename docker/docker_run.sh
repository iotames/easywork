#!/bin/sh

# 在当前Sell环境，使用.和source命令，从某个文件导出环境变量
# .命令是POSIX标准命令，兼容性更广
# 环境变量文件，使用相对路径，会找不到。env.sample: file not found
ENV_FILE=`pwd`/env.sample
echo $ENV_FILE
. $ENV_FILE

echo "TZ: ${TZ}"
echo "WWW_DIR: ${WWW_DIR}"
echo "MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}"
echo "POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}"

docker run -d --restart=always --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -v ./postgres/data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:17.4-bookworm

docker run -d --restart always --name mysql \
  --network yourproject-net \
  -e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
  -v ./mysql/data:/var/lib/mysql \
  -v ./mysql/mysql.cnf:/etc/mysql/conf.d/mysql.cnf \
  -p 3307:3306 \
  mysql:5.7