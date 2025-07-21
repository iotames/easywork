## 环境准备

- 官方文档：https://docs.sonarsource.com/sonarqube/latest/

- `10.8` 版本推荐 `Java version 17`


### 系统参数调整

查看当前参数值：

```bash
sysctl vm.max_map_count
sysctl fs.file-max
ulimit -n
ulimit -u
```

修改参数值（root权限修改）：

```bash
sysctl -w vm.max_map_count=524288
sysctl -w fs.file-max=131072
ulimit -n 131072
ulimit -u 8192
```



## Postgres数据库准备

1. 启动Postgres容器

```bash
docker run -it --name postgres  --privileged \
-v /etc/localtime:/etc/localtime:ro \
-e POSTGRES_USER=postgresql \
-e POSTGRES_PASSWORD=Abcd1234 \
-e POSTGRES_DB=sonarqube \
-p 5432:5432 \
-v /data/postgres/postgresql:/var/lib/postgresql \
-e TZ=Asia/Shanghai \
--restart always \
-d postgres:17
```

2. 创建sonar用户和数据库

```bash
# 进入postgres数据库容器
docker exec -it postgres bash

# 切换到postgres用户
su postgres

# 进入postgres命令交互界面
psql

# 查看所有数据库账号
\du

# 创建新账号和数据库
create user sonar with password 'sonar' Superuser;
create database sonar owner sonar;

# 查看当前所有数据库
\l
```


## 启动SonarQube代码检测平台

```bash
# docker pull sonarqube:9.9-community
docker pull sonarqube:lts-community

mkdir -p /data/sonarqube/{data,extensions,logs,datasql,conf}
```

创建 `sonarstart.sh` 启动脚本：

```shell
#!/bin/bash

# 在当前Sell环境，使用.和source命令，从某个文件导出环境变量
# .命令是POSIX标准命令，兼容性更广
# 环境变量文件，使用相对路径，会找不到。env.sample: file not found
ENV_FILE=`pwd`/.env
echo $ENV_FILE
. $ENV_FILE

docker run -d --restart=always \
--name sonarqube \
--net host \
-p 9000:9000 \
-e SONAR_JDBC_URL=jdbc:postgresql://127.0.0.1:5432/sonar  \
-e SONAR_JDBC_USERNAME=sonar \
-e SONAR_JDBC_PASSWORD=sonar \
-v /data/sonarqube/data:/opt/sonarqube/data \
-v /data/sonarqube/extensions:/opt/sonarqube/extensions \
-v /data/sonarqube/logs:/opt/sonarqube/logs \
-v /data/sonarqube/datasql:/var/lib/postgresql/data \
-v /data/sonarqube/conf:/opt/sonarqube/conf \
sonarqube:lts-community || docker start sonarqube
```

登录直接访问http://[ip地址]:9000，首次进入，默认账号密码为 `admin/admin`


## 错误异常

如 `sonarqube` 容器启动报错：
```bash
ERROR: [1] bootstrap checks failed. You must address the points described in the following [1] lines before starting Elasticsearch.
bootstrap check failure [1] of [1]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
ERROR: Elasticsearch did not exit normally - check the logs at /opt/sonarqube/logs/sonarqube.log
```

这个错误是由于 Elasticsearch 在启动时进行了 bootstrap 检查，发现 `vm.max_map_count` 的值太低，无法正常启动。
编辑 `/etc/sysctl.conf` 文件：

```conf
# 在文件末尾添加以下行：
vm.max_map_count=262144
```

保存后，运行命令 `sudo sysctl -p` 使更改生效。


## 中文插件

在github上找对应的版本: https://github.com/xuhuisheng/sonar-l10n-zh/releases

```bash
#进容器下载中文插件
docker exec -it sonarqube bash
cd /opt/sonarqube/extensions/downloads

#中文插件
wget https://github.com/xuhuisheng/sonar-l10n-zh/releases/download/sonar-l10n-zh-plugin-9.9/sonar-l10n-zh-plugin-9.9.jar

#pmd规则
wget https://github.com/rhinoceros/sonar-p3c-pmd/releases/download/pmd-3.2.0-beta-with-p3c1.3.6-pmd6.10.0/sonar-pmd-plugin-3.2.0-SNAPSHOT.jar

# 重启sonar qube
docker restart sonarqube 
```

重启后再次打开页面，会提示插件风险，点击"我了解风险" 即可


## 手动测试

### 创建项目

1. 点击左上角菜单 `项目`，点击右上角 `新增项目` -> `手工`，填写：显示名，项目标识，主分支名

2. 保存项目后，在当前项目页下方，点击 `本地`，选择 `创建项目令牌`。 填写： 令牌名称，过期时间。点击旁边的 `创建` 按钮。

3. 分析项目：在 `使用什么构建技术？` 下方选择 `其他` 选项卡。在 `使用哪种操作系统？` 下方选择 `Linux` 选项卡

4. 按照指引，下载Linux平台的 `sonar scan` 扫描器，并执行扫描。


### 使用Docker容器调用sonar scan

- `-Dsonar.projectKey`=后面加上在sonar新建的项目名称
- `SONAR_LOGIN`=填写对应项目的令牌

```bash
docker run \
    --rm \
    -e SONAR_HOST_URL="http://[IP地址]:9000" \
    -e SONAR_SCANNER_OPTS="-Dsonar.projectKey=test" \
    -e SONAR_LOGIN="sqp_3bade8887e2812d2b204c840000000000" \
    -v "需要扫描的代码文件夹目录:/usr/src" \
    sonarsource/sonar-scanner-cli:latest
```

扫描完毕后，可以在web界面上查看到对应的扫描结果


## 执行代码检查

```bash
docker run --rm --net host \
-e SONAR_SCANNER_OPTS="-Dsonar.projectKey=yourcode -Dsonar.sources=/usr/src -Dsonar.host.url=http://127.0.0.1:9000 -Dsonar.login=sqp_311136f0b4ca84873ad17297745bdbee84a5919f" \
-v "/projects/yourcode:/usr/src" \
sonarsource/sonar-scanner-cli:11.1.1.1661_6.2.1
```

---------------

> docker SonarQube安装 https://blog.csdn.net/Sari_liu/article/details/140344316

> SonarQube 安装及使用 https://www.cnblogs.com/machangwei-8/p/18375840