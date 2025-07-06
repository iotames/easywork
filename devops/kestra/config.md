## 资源

- https://kestra.io/docs/configuration


## 配置文件

- Kestra 的配置是一个 YAML 文件，可以根据你选择的安装选项作为环境变量传递、作为文件传递，或直接添加到 Docker Compose 文件中。
- 配置数据库，要配置 `datasources` 部分，再将 `kestra.queue.type` 和 `kestra.repository.type` 设置为数据库类型。

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
    #   basePath: "/app/data"
      basePath: "/app/storage"
  queue:
    type: postgres
  tasks:
    tmpDir:
      path: "/tmp/kestra-wd/tmp"
  url: "http://localhost:8080/"
```

使用环境变量的方式传入配置：

```yaml
# 设置环境变量： DATASOURCES_POSTGRES_USERNAME=kestra
datasources:
  postgres:
    username: kestra
```

```yaml
# 设置环境变量： KESTRA_STORAGE_S3_ACCESS-KEY=myKey
kestra:
  storage:
    s3:
      accessKey: myKey
```



## 环境变量

### 环境变量前缀

Kestra 提供了一种在您的流程中使用环境变量的方式。默认情况下，Kestra 仅会查看以 `ENV_` 开头的环境变量。

```yaml
kestra:
  variables:
    envVarsPrefix: ENV_
```

如果在 `Docker Compose` 可能看起来像这样：

```yaml
  kestra:
    image: kestra/kestra:latest
    environment:
      ENV_MY_VARIABLE: extra variable value
      ENV_NEW_VARIABLE: new variable value
      KESTRA_CONFIGURATION:
        kestra:
          variables:
            env-vars-prefix: "ENV_" # this is the default as of version 0.23
```

一个名为 `ENV_MY_VARIABLE` 的环境变量可以通过 `{{ envs.my_variable }}` 访问。

### 全局变量

可以直接在 `kestra.variables.globals` 配置中设置全局变量。这些变量将在实例的所有流程中可用。

例如，使用 `{{ globals.host }}` 的流程将可以访问以下变量：

```yaml
kestra:
  variables:
    globals:
      host: pg.db.prod
```

请注意，如果变量名使用驼峰命名法，它将被转换为连字符命名法。例如，下面显示的全局变量将在使用 `{{ globals['myVar'] }}` 或 `{{ globals['environment-name'] }}` 的流程中可用：

```yaml
kestra:
  variables:
    globals:
      environment_name: dev
      myVar: my variable
```

### 特殊环境变量：UI环境配置

以通过添加 `kestra.environment` 配置来为 UI 中的环境添加标签和颜色进行识别。

```yaml
kestra:
  environment:
    name: Production
    color: "#FCB37C"
```

## Micronaut

 Kestra 是基于 Micronaut 构建的 Java 应用程序，要查看所有可能的配置选项，请查看官方 Micronaut 指南 。

- https://micronaut.io/documentation.html


端口配置：

```yaml
micronaut:
  server:
    port: 8086
```

SSL配置：

```yaml
micronaut:
  security:
    x509:
      enabled: true
  ssl:
    enabled: true
  server:
    ssl:
      clientAuthentication: need
      keyStore:
        path: classpath:ssl/keystore.p12
        password: ${KEYSTORE_PASSWORD}
        type: PKCS12
      trustStore:
        path: classpath:ssl/truststore.jks
        password: ${TRUSTSTORE_PASSWORD}
        type: JKS
```

超时和最大上传文件大小

```yaml
micronaut:
  server:
    maxRequestSize: 10GB
    multipart:
      maxFileSize: 10GB
      disk: true
    readIdleTimeout: 60m
    writeIdleTimeout: 60m
    idleTimeout: 60m
    netty:
      maxChunkSize: 10MB
```

配置 CORS

```yaml
micronaut:
  server:
    cors:
      enabled: true
```

## 插件

Kestra 插件可以通过 `Maven` 仓库使用 `kestra plugins install` 命令进行安装。

```bash
kestra plugins install io.kestra.plugin:plugin-script-python:LATEST
```


## 日志配置

- https://kestra.io/docs/configuration#logger

### 服务器日志

可以通过调整 Kestra 中的 logger 配置参数来更改日志行为：

```yaml
logger:
  levels:
    io.kestra.core.runners: TRACE
    org.elasticsearch.client: TRACE
    org.elasticsearch.client.sniffer: TRACE
    org.apache.kafka: DEBUG
    io.netty.handler.logging: TRACE
    # 默认情况下，服务器日志也包含流程执行日志。要禁用它们,可以配置: flow: 'OFF'
    # 这将禁用将所有流程执行日志包含在服务器日志中，因此它们将仅存储在 Kestra 数据库中。
    flow: 'OFF'
```

### 日志格式

- 我们使用 Logback 来处理日志。您可以更改日志的格式，我们提供了一些默认和常用的配置，通过配置 logback 配置文件 。

如果您想自定义日志格式，可以创建一个 `logback.xml` 文件并将其添加到类路径中。然后，添加一个新的 `JAVA_OPTS` 环境变量： `"-Dlogback.configurationFile=file:/path/to/your/configuration/logback.xml"`

我们提供一些预定义的配置，以及 `logback.xml` 文件的示例：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false">
  <include resource="logback/base.xml" />
  <include resource="logback/gcp.xml" />

  <root level="WARN">
    <appender-ref ref="CONSOLE_JSON_OUT" />
    <appender-ref ref="CONSOLE_JSON_ERR" />
  </root>
</configuration>
```