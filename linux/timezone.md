## 时区环境变量

```bash
# 设置系统时区
export TZ=Asia/Shanghai

# 设置JVM时区
export JAVA_TOOL_OPTIONS="-Duser.timezone=Asia/Shanghai"

# 添加环境变量
tee -a /etc/environment << 'EOF'
TZ=Asia/Shanghai
JAVA_TOOL_OPTIONS="-Duser.timezone=Asia/Shanghai"
EOF
```

检查JVM时间:

```java
public class CheckTime {
    public static void main(String[] args) {
        System.out.println("JVM当前时间: " + new java.util.Date());
        System.out.println("JVM时区: " + java.util.TimeZone.getDefault().getID());
        System.out.println("JVM时区显示名称: " + java.util.TimeZone.getDefault().getDisplayName());
    }
}
```

```bash
# 编译Java 源代码文件
javac CheckTime.java

# 传入参数CheckTime类名而非文件名，运行编译后的字节码文件
java CheckTime
```

直接设置`TZ` 和 `JAVA_TOOL_OPTIONS`这两个环境变量可以临时解决问题，但建议采用 `/etc/environment` 方案，确保所有用户、所有会话、包括系统服务都能正确继承。
