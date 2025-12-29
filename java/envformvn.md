## 环境变量注入配置文件的实现方案


1. ​修改 pom.xml 配置

```xml
<build>
  <resources>
    <resource>
      <directory>src/main/resources</directory>
      <filtering>true</filtering> <!-- 开启变量替换 -->
      <includes>
        <include>application*.yaml</include> <!-- 覆盖所有环境配置文件 -->
      </includes>
    </resource>
  </resources>
</build>
```

2. 切换配置文件

覆盖规则：application-local.yaml > application-dev.yaml > application.yaml（后加载的配置优先级更高）

```
src/main/resources/
  ├── application.yaml          # 主配置（定义激活的Profile）
  ├── application-local.yaml    # 本地环境配置
  ├── application-dev.yaml       # 开发环境配置
  └── application-prod.yaml     # 生产环境配置
```

2.1 指定配置文件

配置 `application.yaml`。添加 `spring.profiles.active` 指向 `local`：

```application.yaml
spring:
  profiles:
  # @profileActive@，表示由Maven动态替换
    active: local
```

等效命令：`java -jar app.jar --spring.profiles.active=local` 说明：

- `--spring.profiles.active=local` 是 ​​Spring Boot 的启动参数​​，作用于​​应用 `运行时` 阶段​​。它直接告诉 Spring Boot 激活名为 local 的 Profile，并加载对应的配置文件（如 application-local.yaml）
- `Maven Profiles` 是 `构建阶段` ​​的配置（如编译、打包），而` Spring Profiles` 是​ `​运行阶段​` ​的配置。两者无依赖关系。命令行参数启动时，Maven 早已完成构建，因此无需 pom.xml 中的 Profile 定义


2.2 动态切换配置文件（可选）


配置 `application.yaml`。添加 `spring.profiles.active` 指向动态变量：

```application.yaml
spring:
  profiles:
  # @profileActive@，表示由Maven动态替换
    active: @profileActive@
```


如果配置了`spring.profiles.active`: `@profileActive@`，则会开启由Maven动态替换配置文件的方式。要在 `pom.xml` 定义 `profiles`:

```pom.xml
<profiles>
  <profile>
    <id>local</id>
    <properties>
      <profileActive>local</profileActive> <!-- 激活local配置 -->
    </properties>
    <activation>
      <activeByDefault>true</activeByDefault> <!-- 默认启用 -->
    </activation>
  </profile>
  <profile>
    <id>dev</id>
    <properties>
      <profileActive>dev</profileActive> <!-- 激活dev配置 -->
    </properties>
  </profile>
</profiles>
```

3. 修改 application-local.yaml 语法

```application-local.yaml
url: jdbc:mysql://${DB_HOST}:${DB_PORT:3306}/${DB_NAME}?useSSL=false
username: ${DB_USERNAME}
password: ${DB_PASSWORD}
```

4. 用法

- 环境变量字符串不能添加引号，否则引号也会被导入xml文件中
- `-P dev` 会激活对应 Profile，将 @profileActive@ 替换为 dev，使 Spring Boot 加载 application-dev.yaml

```bash
# 可以设置spring.profiles.active为local, 固定配置文件为application-local.yaml
export DB_HOST=172.16.160.33
export DB_PORT=3307
mvn clean package -Dmaven.test.skip=true

# 使用 dev 配置（@profileActive@的动态配置文件方式）
mvn clean package -P dev -Dmaven.test.skip=true

# 使用 prod 配置（@profileActive@的动态配置文件方式，同时注入环境变量）
export DB_HOST=10.0.0.1
mvn clean package -P prod -Dmaven.test.skip=true
```
