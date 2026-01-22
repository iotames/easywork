## 简介

Cordys CRM 是集信息化、数字化、智能化于一体的开源 CRM 系统，支持私有化部署，由飞致云匠心出品。

- 官方文档：https://cordys.cn/docs/
- 开源项目主页：https://github.com/1Panel-dev/CordysCRM


## 环境要求

部署服务器要求：

操作系统：支持主流 Linux 发行版本（基于 Debian / RedHat，包括国产操作系统，内核版本要求 ≥ 3.10）
CPU/内存: 4 核 8 G
磁盘空间: 100G

开放端口号：
- 8081	Web 服务端口	默认 Web 服务访问端口，可根据实际情况进行更改
- 8082	MCP Server 服务端口	默认 MCP 服务访问端口，可根据实际情况进行更改


## 容器部署

```bash
docker run -d \
  --name cordys-crm \
  --restart unless-stopped \
  -p 8081:8081 \
  -p 8082:8082 \
  -v ~/cordys:/opt/cordys \
  1panel/cordys-crm
```

配置文件：`~/cordys/conf/cordys-crm.properties`

最终效果：在浏览器中打开 `http://127.0.0.1:8081/`
用户名: admin
密码: CordysCRM


## 源码部署

### 开发环境

- JDK21 For Windows: https://download.oracle.com/java/21/archive/jdk-21.0.9_windows-x64_bin.zip
- JDK21 For Linux: https://download.oracle.com/java/21/archive/jdk-21.0.9_linux-x64_bin.tar.gz
- Maven: https://dlcdn.apache.org/maven/maven-3/3.9.12/binaries/apache-maven-3.9.12-bin.zip
- nodejs, npm


### 编译项目

项目的前端和后端共用端口号：8081，随意改动可能产生 `CORS` 跨域问题。

项目结构：

```
├── backend                                  # 后端项目
│   ├── app                                  # 应用程序模块
│   ├── crm                                  # CRM 核心模块
│   └── framework                            # 通用框架模块
├── frontend                                 # 前端项目
│   ├── packages                             # 前端包管理
│   │   ├── lib-shared                       # 公共库模块
│   │   │   ├── api                          # API 封装
│   │   │   ├── assets                       # 静态资源
│   │   │   ├── enums                        # 枚举
│   │   │   ├── hooks                        # 钩子函数
│   │   │   ├── locale                       # 国际化封装
│   │   │   ├── method                       # 工具函数
│   │   │   ├── model                        # 数据模型
│   │   │   ├── types                        # 全局类型声明
│   │   ├── mobile                           # 移动端项目
│   │   ├── web                              # WEB端项目
├── installer                                # 安装脚本
├── conf                                     # 配置文件
│   ├── mysql                                # MySQL 配置
│   └── redis                                # Redis 配置
└── shells                                   # 脚本
```

源码下载与编译：

```bash
# 1. 下载源代码
git clone https://github.com/1Panel-dev/CordysCRM.git

# 2. 安装基础 POM
# 该命令会将 parent pom 安装到本地 Maven 仓库，使其他外部子工程可以获取最新的 <properties> 配置。
./mvnw install -N

# 3. 后端构建
# 提示：确保已正确安装 JDK 21 和 Maven 3.8.6 及以上版本和环境。
# 执行以下命令构建后端模块（如 framework、crm、app 等）并安装到本地仓库：
./mvnw clean install -DskipTests -DskipAntRunForJenkins --file backend/pom.xml

# 4. 前端构建
# 在/packages目录下运行依赖安装命令
# pnpm i -w
# 统一构建工程：
# npm run build

# 单独编译Web端工程包
cd package/web
# npm run dev
# 1. 修改 frontend\packages\web\.env.production 配置文件。
# 设置 VITE_API_BASE_URL='http://127.0.0.1:8081'
# 2. 修改 frontend\packages\lib-shared\api\http\index.ts 源码文件。
# 原代码 baseURL: `${window.location.origin}/${import.meta.env.VITE_API_BASE_URL as string}`,
# 新代码 baseURL: `${import.meta.env.VITE_API_BASE_URL as string}`,
npm run build

# 整体打包
./mvnw clean package -DskipTests -DskipAntRunForJenkins
```

配置文件(默认仅支持Linux环境，window系统暂未测试)：
`/opt/cordys/conf/cordys-crm.properties`

```conf
# 服务端口号。默认8081，改为8079，然后通过NGINX反向代理转发HTTP请求
server.port=8079

# 数据库连接 URL，请根据实际环境修改 IP 与数据库名称
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/cordys-crm?autoReconnect=false&useUnicode=true&characterEncoding=UTF-8&characterSetResults=UTF-8&zeroDateTimeBehavior=convertToNull&useSSL=false
# 数据库用户名
spring.datasource.username=root
# 数据库密码
spring.datasource.password=CordysCRM@mysql

# Redis 服务器地址
spring.data.redis.host=127.0.0.1
# Redis 端口
spring.data.redis.port=6379
# Redis 密码
# spring.data.redis.password=CordysCRM@redis

# Redis Session 存储方式（indexed 推荐）
spring.session.redis.repository-type=indexed
# Session 过期时间（单位：秒，示例为 12 小时）
spring.session.timeout=43200s
```

JAVA的 `mvnw` 构建命令，输出如下：

```bash
# 执行命令：mvnw package -DskipTests -DskipAntRunForJenkins
[WARNING]
[WARNING] Some problems were encountered while building the effective settings
[WARNING] Unrecognised tag: 'repositories' (position: START_TAG seen ...</proxies> -->\r\n<repositories>... @23:15)  @ C:\Users\santic\.m2\settings.xml, line 23, column 15
[WARNING]
[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Build Order:
[INFO]
[INFO] cordys-crm                                                         [pom]
[INFO] frontend                                                           [pom]
[INFO] backend                                                            [pom]
[INFO] framework                                                          [jar]
[INFO] crm                                                                [jar]
[INFO] app                                                                [jar]
[INFO]
[INFO] ------------------------< cn.cordys:cordys-crm >------------------------
[INFO] Building cordys-crm main                                           [1/6]
......
[INFO] packages/web build: Done
......
[INFO] --- resources:3.3.1:testResources (default-testResources) @ app ---
[INFO] skip non existing resourceDirectory D:\projects\java\CordysCRM\backend\app\src\test\resources
[INFO]
[INFO] --- compiler:3.14.1:testCompile (testCompile) @ app ---
[INFO] No sources to compile
[INFO]
[INFO] --- surefire:3.5.4:test (default-test) @ app ---
[INFO] Tests are skipped.
[INFO]
[INFO] --- jacoco:0.8.12:report (report) @ app ---
[INFO] Skipping JaCoCo execution due to missing execution data file.
[INFO]
[INFO] --- jar:3.4.2:jar (default-jar) @ app ---
[INFO]
[INFO] --- spring-boot:3.5.9:repackage (repackage) @ app ---
[INFO] Replacing main artifact D:\projects\java\CordysCRM\backend\app\target\app-main.jar with repackaged archive, adding nested dependencies in BOOT-INF/.
[INFO] The original artifact has been renamed to D:\projects\java\CordysCRM\backend\app\target\app-main.jar.original
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Summary for cordys-crm main:
[INFO]
[INFO] cordys-crm ......................................... SUCCESS [  1.153 s]
[INFO] frontend ........................................... SUCCESS [04:12 min]
[INFO] backend ............................................ SUCCESS [  5.995 s]
[INFO] framework .......................................... SUCCESS [  3.294 s]
[INFO] crm ................................................ SUCCESS [ 27.343 s]
[INFO] app ................................................ SUCCESS [  2.367 s]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
```

### 编译错误

如果编译过程中出现以下错误：

```bash
[ERROR] Failed to execute goal on project backend: Could not resolve dependencies
[ERROR] dependency: cn.cordys:quartz-spring-boot-starter:jar:1.0.0 (compile)
```

处理方法有2种：

1. 在本地 Maven 仓库配置中 `添加镜像源`
2. 在本地 Maven 仓库配置中 `配置代理`。

- `全局配置`： 在 `Maven安装目录` 下的 `conf/settings.xml` 文件，是全局的配置文件。
- `局部配置`：新建或编辑 `用户目录` 的 `.m2/settings.xml` 文件，会覆盖全局配置。更改后实时生效，不用重启命令窗口。
- Linux 系统的maven配置文件路径：`~/.m2/settings.xml`

- 通过配置文件设置添加Maven镜像源

```xml
<settings>
    <repositories>
        <repository>
            <id>cordys</id>
            <url>https://repository.fit2cloud.com/repository/public</url>
            <releases>
            <enabled>true</enabled>
            </releases>
            <snapshots>
            <enabled>true</enabled>
            </snapshots>
        </repository>
    </repositories>
</settings>
```

- 通过配置文件设置Maven的https代理

在 `~/.m2/settings.xml` 文件，配置 `https` 代理。测试发现http和socks代理可能无效。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">

    <!--  配置代理（如果在公司网络或需要代理上网时使用） -->
  <proxies>
    <proxy>
      <id>optional</id>
      <active>true</active>
      <protocol>https</protocol>
      <username></username>
      <password></password>
      <host>127.0.0.1</host>
      <port>7890</port>
      <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
    </proxy>
  </proxies>
</settings>
```

### 启动项目

假设项目编译成功的Jar包路径为: `backend/app/target/app-main.jar`

```bash
# 1. 启动Redis
# 2. 启动Mysql
# 3. 设置JAVA环境变量
# 下载前面提到的JDK21，并设置环境变量。示例：
# export JAVA_HOME=/home/santic/jdk-21.0.9
# export PATH=$JAVA_HOME/bin:$PATH
# --spring.config.additional-location=file:config/application.properties 测试发现这个参数无效
java -jar backend/app/target/app-main.jar 
```

### Nginx配置

修改nginx的 `nginx.conf` 文件，添加如下配置：

```conf
# 做个Nginx静态资源服务器，若静态资源找不到，则把请求反向代理到：http://127.0.0.1:8079
    server {
        listen 8081;
        server_name localhost;
        root /usr/local/nginx/html/crmweb;
        index index.html index.htm;

        location / {
                try_files $uri $uri/ @reverse_proxy;
        }

        # 定义名为 @reverse_proxy 的命名Location块，用于处理代理逻辑
        location @reverse_proxy {
            # 设置反向代理的目标地址
            proxy_pass http://127.0.0.1:8079;

            # 以下为重要的请求头设置，确保后端能获取真实的客户端信息
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 一些可选的超时设置，根据后端应用响应情况调整
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }

        # 可选配置：为常见的静态资源文件类型设置更长的缓存时间
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2|ttf)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            # 即使设置了缓存，如果文件不存在，依然会走上面的代理逻辑
            try_files $uri @reverse_proxy;
        }

    }
```

重载Nginx服务:

```bash
sudo nginx -s reload
# 如果报错：nginx: [alert] kill(7430, 1) failed (3: No such process)
# 可能是Nginx主程序并未启动，要手动启动Nginx：
# sudo nginx
# 或者 sudo nginx -c /你的nginx配置文件路径/nginx.conf
```
