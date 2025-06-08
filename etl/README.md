## ETL简介

`ETL(Extract-Transform-Load)`: 在大数据技术领域内，用来描述将数据从 来源端 经过 `抽取(extract)`, `转换(transform)`, `加载(load)` 至 目的端 的过程。 `ETL` 一词常用在数据仓库，但其对象并不限于数据仓库。

因此，`ETL` 更多是一个抽象概念，可以用任何编程语言来完成开发。无论是 `python`, `java`, 甚至数据库的 `存储过程`，只要它最终是让数据完成 `抽取` -> `转化` -> `加载` 的效果即可。
愈来愈多的企业采用工具或抽象成类来实现开发和管理。

`ETL` 能够对各种分布的、异构的源数据(如关系数据)进行 `抽取`，按照预先设计的规则将不完整数据、重复数据以及错误数据等 `脏数据` 内容进行 `清洗`，得到符合要求的 `干净` 数据，并 `加载` 到数据仓库中进行存储，这些 "干净" 数据就成为了数据分析、数据挖掘的基石。

`ETL` 是实现商务智能(Business Intelligence，BI)的核心。一般情况下，ETL会花费整个BI项目三分之一的时间，因此ETL设计得好坏直接影响BI项目的成败。

如果说 `数据仓库` 的模型设计是一座大厦的设计蓝图，数据是砖瓦的话，那么 `ETL` 就是建设大厦的过程。


## ETL工具和Kettle

`Kettle(Pentaho Data Integration)`: 中文名叫水壶，项目的概念是把各种数据放到一个壶里，然后以指定的格式流出。是国外开源的 `ETL` 工具，纯 `java` 编写，可以在Windows、Linux、Unix上运行。

[Kettle入门: https://blog.csdn.net/qq_44134480/article/details/128748898](https://blog.csdn.net/qq_44134480/article/details/128748898): 

### Kettle家族

`Kettle` 家族目前包括4个产品：`Spoon`、`Pan`、`CHEF`、`Kitchen`。

1. `Spoon`：勺子，GUI方式的 `转换` 设计工具。 可以用来开发 `转换`、`任务`、`创建数据库`、`集群`、`分区` 等。

2. `Pan`：煎锅，命令行方式的 `转换` 执行工具。可批量执行，并支持后台运行。

3. `Chef`：厨师，GUI方式的 `作业(job)` 设计工具。 任务通过允许每个转换，任务，脚本等等，更有利于自动化更新数据仓库的复杂作业。

4. `Kitchen`：厨房，命令行方式的 `作业(job)` 执行工具。 可批量使用由 `Chef` 设计的任务 (例如使用一个时间调度器)。KITCHEN也是一个后台运行的程序。

但要注意：kettle的内存释放极差，一定要监测kettle的内存使用情况。

kettle文件类型：

- `.ktr`: 即 `Transformation`, 完成数据的基础转换。
- `.kjb`: 即 `Job`, 完成整个作业流的控制。一个作业包含一个或多个转换。
- `.kdb`: 数据库配置文件


## Kettle资源

- GitHub项目主页: https://github.com/pentaho/pentaho-kettle
- https://juejin.cn/s/kettle官网
- Kettle中文网 http://www.kettle.org.cn/


## KettlePack 任务调度工具

[KettlePack](https://www.congjing.net/h-col-147.html) 是由从晶科技开发的基于Kettle9（兼容Kettle8及其他版本）的web端调度监控管理平台，专门用来调度和监控由Kettle客户端创建的Job和Transformation。
安装使用简单方便，并拥有完善的帮助文档和在线支持，目前基本可以支持所有的组件，包括大数据组件（hbase、hive、hdfs等）。 

----------

> 浅谈ETL https://www.jianshu.com/p/da9beed7341f
> ETL简介 https://blog.csdn.net/fuhanghang/article/details/129546712
> kettle概念-ETL,Kettle,Spoon等区别 https://blog.csdn.net/u014636209/article/details/82055854
> Kettle简介 https://blog.csdn.net/qq_44134480/article/details/128748898