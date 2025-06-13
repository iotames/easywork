## 相关资源总览

- 官网下载: https://www.oracle.com/java/technologies/downloads/archive/
- JDK8华为云下载：https://repo.huaweicloud.com/java/jdk/8u202-b08/
- JDK17下载：https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- JDK19下载：https://www.oracle.com/java/technologies/javase/jdk19-archive-downloads.html
- Java教程： https://dev.java/learn/
- Getting Started with Java：https://dev.java/learn/getting-started/
- 下载Maven：https://maven.apache.org/download.cgi
- 安装Maven：https://maven.apache.org/install.html

`推荐安装JDK8`, 主流是JAVA8, 不要安装最新的 `JDK17`, `JDK19`(2022-9-30)


## JDK和JRE

- JDK：Java Development Kit
- JRE：Java Runtime Environment

JRE是运行Java字节码的虚拟机。但要从Java源码，编译成Java字节码，就需要JDK。
因此，JDK除了包含JRE，还提供了`编译器`、`调试器`等开发工具。


## 安装JDK

安装JDK后，设置`三个系统环境变量`:

注：最新的官方教程，没把 `CLASSPATH` 变量设置为必须。1.5后不用再设置classpath，但建议继续设置以保证后兼容。

1. `JAVA_HOME`: JDK的安装目录。
2. `PATH`: 把`JAVA_HOME`的`bin`目录, (还有JRE的bin目录)添加到`系统环境变量` `PATH上`。
3. `CLASSPATH`: JDK的lib下的`tools.jar` 和 `dt.jar`，连同当前路径`.`，加入`CLASSPATH`环境变量。

```
export CLASSPATH=.:$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar   // for Linux
.;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;   // for Windows
```

- `java8`: java -version
- `java9+`: java --version

### FOR LINUX

```
wget -c https://repo.huaweicloud.com/java/jdk/8u202-b08/jdk-8u202-linux-x64.tar.gz
tar xzf jdk-8u202-linux-x64.tar.gz
sudo mv jdk1.8.0_202 /usr/local/
vi  /etc/profile

...
export JAVA_HOME=/usr/local/jdk1.8.0_202
export PATH=$PATH:$JAVA_HOME/bin
export CLASSPATH=.:$JAVA_HOME/lib

source /etc/profile
```

### FOR Windows

一定要设置为`系统变量`，而不是用户变量，否则无效。

1. 变量名：`JAVA_HOME`, 变量值：为你的JDK安装的路径(例: D:\Java\jdk1.8.0_202)
2. 变量名 ：`CLASSPATH`, 变量值：`.;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;` （前面有个点）
3. `PATH`环境变量。新增: `%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin`
4. 验证: `java -version`, `javac -version`


## Maven项目构建工具

Maven 是 Java 的项目管理工具，可以对 Java 项目进行自动化的构建和依赖管理。

```
# 解压后，添加 bin 目录到 PATH 环境变量中，即可完成安装。
wget -c https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz
```

### 项目构建命令

1. `mvn clean`: 清理项目，删除 `target` 目录下的编译输出内容。
2. `mvn compile`: 编译项目源代码。
3. `mvn test`: 运行项目测试
4. `mvn package`: 打包项目到 `target` 目录下。包括: `jar`, `war`, `class` 文件。
5. `mvn install`: 在前面打包项目完成后，复制一份打包成果，到 `本地仓库`。默认是： `~/.m2/repository`。
6. `mvn deploy`: 将项目打包并部署到远程Maven仓库，适用于发布发布版本。

### 常见命令组合

- `mvn clean package`: 按顺序执行 `clean` -> `complie` -> `test` -> `package` 三个阶段
- `mvn clean install`: 在 `mvn clean package` 基础上，新增 `install` 阶段
- `mvn clean deploy`: 在 `mvn clean install` 基础上，新增 `deploy` 阶段

注：先执行 `clean`，确保每次构建都是全新的，避免因残留文件导致的问题。
