#!/bin/bash

echo -e "\n\n========Begin_ETL_$(date '+%Y-%m-%d_%H:%M')=====\n"


# 设置JAVA环境变量
export JAVA_HOME=/home/uname/apps/jdk1.8.0_202
export PATH=$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar

# 设置KETTLE环境变量
KETTLE_APP_DIR=/home/uname/apps/data-integration
export PATH=$KETTLE_APP_DIR:$PATH
export KETTLE_SCRIPTS_DIR=/home/uname/apps/worknote/kettle

# 验证环境变量是否设置成功
java -version

echo "ls ${KETTLE_SCRIPTS_DIR}/smagar/"
ls ${KETTLE_SCRIPTS_DIR}/smagar/

# 更新kettle脚本
git --git-dir=/home/uname/apps/worknote/.git --work-tree=/home/uname/apps/worknote pull

# 1. 用户HOME目录的 .kettle 文件夹存放配置文件：kettle.properties  repositories.xml 
# 2. MySQL驱动：进入：https://downloads.mysql.com/archives/c-j/ -> `Operating System:` 下拉框选择：`Platform Independent` ->  选择 `Platform Independent (Architecture Independent), ZIP Archive` 下载
# 例： 下载 https://cdn.mysql.com/archives/mysql-connector-java-9.2/mysql-connector-j-9.2.0.zip 然后解压缩，复制文件 `mysql-connector-j-9.2.0.jar` 到 Kettle 的 `lib` 目录下。然后重启 Kettle。

# kitchen.sh -file=/jobs/sync.kjb -retry=3 -retrydelay=60 -level=Basic

# 执行kettle脚本

# 执行kettle转换
pan.sh -file=${KETTLE_SCRIPTS_DIR}/smagar/update_smagar_token.ktr -level=Debug >> logs/kettle.log 2>&1

# 执行kettle作业
# 1. 配置 资源库文件： `~/.kettle/repositories.xml`
# 2. 使用 -rep 参数指定资源库名称，-file 参数指定作业文件
kitchen.sh -rep=YourRepository -file=/jobs/sync.kjb -retry=3 -retrydelay=60 -level=Basic -logfile=logs/kettle.log
