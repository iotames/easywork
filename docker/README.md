---
layout: home
title: Docker
---

{% comment %}
页面主体内容移到这里
{% endcomment %}

## Docker配置

- 配置文件：`/etc/docker/daemon.json`
- 私有镜像仓库地址配置：`{ "insecure-registries": ["172.16.160.33:9000"] }`
- docker镜像和容器等工作文件所在目录：`/var/lib/docker/`
- 更改数据目录（也可以使用软连接指向 `/var/lib/docker`）：`{ "data-root": "/data/docker" }`


重载进程或docker使配置立即生效：

```
systemctl daemon-reload
systemctl restart docker.service
```

## 环境变量

```bash
docker run -d --env-file ./env.list your_image_name
```

```yaml
version: '3'
services:
  your_service:
    image: your_image_name
    env_file:
      - ./env.list
```

## 日志配置

容器默认使用 json-file 日志驱动，其日志文件（如 37cf0f6b...-json.log）无自动轮转策略，很可能导致磁盘爆炸。

- 如果已有容器内，已经有庞大的日志文件，可先删除。重启后会新建日志文件。然后限定日志大小。

```
rm -rf /var/lib/docker/containers/37cf0f6b2bd911feba7a99be9f8082e968e3573830459ca17d529ef1ed687757/37cf0f6b2bd911feba7a99be9f8082e968e3573830459ca17d529ef1ed687757-json.log
```

- 针对所有容器：修改配置文件 `/etc/docker/daemon.json`

```json
// /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  }
}
```

重启容器服务，使配置生效：
```
systemctl daemon-reload
systemctl restart docker
```

- 针对单个运行容器

```bash
docker run -d \
  --log-driver=json-file \
  --log-opt max-size=100m \
  --log-opt max-file=3 \
  gitlab/gitlab-ee:latest
```

## 镜像仓库

- registry.md: [Docker镜像仓库的使用](registry.md)

## 常用命令

### 系统服务命令

- 重载    `systemctl daemon-reload`
- 重启    `systemctl restart docker`
- 开机启动 `systemctl enable docker`
- 停止服务 `systemctl stop docker`

### Docker管理命令

- Docker系统管理

```
# 查看网络列表
docker network ls
# 查看数据卷列表
docker volume ls

# 查看Docker磁盘使用情况
docker system df

# 删除所有（本地）没有被容器使用的volume. 常用
docker volume prune

# 命令可以用于清理磁盘，删除关闭的容器、无用的数据卷和网络，以及dangling镜像(即无tag的镜像)。
docker system prune
```

- 镜像管理

```
# 查看本地所有镜像：
docker images

# 拉取下载远程镜像到本地
docker pull mysql:5.7
docker pull nginx

# 根据ID查看镜像详情
docker inspect imageId

# 根据关键词，从远程仓库查找镜像
docker search keywords

# 镜像删除。可以用镜像标签或镜像ID。
# 当image有多个tag标签时，此命令只删除指定tag镜像标签，不会删除其他镜像tag。而当只有一个tag标签时，使用docker rmi 会彻底删除该镜像，包括该镜像的所有的AUFS层文件。
docker rmi centos:prod

# 删除所有镜像：
docker rmi $(docker images -q -a)
```

- 容器实例管理

```
# 显示状态为运行（Up）的容器
docker ps
# 显示所有容器,包括运行中（Up）的和退出的(Exited)
docker ps -a

# 创建并启动一个容器
docker run
# 停止容器运行
docker stop
# 启动已停止的容器
docker start
# 重启容器
docker restart
# 删除已停止的容器
docker rm
```
