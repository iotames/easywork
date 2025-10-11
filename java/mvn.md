## Maven官方资源

- 下载：[https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)
- 安装：[https://maven.apache.org/install.html](https://maven.apache.org/install.html)
- 使用：[https://maven.apache.org/run.html](https://maven.apache.org/run.html)


## 安装Maven

Maven 是 Java 的项目管理工具，可以对 Java 项目进行自动化的构建和依赖管理。

```
wget -c https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz
```

解压后，添加 `bin` 目录到 `PATH` 环境变量中，即可完成安装。


## 基础命令

### 项目构建命令

1. `mvn clean`: 清理项目，删除 `target` 目录下的编译输出内容。
2. `mvn compile`: 编译项目源代码。
3. `mvn test`: 运行项目测试
4. `mvn package`: 打包项目到 `target` 目录下。包括: `jar`, `war`, `class` 文件。
5. `mvn install`: 在前面打包项目完成后，复制一份打包成果，到 `本地仓库`。默认是： `~/.m2/repository`。这样该项目包，就可以用作其他本地项目的依赖。
6. `mvn deploy`: 将项目打包并部署到远程Maven仓库，适用于发布发布版本。

### 依赖管理命令

- ​mvn dependency:list
- mvn dependency:tree​
- mvn dependency:get
- mvn dependency:purge-local-repository: 清空本地仓库中的所有依赖。会清空本地仓库的所有内容，强制重新从远程仓库下载依赖，并将它们安装到本地仓库。建议在使用之前备份本地仓库的重要内容。


## 常见命令组合

- `mvn clean package`: 按顺序执行 `clean` -> `complie` -> `test` -> `package` 三个阶段
- `mvn clean install`: 在 `mvn clean package` 基础上，新增 `install` 阶段
- `mvn clean deploy`: 在 `mvn clean install` 基础上，新增 `deploy` 阶段

注：先执行 `clean`，确保每次构建都是全新的，避免因残留文件导致的问题。


## 常用参数

1. `-Dmaven.test.skip=true`: 跳过测试代码的编译和运行。
2. `-DskipTests`: 测试代码正常编译，只跳过测试的运行。
3. `-D` 和 `-P` 参数： -D 表示 Properties 属性，而 -P 表示 Profiles 配置文件。
4. `-D开头`：-D 表示设置 properties 属性，使用命令行设置属性 -D 模板。
5. `-P开头`：-P后面紧接着 `profiles` 下某个 `profile` 的 `id`。
6. `-U` 或 `--update-snapshots`: 强制更新。即使本地仓库已经存在相应版本的依赖项，也会从远程仓库下载最新的版本。

注：使用 `-P` 参数激活特定 `profile`，管理多环境构建。

示例：

```
mvn package -Dmaven.test.skip=true
mvn clean package -Dmaven.test.skip=true

mvn clean install -Pdev
mvn clean install -Pprod
mvn clean install -Pdev,test

# 强制刷新依赖
# mvn dependency:purge-local-repository
mvn clean install -U -Dmaven.test.skip=true
```

## Maven配置

- `全局配置`： 在 `Maven安装目录` 下的 `conf/settings.xml` 文件，是全局的配置文件。
- `局部配置`：新建或编辑 `用户目录` 的 `.m2/settings.xml` 文件，会覆盖全局配置。更改后实时生效，不用重启命令窗口。


## Maven仓库

1. 本地仓库：从远程仓库下载时，会先存在本地仓库，以便下次直接从本地获取，加快构建速度。默认在用户目录下的 `.m2/repository` 文件夹。
2. 中央仓库：由 Maven 社区维护的公共仓库，地址是 https://repo.maven.apache.org/maven2/。
3. 私有仓库和第三方仓库：包含企业私有仓库，特定的开源项目仓库，商业仓库。要配置仓库地址才能使用。


### 本地仓库设置

```
<settings>
    <!-- 自定义本地仓库地址 -->
    <localRepository>D:/maven/repo</localRepository>
    <!-- 其他配置 -->
</settings>
```

### 镜像仓库设置

国内访问中央仓库可能较慢，可以在 `<mirrors></mirrors>` 标签中添加 `mirror` 子节点，配置镜像仓库。将所有请求重定向到指定仓库（如阿里云镜像）：

```xml
<!-- settings.xml 示例 -->
<mirror>
  <id>aliyun</id>
  <mirrorOf>central</mirrorOf>
  <name>阿里云公共仓库</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

其他镜像地址：

- 华为云：https://repo.huaweicloud.com/repository/maven/
- 清华大学：https://repo.maven.apache.org/maven2/
- 中科院：http://maven.opencas.cn/maven/

### 私有仓库设置

在用户家目录下 `.m2/settings.xml` 文件，配置私有仓库的账号密码：

```xml
<!-- settings.xml 示例 -->
<servers>
    <server>
        <id>my-private-repo</id>
        <username>admin</username>
        <password>password</password>
    </server>
</servers>
```

在项目源码的 `pom.xml` 中配置私有仓库：

```xml
<!-- pom.xml 示例 -->
<!-- 可把maven-releases替换成自己的路径。 -->
<!--如果使用Nexus搭建私有库，建议使用group类型的聚合仓库下载，而上传发布使用hostd类型仓库。 -->
<repositories>
    <repository>
        <id>my-private-repo</id>
        <url>http://your-repo-url/repository/maven-releases/</url>
        <!-- <releases><enabled>true</enabled></releases> -->
        <!-- <snapshots><enabled>true</enabled></snapshots> -->
    </repository>
</repositories>

<!-- 分发管理，在此配置要上传的私有仓库地址：可把maven-releases替换成自己的路径 -->
<distributionManagement>
    <repository>
        <id>my-private-repo</id>
        <url>http://your-repo-url/repository/maven-releases/</url>
    </repository>
</distributionManagement>
```

最后使用 `mvn deploy` 命令，将打包成果上传到私有仓库。

提示：​​配置 `SCM`（版本控制系统）​​：在 `pom.xml` 添加 `<scm>` 标签，配置 Git 仓库地址，这是插件自动打标签和提交的基础。保证后面 `mvn deploy` 生成的Jar包为 `releases` 而非 `snapshots`。


想把私有仓库配置成镜像仓库，覆盖所有对Maven Central 的请求。可如下设置：

```xml
<!-- settings.xml 示例 -->
<settings>
  <mirrors>
    <mirror>
      <id>my-company-repo</id>
      <name>Company Private Repository</name>
      <url>http://nexus.example.com/repository/maven-releases/</url>
      <mirrorOf>central</mirrorOf> <!-- 覆盖所有对 Maven Central 的请求 -->
    </mirror>
  </mirrors>
</settings>
```


## 第三方组件

如果我们要引用一个第三方组件，如 `gson`，如何确切地获得它的 `groupId`，`artifactId`，`version` ？方法是通过提供仓库搜索服务的网站搜索关键字，找到对应的组件后，直接复制相应的信息。

推荐的仓库搜索服务网站：

- https://search.maven.org/ `推荐`
- https://central.sonatype.com/

```
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.13.1</version>
</dependency>
```


## 搭建Nexus私有仓库

扩展阅读：
- nexus.md: [Nexus私有仓库](nexus.md)

Nexus 是 Sonatype 公司开发的流行仓库管理工具，支持 Maven、npm、Docker 等多种格式的私有仓库管理。

也可以通过 HTTP 服务器（如 Nginx、Apache）直接托管 Maven 依赖文件，无需专用工具。但不推荐。


## 注意事项

1. 依赖冲突：多个依赖引用了同一库的不同版本，可能会导致冲突。通过 `mvn dependency:tree` 查看依赖树。
2. 清理本地仓库: 本地仓库可能积累大量无用依赖，定期清理（如删除 ~/.m2/repository）可以节省空间。


----------

> Maven 常用命令详解 https://juejin.cn/post/7454109435877867539
> Maven使用教程 https://blog.csdn.net/weixin_48958956/article/details/147802899
> Maven基础 https://liaoxuefeng.com/books/java/maven/index.html
> Maven构建生命周期 https://blog.csdn.net/m0_62574889/article/details/130640329