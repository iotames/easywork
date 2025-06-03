## Kettle下载与编译

- Maven, version 3+
- Java JDK 11
- 设置配置文件 [settings.xml](https://raw.githubusercontent.com/pentaho/maven-parent-poms/master/maven-support-files/settings.xml) 放在 `~/.m2` 目录。保证能访问私有仓库


- 下载代码

```bash
# 如果网络不好。可以用国内镜像：
# git clone https://gitee.com/mirrors/Kettle.git
git clone https://github.com/pentaho/pentaho-kettle.git
cd pentaho-kettle

# mvn clean install -Dmaven.test.skip=true -U
mvn clean package
```

可能会因为依赖问题报错：
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

如果缺少依赖，可以用国内镜像先安装依赖。
```
git clone https://gitee.com/mirrors_pentaho/maven-parent-poms.git
cd maven-parent-poms
mvn clean install -U
```

- 如果还是提示缺少依赖，可以继续在此镜像地址上查找：[https://gitee.com/mirrors_pentaho](https://gitee.com/mirrors_pentaho)


- Maven配置https代理

```
# 未验证。
export MAVEN_OPTS="-DsocksProxyHost=127.0.0.1 -DsocksProxyPort=1080"
```

或者在settings.xml里面配置（已验证可用）：

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

```

-----------

https://blog.csdn.net/m0_38139250/article/details/121903392
