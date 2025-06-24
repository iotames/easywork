set JAVA_HOME=C:\App\jdk-17.0.12
set PATH=%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;%PATH%
set CLASSPATH=.;%JAVA_HOME%\lib\tools.jar;%JAVA_HOME%\lib\dt.jar

export DB_HOST=127.0.0.1
export DB_PORT=3306
export DB_NAME=yourdbname
export DB_USERNAME=root
export DB_PASSWORD=123456

# 强制刷新依赖 mvn clean install -U -Dmaven.test.skip=true
mvn clean install -Dmaven.test.skip=true

java -jar yourapp.jar
