## 安装Harbor

- [Harbor离线包](https://github.com/goharbor/harbor/releases)：https://github.com/goharbor/harbor/releases

```bash
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

### 基础配置

- 登录地址：http://172.16.160.33:9000/
- 登录账号：`admin`
- 登录密码：见前面 `harbor.yml` 文件的 `harbor_admin_password` 配置项

1. 新建项目，或者对已有的 `library` 项目，配置项目 `成员`，保证用户有推送权限。

2. 编辑 `/etc/docker/daemon.json` 文件，添加 Harbor 地址至 `insecure-registries` 配置中：

```
{
  "insecure-registries": ["172.16.160.33:9000"]
}
```

3. 重启docker使得配置生效：`systemctl restart docker` 或 `service docker restart`

4. 重启Harbor:
```bash
# 进入 Harbor 的 docker-compose 目录
cd harbor
docker-compose down
docker-compose up -d
```

### 镜像操作

1. 命令行登录：

```bash
docker login -u yourname -p yourpassword http://172.16.160.33:9000
```

因为 `docker login` 的 `--password` （`-p`）命令，使用明文密码登录，会产生警告：
```bash
WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /home/santic/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credential-stores
```

2. 镜像推送

```bash
# 拉取公共镜像
docker pull postgres:17.4-bookworm
# 给公共镜像打一个新标签，以便下一步上传镜像到私有镜像仓库
docker tag postgres:17.4-bookworm 172.16.160.33:9000/library/postgres:17.4-bookworm
# 上传镜像到私有镜像仓库。要在上一步先用docker login登录账号
docker push 172.16.160.33:9000/library/postgres:17.4-bookworm
```

3. 镜像拉取

```bash
# 可以设置免登录拉取镜像
docker pull 172.16.160.33:9000/library/postgres:17.4-bookworm
```

----------

> Harbor 安装教程 https://blog.csdn.net/m0_46423830/article/details/145014870