## 运行时配置​


### 配置文件注入（优先级在命令参数和环境变量之后）

1. `工作目录下`（执行命令的目录）的​ `​config` 文件夹里的配置文件​​ ​`​优先级最高​`。
2. `工作目录下`（执行命令的目录）的配置文件 ​`​优先级次之​`。
3. 同一目录下，文件格式优先级：`.properties` > `.yml` > `.yaml`。低优先级配置文件的 `同名配置`，会被覆盖。

mvn项目的运行时配置文件：

```
./config/
  ├── application.properties  # 定义 server.port=8080
  └── application.yml         # 定义 server.port=9090
​​实际生效端口为 8080​​（.properties 覆盖 .yml）。
```

以 `Spring Boot` 的 `application.properties` 配置文件为例：

```application.properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/db
logging.level.root=INFO
```


### 命令参数显式指定配置文件

```bash
# 仅加载 /conf/
java -jar app.jar --spring.config.location=file:/conf/

# 加载 /conf/ + 默认配置
java -jar app.jar --spring.config.additional-location=file:/conf/
```

- `--spring.config.location`: 覆盖默认配置路径；
- `--spring.config.additional-location`: 追加额外路径。

优先级顺序​​：`--spring.config.location` > `--spring.config.additional-location` > `默认配置路径`​​。


### 环境变量注入（优先级仅次命令参数）

- 更改环境变量后，需重启应用才能生效

1. 源码编写时获取环境变量

```java
// 在源码获取环境变量
String dbUrl = System.getenv("DB_URL");
```

2. 运行启动时注入环境变量。如： `SPRING_DATASOURCE_URL`（点 `.` 需转为下划线 `_`）。

```
# 设置环境变量
export DB_URL=jdbc:mysql://prod-db:3306/app

# 启动应用
java -jar app.jar
```

### 命令参数注入（优先级最高）

1. 在源码中读取：Spring Boot 中直接通过 `@Value("${spring.datasource.url}")`  注入。
2. 启动时，通过命令参数 `--key=value ` 传入。如：`--server.port=8081`

```
java -jar app.jar --spring.datasource.url=jdbc:mysql://test-db:3306/app --server.port=8081
```