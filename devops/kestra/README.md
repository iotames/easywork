## 官方资源

- 项目主页：https://github.com/kestra-io/kestra
- docker镜像：https://hub.docker.com/r/kestra/kestra/tags
- 安装文档：https://kestra.io/docs/installation/docker
- 基础示例：https://kestra.io/docs/tutorial/fundamentals


## 安装启动

### 拉取镜像

去官方网站，查看最新的镜像版本。生产环境建议固化版本号。如：`v0.23.4`

```bash
# 拉取镜像
docker pull kestra/kestra:v0.23.4
```

### 配置数据库

官方的入门示例没挂载数据卷，没连接外部数据库(默认H2数据库)。按以下修改使其更符合生产环境。

应用配置文件 `application.yaml`：

```yaml
datasources:
  postgres:
    url: jdbc:postgresql://postgres:5432/kestra
    driverClassName: org.postgresql.Driver
    username: kestra
    password: k3str4
kestra:
  server:
    basicAuth:
      enabled: false
      username: "admin@kestra.io" # it must be a valid email address
      password: kestra
  repository:
    type: postgres
  storage:
    type: local
    local:
      basePath: "/app/data"
  queue:
    type: postgres
  tasks:
    tmpDir:
      path: "/tmp/kestra-wd/tmp"
  url: "http://localhost:8080/"
```

以上配置取自官方仓库的 [docker-compose.yml](https://github.com/kestra-io/kestra/blob/develop/docker-compose.yml) 文件。


### 启动容器

```bash
#!/bin/bash
# --network host
# -v $(pwd)/plugins:/app/plugins 挂载插件目录可能会导致扩展插件加载失败 

docker run -d --name kestra --restart unless-stopped \
 -p 8080:8080 \
 --user=root \
 -v $PWD/application.yaml:/etc/config/application.yaml \
 -v $(pwd)/confs:/app/confs \
 -v $(pwd)/data:/app/data \
 -v $(pwd)/secrets:/app/secrets \
 -v /var/run/docker.sock:/var/run/docker.sock \
 -v /tmp:/tmp \
 kestra/kestra:v0.23.4 server standalone --config /etc/config/application.yaml
```


## 流程示例

SSH登录服务器执行命令流程示例：

```yaml
id: update_test_odoo
namespace: yourname.dev
tasks:
  - id: remote_opt
    type: io.kestra.plugin.fs.ssh.Command
    commands:
      - cd /home/yourname/erp.test/
      - echo "$(date '+%Y-%m-%d_%H:%M') update.sh" >> kestra.log
      - ./update.sh
    host: 172.16.160.9
    username: yourname
    password: yourname123
```
