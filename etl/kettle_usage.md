## 环境准备

1. JAVA环境
2. Kettle文件夹和环境变量
3. 资源库配置

```bash
export KETTLE_HOME=/opt/pentaho/data-integration
export PATH=$PATH:$KETTLE_HOME
```

### 资源库的配置和使用


将图形界面保存的 `.kjb/.ktr` 文件，存放至统一目录

- 首次启动 `Spoon`，如已有文件资源库，则如下配置：

点击右上角 `​​Connect`​​ → ​​​`Other Repositories`​​ → ​​选择 ​`​File Repository`​​ → 点击 `​​Get Started​​` → 输入资源库名称和路径

- 已配置好资源库的情况下，可以再添加新资源库：

`​​Connect` → `Repository Manager​​` → `Add` → `Other Repositories` → ​选择 `​​File Repository` → `​​Get Started​​` → 输入资源库名称和路径

若找不到 `Connect`​​按钮，请检查 `jdk版本` 与当前 `Kettle版本` 是否匹配。如：`kettle 9.3` 需要使用 `jdk11`

- 使用资源库：

方法一：左上角菜单下有个快捷操作栏，图标从左到右依次是：`新建`、`打开`、`浏览`、`保存`、`另存为`。可以直接点击 `打开` 图标，选择要打开的文件。
方法二：点击左上角菜单 `工具` → `资源库` → `探索资源库` → 点击选项卡 `浏览` → 双击想要打开的 `Jon文件`  →  双击右下角 `Close` 按钮。就可看见已经打开了一个Job了。


## 常用命令

|工具名称   | 读取或运行的文件类型 | 说明
|----------|----------------|----------------
|Pan      | .ktr          | 命令行执行数据 `转换`
|Kitchen  | .kjb          | 命令行执行ETL `作业`。用于调度和作业流控制
|Spoon CLI| .ktr/.kjb     | 命令行模式`执行`转换或作业
|Spoon GUI| .ktr/.kjb     | 图形化界面`设计`转换或作业
|Carte    | 无直接执行     | 远程服务网关（通过API触发执行）
|Pentaho Chef| .kjb      | 创建/编辑 `作业`。商业版中的作业编排工具(需额外授权)通过拖拽方式将多个转换（.ktr）组合为复杂作业流


### Pan 转换执行​

```
# 执行基础转换（Pan）
# ./pan.sh -file=/etl/trans/customer_sync.ktr -level=Minimal >> /logs/trans.log
pan.sh -file=/data/etl_jobs/data_clean.ktr -level=Debug >> /var/log/clean.log 2>&1

# 带参数执行转换（动态过滤数据）
pan.sh -file=/etl/clean_data.ktr \
       -param:FILTER_DATE=202506 \
       -level=Debug \
       >> /var/log/clean_$(date +%Y%m%d).log 2>&1

# 并行处理（提升性能）
pan.sh -file=/etl/transform.ktr \
       -nativethreadcount=8 \
       -var:INPUT_DIR=/data/input
```

### ​​Kitchen 作业调度​

```
# 执行作业流程（Kitchen）
# ./kitchen.sh -file=/etl/jobs/nightly_etl.kjb -level=Error -log=/logs/nightly.log
kitchen.sh -file=/data/etl_jobs/sales_etl.kjb -level=Basic >> /var/log/etl.log 2>&1

# 执行带错误重试的作业
kitchen.sh -file=/jobs/sync.kjb -retry=3 -retrydelay=60 -level=Basic

# 轻量级调度
crontab -e
# 添加以下行以每天凌晨2点执行作业
0 2 * * * /opt/kettle/kitchen.sh -file=/etl/jobs/daily.kjb >> /var/log/daily_etl.log 2>&1
```

### Carte 远程服务​

```
# 启动Carte节点（集群模式）
carte.sh -port=8081 -cluster=prod_cluster -nodeid=node01

# 通过HTTP API触发作业
curl -X POST "http://carte-server:8081/kitchen?job=/jobs/nightly_sync.kjb"
```

### Spoon CLI 自动化调试​

```
# 无头模式运行转换（用于CI/CD流水线）
spoon.sh --headless --execute=/etl/data_migration.ktr
```


## 数据库驱动

- 数据库驱动目录：Kettle 主程序下的 `lib` 目录。
- MySQL 驱动：`mysql-connector-j-9.2.0.jar`。https://downloads.mysql.com/archives/c-j/。下拉框选择：`Platform Independent` ->  选择 `Platform Independent (Architecture Independent), ZIP Archive` 


## 配置与监控

在 `用户主目录` (即Linux的 `$HOME` 或Windows的 `%HOME%` )的 `.kettle` 和 `.pentaho` 目录。

- 密码加密: 执行kettle目录的 `Encr.bat` (Linux则使用 `encr.sh`)文件

```
# 得到加密后的密码字符串，复制到.kettle/kettle.properties文件的密码变量中
Encr.bat -kettle 待加密密码字符串
```

- 变量配置文件: `.kettle/kettle.properties`

```
# kettle可以直接使用变量代替数据库主机名，用户名，密码等。
pg_local_host=127.0.0.1
pg_local_port=5432
pg_local_dbnm=postgres
pg_local_user=postgres
pg_local_pwd=Encrypted 2be98afc86aa7f2e4bb16bd64d980aac9
```

- 资源库配置文件: `.kettle/repositories.xml`。 

```.kettle/repositories.xml
<?xml version="1.0" encoding="UTF-8"?>
<repositories>
  <repository>    <id>KettleFileRepository</id>
    <name>santicdc</name>
    <description>File repository</description>
    <is_default>true</is_default>
    <base_directory>C:\projects\kettleresp</base_directory>
    <read_only>N</read_only>
    <hides_hidden_files>N</hides_hidden_files>
  </repository>  </repositories>
```

1. 资源库 vs 文件系统：作业/转换建议保存为文件（.kjb/.ktr），而非数据库资源库——避免连接依赖，更易版本化管理310
2. 参数化设计：使用 `-param:KEY=VALUE` 传递动态变量（如日期、环境标识），提升脚本复用率
3. 内存优化：建议调整 JVM 参数。比如在 `pan.sh, kitchen.sh` 中设置 `JAVA_OPTS="-Xmx4G"` 以支持大数据量处理
4. 状态监控：返回码≠0时触发告警（如Code 7=转换加载失败）。

- 建立ETL监控看板（推荐使用Grafana）
- 每周检查磁盘空间和日志文件


### 监控告警

- 集成Prometheus监控

```
# 执行时添加监控参数
kitchen.sh -file=job.kjb --metrics -metric-port=9090
```

- 在 `kettle.properties` 配置邮件告警

```kettle.properties
# 邮件通知配置
MAIL_HOST=smtp.yourcompany.com
MAIL_PORT=587
MAIL_USER=alert@company.com
MAIL_PASSWORD=*****
MAIL_USE_TLS=true
```


## 日志级别

1. 没有日志(Nothing):完成没有任何日志输出
2. 错误日志(Error):只输出错误信息
3. 最小日志(Minimal)：只输出打开转换、开始执行转换、转换完成和错误信息
4. 基本日志(Basic)：每一个步骤执行完后输出一条统计信息，默认是基本日志
5. 详细日志(Detailed)：每一个步骤都会输出开始、结束等信息
6. 调试(Debug)：每一个步骤都会输出开始、处理、结束等信息，方便调试
7. 行级日志(非常详细)(Rowlevel)：每处理一行数据都会输出一条信息，会输出大量日志，尽量不要用

基本日志的输出像这样：
```
Merge Join.0 - 完成处理 (I=0, O=0, R=57462, W=362, U=0, E=0)
```

- I:输入的记录数(不是从上一个步骤读取，是从文件、数据库等地方读取，一般输入控件才有)
- O:输出的记录数(不是输出到下一个步骤，是输出到文件、数据库等，一般输出控件才有)
- R:从前面步聚读取的记录数
- W:向后面步骤输出的记录数
- U:更新的记录数
- E:出错的记录数


## 容器化部署

```dockerfile
FROM openjdk:11-jre
COPY data-integration /opt/kettle
WORKDIR /opt/kettle
CMD ["kitchen.sh", "-file=/jobs/sales_etl.kjb"]
```