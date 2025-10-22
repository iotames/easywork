
## 私有镜像仓库

### Docker镜像仓库服务端

1. 方案一：轻量级 `registry` 镜像仓库服务

```bash
# 服务端

# 1. 下载registry镜像：固定版本标签3.0.0。不使用标签则默认为latest
docker pull registry:3.0.0

# 2. 使用前面下载好的镜像，启动容器实例。
docker run -d -v /opt/images/registry:/var/lib/registry \
-p 9000:5000 \
--restart=always \
--name myregistry registry:3.0.0

# 3. 查看仓库镜像列表：/v2/_catalog
curl http://127.0.0.1:9000/v2/_catalog
# {"repositories":["library/postgres"]}

# 4. 查看仓库镜像的标签列表：/v2/<image-name>/tags/list
curl http://127.0.0.1:9000/v2/library/postgres/tags/list
# {"name":"library/postgres","tags":["17.4-bookworm"]}
```

- `-v` 选项可以将本地仓库目录挂载到容器内的 `/var/lib/registry` 下使用，这样就不会容器被删除后镜像也会随之消失。
- 可修改 `/etc/hosts` 文件，添加域名映射。如：`172.16.160.33 mirrors.local`
- 如果把私有仓库添加到 `registry-mirrors` 列表中，则 `docker pull` 可省略地址前缀。

2. 方案二：企业级 [Harbor](harbor/README.md) 镜像仓库服务


### Docker客户端拉取镜像

1. 配置示例： `/etc/docker/daemon.json` 配置文件

```json
{ 
    "insecure-registries":["172.16.160.33:9000"],
    "registry-mirrors": ["http://172.16.160.33:9000"]
}
```

2. 使用示例：

postgres, registry 等官方镜像，在私有仓库中，推荐添加 `library/` 前缀

```bash
# 客户端

# 1. 定义私有仓库地址。使之可以使用http协议
vim /etc/docker/daemon.json
{ "insecure-registries":["172.16.160.33:9000"] }

# 2. 重载配置。使上面的配置立即生效
# systemctl restart docker.service
systemctl daemon-reload

# 3. 在本地标记待上传的镜像。两个镜像标签最好保持一致，也就是冒号:后面的部分。
docker tag postgres:17.4-bookworm 172.16.160.33:9000/library/postgres:17.4-bookworm

# 4. 上传做标记的镜像
docker push 172.16.160.33:9000/library/postgres:17.4-bookworm

# 5. 拉取镜像
docker pull 172.16.160.33:9000/library/postgres:17.4-bookworm
```


## 中心镜像仓库

1. 进入 `Docker Hub` 首先注册一个账号：https://hub.docker.com
2. 本地登录绑定Docker Hub账号：`docker login`
3. 登录容器变更实例：`docker run -it yourcontainer bash`
4. 前面一波操作更改容器后，通过容器ID创建新镜像：`docker commit b3f9427a5039 hankin/mypy:v2`
5. 查看镜像信息：`docker inspect hankin/mypy:v2`
6. 将镜像推送至Docker Hub：`docker push hankin/mypy:v2`
7. 退出登录：`docker logout`


- 登录Harbor或其他仓库地址：

```
docker login registry.tencent.com
docker login 172.16.160.33:9000
docker login --username=hi34201496@aliyun.com registry.cn-hangzhou.aliyuncs.com
```

- 从ID为 `b3f9427a5039` 的容器创建镜像 `hankin/mypy:v2`

```
docker commit -m="some update" --author="hankin" b3f9427a5039 hankin/mypy:v2
```

- 使用 `tag` 命令变更ID为 `37bb9c63c8b2` 的镜像标签，然后推送到新的私有地址

```
docker tag 37bb9c63c8b2 172.16.160.33:9000/hankin/mypy:v2
docker push 172.16.160.33:9000/hankin/mypy:v2
```

- 使用 `docker images` 查看所有镜像。可获取镜像名，镜像标签，镜像ID等信息。
- `REPOSITORY`: 镜像名。包含镜像仓库地址和镜像在仓库中的路径。镜像仓库地址可以是域名或IP。如果省略地址，则默认为官方镜像仓库。
- `TAG`: 镜像标签。镜像内容有变更，使用镜像标签，标记新版本。
- `IMAGE ID`: 镜像ID。同一个镜像，传送到不同地址的镜像仓库，它们的镜像ID是一样的。

```
REPOSITORY                                            TAG             IMAGE ID       CREATED         SIZE
ubuntu                                                jammy           cc934a90cd99   7 weeks ago     77.9MB
registry                                              3.0.0           3dec7d02aaea   7 weeks ago     57.7MB
192.168.2.101:6000/library/postgres                   17.4-bookworm   f49abb9855df   3 months ago    438MB
postgres                                              17.4-bookworm   f49abb9855df   3 months ago    438MB
```
