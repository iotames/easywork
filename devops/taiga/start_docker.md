## 项目下载

- docker: version >= 19.03.0+

```bash
git clone https://github.com/taigaio/taiga-docker.git
cd taiga-docker/
git checkout stable
```

## 配置变量

- 配置：https://docs.djangoproject.com/zh-hans/5.2/ref/settings/

在 `.env` 文件配置变量，以覆盖默认值。
docker-compose.yml 和 docker-compose-inits.yml 都将从此文件中读取数据

```conf
# 数据库账号密码
POSTGRES_USER=taiga
POSTGRES_PASSWORD=taiga

# URL 设置
TAIGA_SCHEME=http
TAIGA_DOMAIN=localhost:9000
# it'll be appended to the TAIGA_DOMAIN (use either "" or a "/subpath")
SUBPATH=""
# events connection protocol (use either "ws" or "wss")
WEBSOCKETS_SCHEME=ws

# 设置密钥，用于加密签名。
SECRET_KEY="taiga-secret-key"
```

- 电子邮件配置

```conf
# 默认情况下，电子邮件将打印在标准输出 （EMAIL_BACKEND=console）。如果您有自己的 SMTP 服务，请将其更改为 EMAIL_BACKEND=smtp
EMAIL_BACKEND=console  # use an SMTP server or display the emails in the console (either "smtp" or "console")
EMAIL_HOST=smtp.host.example.com  # SMTP server address
EMAIL_PORT=587   # default SMTP port
EMAIL_HOST_USER=user  # user to connect the SMTP server
EMAIL_HOST_PASSWORD=password  # SMTP user's password
EMAIL_DEFAULT_FROM=changeme@example.com  # email address for the automated emails

# EMAIL_USE_TLS/EMAIL_USE_SSL are mutually exclusive (only set one of those to True)
EMAIL_USE_TLS=True  # use TLS (secure) connection with the SMTP server
EMAIL_USE_SSL=False  # use implicit TLS (secure) connection with the SMTP server
```

- 队列管理器设置: 用于在 rabbitmq 服务中保留消息。

```conf
RABBITMQ_USER=taiga  # user to connect to RabbitMQ
RABBITMQ_PASS=taiga  # RabbitMQ user's password
RABBITMQ_VHOST=taiga  # RabbitMQ container name
RABBITMQ_ERLANG_COOKIE=secret-erlang-cookie  # unique value shared by any connected instance of RabbitMQ
```

### 其他自定义配置

默认情况下，所有这些自定义选项都处于禁用状态，需要您编辑 `docker-compose.yml`

应该在适当的服务（或在 `docker-compose.yml` 文件中的 `&default-back-environment` 组）中添加相应的环境变量，并使用有效值来启用它们。

如果您使用的是 HTTP（尽管强烈建议反对它），则需要配置以下环境变量，以便您可以访问 Admin：

```conf
# Django Admin 中的会话 cookie
# 添加到 &default-back-environment 环境
SESSION_COOKIE_SECURE: "False"
CSRF_COOKIE_SECURE: "False"

# 公众注册
# 添加到 &default-back-environment 环境
PUBLIC_REGISTER_ENABLED: "True"
# 添加到 taiga-front 服务环境
PUBLIC_REGISTER_ENABLED: "true"

# Gitlab OAuth 登录
# 添加到 &default-back-environment 环境
ENABLE_GITLAB_AUTH: "True"
GITLAB_API_CLIENT_ID: "gitlab-client-id"
GITLAB_API_CLIENT_SECRET: "gitlab-client-secret"
GITLAB_URL: "gitlab-url"
PUBLIC_REGISTER_ENABLED: "True"
# 添加到 taiga-front 服务环境
ENABLE_GITLAB_AUTH: "true"
GITLAB_CLIENT_ID: "gitlab-client-id"
GITLAB_URL: "gitlab-url"
PUBLIC_REGISTER_ENABLED: "true"
```

## 高级配置(可选)

高级配置将忽略 docker-compose.yml 或 docker-compose-inits.yml 中的环境变量。如果您使用的是 env vars，请跳过此部分。

此为直接修改代码配置文件。

### 映射 config.py 文件

从 https://github.com/taigaio/taiga-back 下载文件，settings/config.py.prod.example 并重命名它：

```bash
mv settings/config.py.prod.example settings/config.py
```

将文件映射到 /taiga-back/settings/config.py 。请记住，您必须同时以 docker-compose.yml 和 docker-compose-inits.yml 映射它。您可以通过示例查看 `docker-compose.yml` 中的 `x-volumes` 部分。

编辑 `config.py`:

- Taiga secret key：更改它很重要 。它必须与 taiga-events 和 taiga-protected 中的密钥具有相同的值
- Taiga urls：使用 TAIGA_URL、SITES 和 FORCE_SCRIPT_NAME 配置 Taiga 的投放位置（见下面的示例）
- 连接到 PostgreSQL;check 文件中的 DATABASES 部分
- 连接到 RabbitMQ 以使用 taiga-events;检查文件中的 “EVENTS” 部分
- 连接到 RabbitMQ 以进行 taiga-async;检查文件中的 “TAIGA ASYNC” 部分
- 电子邮件凭证;检查文件中的 “EMAIL” 部分
- 启用/禁用匿名遥测;检查文件中的 “TELEMETRY” 部分

### 映射 conf.json 文件

从 https://github.com/taigaio/taiga-front 下载文件 conf/conf.example.json 并重命名它：

```bash
mv conf.example.json conf.json
```

示例：

```json
{
    "api": "https://taiga.mycompany.com/api/v1/",
    "eventsUrl": "wss://taiga.mycompany.com/events",
    "baseHref": "/",
    ...
}
```

## 配置Admin用户

```bash
docker compose up -d

docker compose -f docker-compose.yml -f docker-compose-inits.yml run --rm taiga-manage createsuperuser
```

## 启动并运行

```bash
docker compose up -d
```

## 配置NGINX代理

```conf
server {
  server_name taiga.mycompany.com;

  location / {
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Scheme $scheme;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_redirect off;
    proxy_pass http://localhost:9000/;
  }

  # Events
  location /events {
      proxy_pass http://localhost:9000/events;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
      proxy_connect_timeout 7d;
      proxy_send_timeout 7d;
      proxy_read_timeout 7d;
  }

  # TLS: Configure your TLS following the best practices inside your company
  # Logs and other configurations
}
```

## 参考资料

> 在生产环境中安装 Taiga: https://docs.taiga.io/setup-production.html#setup-prod-with-docker