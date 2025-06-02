## 启动n8n

- Node.js版本: `>=v18`

1. npx免安装启动：`npx n8n`
2. npm全局安装：`npm install n8n -g`
3. docker启动：`docker run -d --name n8n -p 5678:5678 -v ./n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n`
4. docker compose启动



Node.js启动：

```bash
# 如果网速慢，可使用国内gitee镜像。
# git clone git@gitee.com:mirrors/n8n.git
git clone git@github.com:n8n-io/n8n.git

cd n8n

# 安装n8n要使用管理员权限运行。npx n8n
# 后续可通过命令npx n8n start 启动
npx --registry=https://registry.npmmirror.com n8n

# 如需固定路径，改用全局安装。可以指定版本号
# npm install -g n8n
# npm install -g n8n@1.94.1
```

Docker 启动：

```bash
# docker pull docker.n8n.io/n8nio/n8n:1.81.0


docker volume create n8n_data
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n

# Using with PostgreSQL
docker run -it --rm \
 --name n8n \
 --network host \
 -p 5678:5678 \
 -e DB_TYPE=postgresdb \
 -e DB_POSTGRESDB_DATABASE=<POSTGRES_DATABASE> \
 -e DB_POSTGRESDB_HOST=<POSTGRES_HOST> \
 -e DB_POSTGRESDB_PORT=<POSTGRES_PORT> \
 -e DB_POSTGRESDB_USER=<POSTGRES_USER> \
 -e DB_POSTGRESDB_SCHEMA=<POSTGRES_SCHEMA> \
 -e DB_POSTGRESDB_PASSWORD=<POSTGRES_PASSWORD> \
 -e GENERIC_TIMEZONE="Asia/Shanghai" \
 # 本地局域网测试需要配置N8N_SECURE_COOKIE=false。因为默认强制开启SSL。
 -e N8N_SECURE_COOKIE=false \
 -v n8n_data:/home/node/.n8n \
 docker.n8n.io/n8nio/n8n
# n8nio/n8n:1.95.2
```

Docker Compose 启动：
```
mkdir n8n-compose
cd n8n-compose

vim .env
```

```.env file
# DOMAIN_NAME and SUBDOMAIN together determine where n8n will be reachable from
# The top level domain to serve from
DOMAIN_NAME=example.com

# The subdomain to serve from
SUBDOMAIN=n8n

# The above example serve n8n at: https://n8n.example.com

# Optional timezone to set which gets used by Cron and other scheduling nodes
# New York is the default value if not set
GENERIC_TIMEZONE=Europe/Berlin

# The email address to use for the TLS/SSL certificate creation
SSL_EMAIL=user@example.com
```

Docker Compose 文件配置了两个容器：一个用于 n8n，另一个用于运行 traefik，这是一个用于管理 TLS/SSL 证书和处理路由的应用程序代理。

```compose.yaml
services:
  traefik:
    image: "traefik"
    restart: always
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.mytlschallenge.acme.tlschallenge=true"
      - "--certificatesresolvers.mytlschallenge.acme.email=${SSL_EMAIL}"
      - "--certificatesresolvers.mytlschallenge.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - traefik_data:/letsencrypt
      - /var/run/docker.sock:/var/run/docker.sock:ro

  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "127.0.0.1:5678:5678"
    labels:
      - traefik.enable=true
      - traefik.http.routers.n8n.rule=Host(`${SUBDOMAIN}.${DOMAIN_NAME}`)
      - traefik.http.routers.n8n.tls=true
      - traefik.http.routers.n8n.entrypoints=web,websecure
      - traefik.http.routers.n8n.tls.certresolver=mytlschallenge
      - traefik.http.middlewares.n8n.headers.SSLRedirect=true
      - traefik.http.middlewares.n8n.headers.STSSeconds=315360000
      - traefik.http.middlewares.n8n.headers.browserXSSFilter=true
      - traefik.http.middlewares.n8n.headers.contentTypeNosniff=true
      - traefik.http.middlewares.n8n.headers.forceSTSHeader=true
      - traefik.http.middlewares.n8n.headers.SSLHost=${DOMAIN_NAME}
      - traefik.http.middlewares.n8n.headers.STSIncludeSubdomains=true
      - traefik.http.middlewares.n8n.headers.STSPreload=true
      - traefik.http.routers.n8n.middlewares=n8n@docker
    environment:
      - N8N_HOST=${SUBDOMAIN}.${DOMAIN_NAME}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://${SUBDOMAIN}.${DOMAIN_NAME}/
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
    volumes:
      - n8n_data:/home/node/.n8n
      - ./local-files:/files

volumes:
  n8n_data:
  traefik_data:
```


- 更新：npm update -g n8n


## 数据存储位置

### 源码启动

- `C:\Users\yourname\.n8n`: 数据目录
- `C:\Users\yourname\.n8n\config`：配置文件

### Docker启动

默认情况下，Docker 卷存储在 Docker 管理的宿主机目录中，而不是由用户直接指定。

- Linux: `/var/lib/docker/volumes/`
- Windows: `C:\ProgramData\Docker\volumes\`

```
# 查看所有卷
docker volume ls

# 查看某个卷的详细信息
docker volume inspect <volume_name>
```

---------

> n8n官方文档：https://docs.n8n.io/