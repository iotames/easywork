## 介绍

Nexus Repository Manager（简称 Nexus）是由 Sonatype 公司开发的一款企业级仓库管理工具，主要用于搭建和管理 Maven 私有仓库。

onatype Nexus 3 这个功能强大的产品，它不仅能够用于创建 Maven 私服，还可以用来创建 yum、pypi、npm、nuget、rubygems 等各种私有仓库。而且，Nexus 从 3.0 版本也开始支持创建 Docker 镜像仓库了！

官方文档：https://help.sonatype.com/en/maven-repositories.html


## 核心功能

1. 代理仓库（Proxy Repository）：缓存远程公共仓库（如 Maven Central）的依赖，加速本地构建并减少外网请求。
2. 宿主仓库（Hosted Repository）：存储企业内部的私有构件（如公司内部开发的 Jar 包）。
3. 仓库组（Repository Group）：将多个仓库聚合为一个统一入口（例如合并 Maven Central 和私有仓库的访问地址）。


## 容器安装方式

- 官方容器镜像仓库：https://hub.docker.com/r/sonatype/nexus3
- Nexus3最佳实践-搭建Docker私有仓库：https://cloud.tencent.com/developer/article/1352350

```bash
docker pull sonatype/nexus3:3.85.0
```

启动脚本：

```bash
#!/bin/bash

docker run -d --restart always --name nexus \
-p 5800:8081 \
-v /some/dir/nexus-data:/nexus-data \
sonatype/nexus3:3.85.0
#-e HTTP_PROXY="socks5://192.168.2.71:7890" \
#-e HTTPS_PROXY="socks5://192.168.2.71:7890" \
```

1. Nexus 安装在 /opt/sonatype/nexus 目录下。
2. 持久化目录 /nexus-data 用于存放配置、日志和存储数据。该目录必须对 Nexus 进程（以 UID 200 运行）具有可写权限。
3. 默认用户是 admin，唯一生成的密码可以在卷内的 admin.password 文件中找到
4. INSTALL4J_ADD_VM_PARAMS 环境变量，用于向启动脚本传递 JVM 参数。

```bash
# INSTALL4J_ADD_VM_PARAMS 环境变量用于将 JVM 参数传递给启动脚本
# 默认为 -Xms2703m -Xmx2703m -XX:MaxDirectMemorySize=2703m -Djava.util.prefs.userRoot=${NEXUS_DATA}/javaprefs
# -Djava.util.prefs.userRoot=/some-other-dir 可以设置为持久路径，如果容器重新启动，它将保留已安装的 Sonatype Nexus 存储库许可证。
docker run -d -p 8081:8081 --name nexus -e INSTALL4J_ADD_VM_PARAMS="-Xms2703m -Xmx2703m -XX:MaxDirectMemorySize=2703m -Djava.util.prefs.userRoot=/some-other-dir" sonatype/nexus3
```

其他启动参数：

```bash
#!/bin/bash
docker run -dti \
        --net=host \
        --name=nexus \
        --privileged=true \
        --restart=always \
        --ulimit nofile=655350 \
        --ulimit memlock=-1 \
        --memory=16G \
        --memory-swap=-1 \
        --cpuset-cpus='1-7' \
        -e INSTALL4J_ADD_VM_PARAMS="-Xms4g -Xmx4g -XX:MaxDirectMemorySize=8g" \
        -v /etc/localtime:/etc/localtime \
        -v /data/nexus:/nexus-data \
        sonatype/nexus3:3.85.0
```

## 常规安装方式

### 硬件环境

最低配置:
1. CPU：1 核（适用于小型团队或测试环境）。
2. 内存：2 GB（若运行其他服务需适当增加）。
3. 磁盘空间：至少 10 GB（根据依赖库数量动态扩展）。

推荐配置：
1. CPU：2 核或以上（支持高并发请求）。
2. 内存：4 GB 或以上（避免频繁 GC 影响性能）。
3. 磁盘空间：50 GB 以上（适用于企业级仓库，需预留增长空间）。

### 软件环境

1. JDK 8 或更高版本，需要 `JAVA_HOME` 环境变量。
2. Nexus Repository 默认使用嵌入式数据库，但生产环境建议配置 PostgreSQL 或 MySQL。

### 安装和配置

- 推荐下载 Nexus Repository Manager OSS，即开源免费版本: https://www.sonatype.com/products/repository-oss-download

```bash
tar -xzvf nexus-3.x.x-unix.tar.gz -C /opt
cd /opt/nexus/bin

# 前台运行
./nexus run

# 后台服务模式
./nexus start
```

添加为systemd系统服务：`nexus.service`:

```conf
ExecStart=/opt/nexus/bin/nexus start
ExecStop=/opt/nexus/bin/nexus stop
```

日志：

```bash
# 查看启动日志
tail -f /opt/nexus/log/nexus.log
```

1. 端口冲突：若端口 8081 被占用，修改 etc/nexus-default.properties 中的 application-port 属性。
2. 内存不足：编辑 bin/nexus.vmoptions 调整 JVM 参数（如 -Xms512m -Xmx1024m）
3. 权限问题：确保 Nexus 用户对 `sonatype-work` 目录有读写权限


## 登录访问

默认端口为 `8081`，打开浏览器访问：http://localhost:8081

默认管理员账号：`admin`
初始密码：在 `sonatype-work/nexus3/admin.password` 文件中查找。

### 仓库类型

1. Hosted Repository（存储私有 Jar 包）
2. Proxy Repository（代理 Maven Central）
3. Repository Group（聚合仓库，包含以上2种类型的多个仓库，可以调整优先级）

`/#admin/repository/repositories` 路径下已存在的​​maven仓库有4个：

1. ​​maven-public​​ (group)：只读，用于客户端下载依赖（聚合了central、releases、snapshots）
​​2. maven-releases​​ (hosted)：可写，用于部署正式版本
​​3. maven-snapshots​​ (hosted)：可写，用于部署快照版本
​​4. maven-central​​ (proxy)：只读，代理Maven中央仓库

创建仓库：
1. 进入 Repository → Repositories → Create repository。
2. 选择类型为 maven2 (group)。
3. 填写名称（如 maven-public）和存储空间（Blob Store）。
4. 在 Group 选项卡中，从左侧可用仓库列表中选择需要聚合的仓库（如 maven-releases、maven-snapshots、maven-central），添加到右侧的成员列表。
5. 通过上下箭头调整仓库顺序（顺序影响依赖查找优先级）。

定期备份仓库数据和配置文件（如 sonatype-work 目录）。
