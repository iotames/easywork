## 安装Harbor

- [Harbor离线包](https://github.com/goharbor/harbor/releases)：https://github.com/goharbor/harbor/releases

```
# 解压安装包
tar -zxvf harbor-offline-installer-v2.12.1.tgz

cd harbor

# 复制并编辑配置文件
cp harbor.yml.tmpl harbor.yml
vim harbor.yml

# 安装准备
./prepare

# 安装Harbor: 导入镜像并启动容器
# 可能会出现一些权限问题，需要用到root权限。
./install.sh
```

`harbor.yml` 文件：

- hostname: 要访问的主机地址。例：172.16.160.33
- http.port: HTTP网页端口号。例：9000
- https: 可以先注释掉。记得注释掉下面包含的port, certificate, private_key 等配置项
- `harbor_admin_password`: 登录密码
- external_url: 反向代理的时候需要配置。这边先注释掉。


## 使用Harbor

- 登录地址：http://172.16.160.33:9000/
- 登录账号：`admin`
- 登录密码：见前面 `harbor.yml` 文件的 `harbor_admin_password` 配置项

编辑 `/etc/docker/daemon.json` 文件，添加 Harbor 地址至 `insecure-registries` 配置中：

```
{
  "insecure-registries": ["172.16.160.33:9000"]
}
```

重启docker使得配置生效：`systemctl restart docker` 或 `service docker restart`

重启Harbor:
```
# 进入 Harbor 的 docker-compose 目录
cd harbor
docker-compose down
docker-compose up -d
```

命令行登录：

```
docker login -u yourname -p yourpassword http://172.16.160.33:9000
```

## 推送和拉取镜像

### 推送镜像

1. 新建项目，或者对已有的 `library` 项目，配置项目 `成员`，保证用户有推送权限。
2. 本地标记镜像：`docker tag postgres:17.4-bookworm 172.16.160.33:9000/library/postgres:17.4-bookworm`
3. 命令行登录：`docker login -u yourname -p yourpassword http://172.16.160.33:9000`
4. 推送到镜像仓库：`docker push 172.16.160.33:9000/library/postgres:17.4-bookworm`
5. 拉取镜像：`docker pull 172.16.160.33:9000/library/postgres:17.4-bookworm`


----------

> Harbor 安装教程 https://blog.csdn.net/m0_46423830/article/details/145014870