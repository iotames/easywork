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

1. docker启动

- https://kestra.io/docs/installation/docker

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

2. docker compose启动

- https://kestra.io/docs/installation/docker-compose

```yaml
volumes:
  postgres-data:
    driver: local
  kestra-data:
    driver: local

services:
  postgres:
    image: postgres
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: kestra
      POSTGRES_USER: kestra
      POSTGRES_PASSWORD: k3str4
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      interval: 30s
      timeout: 10s
      retries: 10

  kestra:
    image: kestra/kestra:latest
    pull_policy: always
    # Note that this setup with a root user is intended for development purpose.
    # Our base image runs without root, but the Docker Compose implementation needs root to access the Docker socket
    user: "root"
    command: server standalone
    volumes:
      - kestra-data:/app/storage
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/kestra-wd:/tmp/kestra-wd
    # 可以直接指定环境变量文件。环境变量名记得以 `ENV_` 开头。如 `ENV_MY_HOST`,在流程中通过 `{{ envs.my_host }}` 访问。
    env_file:
      - ./.env
    environment:
    # 名为 `ENV_MY_VARIABLE` 的环境变量可以通过 `{{ envs.my_variable }}` 访问。
      ENV_MY_VARIABLE: extra variable value
      KESTRA_CONFIGURATION: |
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
              username: "admin@localhost.dev" # it must be a valid email address
              password: kestra
          repository:
            type: postgres
          storage:
            type: local
            local:
              basePath: "/app/storage"
          queue:
            type: postgres
          tasks:
            tmpDir:
              path: /tmp/kestra-wd/tmp
          url: http://localhost:8080/
    ports:
      - "8080:8080"
      - "8081:8081"
    depends_on:
      postgres:
        condition: service_started
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
