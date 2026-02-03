## 官方资源

- 官方文档：https://help.pentaho.com/ -> https://docs.hitachivantara.com/p/pentaho-dia
- Pentaho Data Integration介绍：https://docs.hitachivantara.com/r/en-us/pentaho-data-integration-and-analytics/10.2.x/mk-95pdia003
- 安装和配置：https://docs.hitachivantara.com/r/en-us/pentaho-data-integration-and-analytics/10.2.x/mk-95pdia001

Kettle官方下载需要账户密码登录或填写表单：

- https://support.pentaho.com/
- https://community.hitachivantara.com/
- https://www.hitachivantara.com/en-us/products/pentaho-platform/data-integration-analytics/pentaho-community-edition.html

第三方SourceForge的下载地址，也删除了 `Data Integration`，只留了个pdf文件： https://sourceforge.net/projects/pentaho/files/


## 安装方式

1. 归档文件安装：在我们提供的 Tomcat 版本上运行 Pentaho 服务器 。https://docs.hitachivantara.com/r/6rDdSu9mWRmyMEo3FjBZAg/_b~l~KxXm9TVJdX0u0m44g
2. 手动安装：在现有的 Tomcat Web 应用程序服务器上部署 Pentaho 服务器 。https://docs.hitachivantara.com/r/6rDdSu9mWRmyMEo3FjBZAg/EgaIBd5QMPJ~tVuo3bzssw
3. 安装 Pentaho 设计工具：仅安装 Pentaho 设计工具。https://docs.hitachivantara.com/r/6rDdSu9mWRmyMEo3FjBZAg/~3Twsh3Lv_KxqcoJu3yM2g
4. Docker 容器部署：在 Docker 容器中部署您选择的 Pentaho 产品。https://docs.hitachivantara.com/r/6rDdSu9mWRmyMEo3FjBZAg/Z_f1L~Art~xi22KeC0w9fg
5. 从源码编译：从源代码构建 Pentaho 产品。https://github.com/pentaho/pentaho-kettle

## 使用

- [kettle_usage.md](kettle_usage.md)

1. 资源库配置文件: `~/.kettle/repositories.xml`
2. 变量配置文件: `~/.kettle/kettle.properties`

```bash

# 运行转换
pan.sh -file=/yourpath/kettle_trans.ktr -level=Debug -logfile=logs/kettle.log

# 运行作业(需要指定资源库)

# 指定资源库，目录，作业名。推荐。
kitchen.sh -rep=testrep -dir=/ods -job=myjobname -level=Basic -logfile=logs/kettle.log

# 指定资源库和作业的文件名。
kitchen.sh -rep=testrep -file=/yourpath/myjobname.kjb -level=Basic -logfile=logs/kettle.log

# 无头模式运行转换（用于CI/CD流水线）
spoon.sh --headless --execute=/etl/data_migration.ktr
```

- 驱动目录：Kettle 主程序下的 `lib` 目录。

### MySQL数据库驱动

1. https://downloads.mysql.com/archives/c-j/

2. 点击 `Operating System:` 的下拉框，选择：`Platform Independent` ->  选择 `Platform Independent (Architecture Independent), ZIP Archive` 

3. 下载驱动文件：https://downloads.mysql.com/archives/get/p/3/file/mysql-connector-j-9.5.0.zip
