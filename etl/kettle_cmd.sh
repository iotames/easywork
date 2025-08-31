#!/bin/bash

echo -e "\n\n========BeginUpdateDataOdoo14ERPtoMES_$(date '+%Y-%m-%d_%H:%M')=====\n"

# 设置JAVA环境变量
export JAVA_HOME=/home/santicbd/apps/jdk1.8.0_202
export PATH=$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar

# 设置KETTLE环境变量
KETTLE_APP_DIR=/home/santicbd/apps/data-integration
export PATH=$KETTLE_APP_DIR:$PATH
export KETTLE_SCRIPTS_DIR=/home/santicbd/apps/worknote/kettle

# 验证环境变量是否设置成功
java -version

echo "ls ${KETTLE_SCRIPTS_DIR}/smagar/"
ls ${KETTLE_SCRIPTS_DIR}/smagar/

# 更新kettle脚本
git --git-dir=/home/santicbd/apps/worknote/.git --work-tree=/home/santicbd/apps/worknote pull

# kitchen.sh -file=/jobs/sync.kjb -retry=3 -retrydelay=60 -level=Basic

# 执行kettle脚本
pan.sh -file=${KETTLE_SCRIPTS_DIR}/smagar/update_smagar_token.ktr -level=Debug >> logs/kettle.log 2>&1
