## 说明

Nginx 网络管理界面

https://github.com/0xJacky/nginx-ui/blob/dev/README-zh_CN.md


## 在线预览

网址：https://demo.nginxui.com
用户名：admin
密码：admin

## 准备

Nginx UI 遵循 Debian 的网页服务器配置文件标准。创建的网站配置文件将会放置于 Nginx 配置文件夹（自动检测）下的 sites-available 中，启用后的网站将会创建一份配置文件软连接到 sites-enabled 文件夹。您可能需要提前调整配置文件的组织方式。

```nginx.conf
http {
	# ...
	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*;
}
```

## 快速开始

1. 运行 `./nginx-ui` 命令，会在当前目录生成：配置文件 `app.ini`, 数据库文件 `database.db`

- 常规启动

下载：https://github.com/0xJacky/nginx-ui/releases
配置文件：https://github.com/0xJacky/nginx-ui/blob/dev/app.example.ini

```
# 启动
nginx-ui -config app.ini

# 启动并后台运行
# nohup ./nginx-ui -config app.ini > nginx-ui.log 2>&1 &
nohup ./nginx-ui -config app.ini &

# 停止
kill -9 $(ps -aux | grep nginx-ui | grep -v grep | awk '{print $2}')
```

运行脚本：

```shell
#!/bin/bash

export GIN_MODE=release

if [ "$1" == "stop" ]; then
    kill -9 $(ps -aux | grep nginx-ui | grep -v grep | awk '{print $2}')
    exit 0
fi

# nohup ./nginx-ui -config app.ini &
nohup ./nginx-ui -config app.ini > nginx-ui.log 2>&1 &

```


## Docker启动

- Docker启动: `uozi/nginx-ui:latest`

1. 首次使用时，映射到 /etc/nginx 的目录必须为空文件夹。
2. 如果你想要托管静态文件，可以直接将文件夹映射入容器中。

```shell
docker run -dit \
  --name=nginx-ui \
  --restart=always \
  -e TZ=Asia/Shanghai \
  -v /mnt/user/appdata/nginx:/etc/nginx \
  -v /mnt/user/appdata/nginx-ui:/etc/nginx-ui \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -p 8080:80 -p 8443:443 \
  uozi/nginx-ui:latest
```
