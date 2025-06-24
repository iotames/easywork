#!/bin/bash

export JAVA_HOME=/home/xxx/jdk1.8
export PATH=$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar

export DB_HOST=127.0.0.1
export DB_PORT=3306
export DB_NAME=yourdbname
export DB_USERNAME=root
export DB_PASSWORD=123456

# 强制刷新依赖 mvn clean install -U -Dmaven.test.skip=true
mvn clean install -Dmaven.test.skip=true

java -jar /path/xxx/target/yourapp.jar

nohup java -jar yourapp.jar --spring.config.additional-location=file:/etc/yourapp/application.prod.yml > yourapp.prod.log 2>&1 &
