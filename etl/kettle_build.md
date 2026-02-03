## 从源码编译

1. Maven, version 3+
2. Java JDK 11
3. 设置配置文件 [settings.xml](https://raw.githubusercontent.com/pentaho/maven-parent-poms/master/maven-support-files/settings.xml) 放在 `~/.m2` 目录。保证能访问私有仓库
4. 不推荐安装最新版本。使用git tag和git checkout 命令切换到指定版本。

- 下载代码

```bash
# 用国内镜像
git clone https://gitee.com/mirrors/Kettle.git
cd Kettle && git checkout 10.2.0.4-342
mvn clean install -Dmaven.test.skip=true -U

# 官方编译方式可能有网络问题，或依赖问题
# git clone https://github.com/pentaho/pentaho-kettle.git
# cd pentaho-kettle && mvn clean package
```

可能会发生依赖问题错误：
```bash
mvn clean package -U
[INFO] Scanning for projects...
Downloading from pentaho-public: https://repo.orl.eng.hitachivantara.com/artifactory/pnt-mvn/org/pentaho/pentaho-ce-jar-parent-pom/10.3.0.0-SNAPSHOT/maven-metadata.xml
Downloading from pentaho-public: https://repo.orl.eng.hitachivantara.com/artifactory/pnt-mvn/org/pentaho/pentaho-ce-jar-parent-pom/10.3.0.0-SNAPSHOT/pentaho-ce-jar-parent-pom-10.3.0.0-SNAPSHOT.pom
[ERROR] [ERROR] Some problems were encountered while processing the POMs:
[FATAL] Non-resolvable parent POM for org.pentaho.di:pdi:10.3.0.0-SNAPSHOT: The following artifacts could not be resolved: org.pentaho:pentaho-ce-jar-parent-pom:pom:10.3.0.0-SNAPSHOT (absent): Could not find artifact org.pentaho:pentaho-ce-jar-parent-pom:pom:10.3.0.0-SNAPSHOT in pentaho-public (https://repo.orl.eng.hitachivantara.com/artifactory/pnt-mvn/) and 'parent.relativePath' points at wrong local POM @ line 16, column 11
 @
[ERROR] The build could not read 1 project -> [Help 1]
[ERROR]
[ERROR]   The project org.pentaho.di:pdi:10.3.0.0-SNAPSHOT (C:\projects\Java\kettle\pom.xml) has 1 error
[ERROR]     Non-resolvable parent POM for org.pentaho.di:pdi:10.3.0.0-SNAPSHOT: The following artifacts could not be resolved: org.pentaho:pentaho-ce-jar-parent-pom:pom:10.3.0.0-SNAPSHOT (absent): Could not find artifact org.pentaho:pentaho-ce-jar-parent-pom:pom:10.3.0.0-SNAPSHOT in pentaho-public (https://repo.orl.eng.hitachivantara.com/artifactory/pnt-mvn/) and 'parent.relativePath' points at wrong local POM @ line 16, column 11 -> [Help 2]
```

在 `~/.m2/settings.xml` 中：

1. 配置 `https` 代理: 经测试http和socks代理都无效，可能因为mvn使用的https下载依赖。
2. 添加 `jdk-11` 的 `profile` 配置。


```xml
  <proxies>
    <proxy>
      <id>optional</id>
      <active>true</active>
      <protocol>https</protocol>
      <username></username>
      <password></password>
      <host>127.0.0.1</host>
      <port>7890</port>
      <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
    </proxy>

  </proxies>

<profiles>
  <profile>
    <id>jdk-11</id>
    <activation>
      <activeByDefault>true</activeByDefault>
    </activation>
    <properties>
      <maven.compiler.source>11</maven.compiler.source>
      <maven.compiler.target>11</maven.compiler.target>
    </properties>
  </profile>
</profiles>

```

- Maven配置https代理

```bash
# 未验证。
export MAVEN_OPTS="-DsocksProxyHost=127.0.0.1 -DsocksProxyPort=1080"
```

如缺少依赖，可找到对应依赖的国内镜像，从源码手动安装。
```bash
git clone https://gitee.com/mirrors_pentaho/maven-parent-poms.git
cd maven-parent-poms && mvn clean install -U
```

- 如果还是提示缺少依赖，可以继续在此镜像地址上查找：[https://gitee.com/mirrors_pentaho](https://gitee.com/mirrors_pentaho)

```bash
# 如果已有metastore.jar文件，可以手动安装
# mvn install:install-file -Dfile=metastore.jar -DgroupId=pentaho -DartifactId=metastore -Dversion=10.3.0.0-SNAPSHOT -Dpackaging=jar
```

-----------

https://blog.csdn.net/m0_38139250/article/details/121903392
