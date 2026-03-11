## 简介

Camunda 是一个基于 Java 的框架，支持用于工作流和流程自动化的 BPMN、用于案例管理的 CMMN 和用于业务决策管理的 DMN。另请参阅： [实施的标准](https://docs.camunda.org/manual/latest/introduction/implemented-standards/) 。
下图展示了最重要的组件以及一些典型的用户角色。
![architecture-overview.png][1]

- https://docs.camunda.org/manual/latest/introduction/

## 建模设计器

- [Camunda Modeler](https://docs.camunda.org/manual/latest/modeler/)：BPMN 2.0 和 CMMN 1.1 图表以及 DMN 1.3 决策表的建模工具。
- [bpmn.io](http://bpmn.io/)：建模框架和工具包的开源项目。

我们选择 `Camunda Modeler` 建模设计器:

- 下载入口：https://camunda.com/download/modeler/
- Windows: https://downloads.camunda.cloud/release/camunda-modeler/5.33.1/camunda-modeler-5.33.1-win-x64.zip
- Linux: https://downloads.camunda.cloud/release/camunda-modeler/5.33.1/camunda-modeler-5.33.1-linux-x64.tar.gz


## Camunda平台Web服务端

### Camunda BPM Run介绍

Camunda BPM Run 是一个用于部署、运行和管理 Camunda BPM 平台的独立程序。它集成了 Camunda 引擎和 Web 应用程序，提供了一个方便的方式来启动和管理 Camunda BPM 平台。

具体来说，Camunda BPM Run 有以下作用：
（1）部署和管理 Camunda BPM 平台：Camunda BPM Run 提供了一个独立的运行时环境，您可以使用它来部署和管理 Camunda BPM 平台。它集成了 Camunda 引擎、Camunda Web 应用程序和数据库，使您可以方便地启动和配置整个平台。
（2）运行工作流和流程引擎：Camunda BPM Run 提供了一个工作流引擎，可以执行和管理业务流程。您可以使用 Camunda Modeler 创建和编辑 BPMN 流程模型，然后将其部署到 Camunda BPM Run 中进行执行。Camunda BPM Run 提供了任务管理、流程实例跟踪、变量管理等功能，使您可以轻松地追踪和管理工作流的执行状态。
（3）提供 Web 应用界面：Camunda BPM Run 包含一个集成了 Camunda Web 应用程序的 Web 服务器。通过该界面，您可以轻松地管理和监控流程的执行，查看任务列表、处理用户任务、查看流程实例的状态等。Web 应用程序还提供了一个用户任务表单引擎，可以定义和渲染用户任务的表单。
（4）支持扩展和集成：Camunda BPM Run 允许您利用 Camunda 引擎的扩展能力，通过编写插件或自定义扩展来满足特定的需求。它还提供了一些集成选项，可以与其他系统进行集成，例如数据库、消息队列和外部服务。

总之，Camunda BPM Run 提供了一个独立的运行时环境，使您可以轻松地部署、运行和管理 Camunda BPM 平台。它集成了 Camunda 引擎和 Web 应用程序，提供了丰富的功能和界面，支持管理工作流、流程实例和用户任务，并支持扩展和集成以满足特定需求。

运行方式有两种，选择其一即可：

1. Camunda 7 Run
2. Docker运行camunda-bpm-platform


### 下载 Camunda 7 Run

Open Source Community Edition
Includes: BPMN Workflow Engine, DMN Decision Engine, Tasklist, Cockpit Basic
Version: 7.22.0
Release Date: October 8, 2024
Requires: Java development Kit (JDK) 17 & Camunda Modeler

- 下载入口：https://camunda.com/download/platform-7/
- Windows: https://downloads.camunda.cloud/release/camunda-bpm/run/7.22/camunda-bpm-run-7.22.0.zip
- Linux: https://downloads.camunda.cloud/release/camunda-bpm/run/7.22/camunda-bpm-run-7.22.0.tar.gz

`Camunda 7 Run` 依赖 `JAVA环境`(JDK17), 请先保证电脑已安装: [JDK17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)

1. 下载并解压缩：https://docs.camunda.org/manual/latest/user-guide/camunda-bpm-run/
2. 启动 Camunda：运行 start.bat （Windows） 或 start.sh （Linux）
3. 访问：打开 http://localhost:8080/camunda-welcome/index.html 并使用 Camunda webapps Cockpit 和 Tasklist。
4. 运行您自己的工作流程：https://docs.camunda.org/get-started/quick-start/


### Docker运行camunda-bpm-platform

```
# 建议指定版本号：docker pull camunda/camunda-bpm-platform:run-7.22.0
docker pull camunda/camunda-bpm-platform:run-latest
docker run -d ‐‐name camunda -p 8080:8080 camunda/camunda-bpm-platform:run-latest

# open browser with url: http://localhost:8080/camunda-welcome/index.html
```

具体的Tags查看DockerHub官网：https://hub.docker.com/r/camunda/camunda-bpm-platform/tags


### 配置Linux系统服务

vim /usr/lib/systemd/system/camunda.service

```
[Unit]
Description=a BPMN engine
After=network.target

[Service]
WorkingDirectory=/santic/camunda7
PIDFile=/home/santic/camunda7/internal/run.pid
ExecStartPre=/usr/bin/rm -f /home/santic/camunda7/internal/run.pid
ExecStart=/home/santic/camunda7/start.sh
# ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/home/santic/camunda7/shutdown.sh
User=santic
Restart=on-failure
RestartSec=300
# KillSignal=SIGQUIT
TimeoutStopSec=10
# KillMode=control-group
StandardOutput=file:/home/santic/logs/camunda7.log
StandardError=file:/home/santic/logs/camunda7.err.log

[Install]
WantedBy=multi-user.target
Alias=camunda7.service
```

启动camunda系统服务：

```
systemctl daemon-reload
systemctl enable camunda
systemctl start camunda
```



## 支持的数据库

- MySQL 8.0
- Oracle 19c / 23ai
- IBM DB2 11.5 (excluding IBM z/OS for all versions)
- PostgreSQL 14 / 15 / 16 / 17
- Amazon Aurora PostgreSQL compatible with PostgreSQL 14 / 15 / 16
- Microsoft SQL Server 2017 / 2019 / 2022 (see Configuration Note)
- Microsoft Azure SQL with Camunda-supported SQL Server compatibility levels (see Configuration Note):
SQL Server on Azure Virtual Machines
Azure SQL Managed Instance
Azure SQL Database
- H2 2.3 (not recommended for Cluster Mode - see Deployment Note)


官方文档：https://docs.camunda.org/manual/latest/introduction/supported-environments/#supported-database-products


### 更改数据库为PostgreSQL

1. 更改配置文件

编辑 `configuration\default.yml` 文件：

```
spring.datasource:
  url: jdbc:postgresql://localhost:5432/camunda?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&useSSL=false&useSSL=false
  driverClassName: org.postgresql.Driver
  username: postgres
  password: 123456
```

2. 下载JDBC驱动文件

- 下载页面：https://jdbc.postgresql.org/download/
- Java8及以上版本使用：https://jdbc.postgresql.org/download/postgresql-42.7.5.jar

在主程序的 `configuration\userlib` 目录中，放置jdbc驱动包文件： `postgresql-42.7.5.jar`

3. 重启Camunda

## 官方文档手册

Camunda7官方文档：

- 最新版：https://docs.camunda.org/manual/latest/
- 指定版本：https://docs.camunda.org/manual/7.22/
- 快速入门：https://docs.camunda.org/get-started/quick-start/

----------

> Camunda7中文站：http://camunda-cn.shaochenfeng.com/
> 快速入门介绍： http://shaochenfeng.com/camunda/1.快速入门介绍/
> 【工作流】Spring Boot 项目与 Camunda 的整合 https://blog.csdn.net/weixin_44823875/article/details/145572333
> Camunda Platform社区版 - 如何配置和使用mysql(Postgresql)数据库 https://blog.csdn.net/justlpf/article/details/126480898


  [1]: https://blog.catmes.com/usr/uploads/2025/04/1865483511.png