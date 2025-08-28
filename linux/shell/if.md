## 判断一个变量是否有值

变量判断：

- `-n`: 英文缩写：`not empty`。检查字符串是否 `非空`。示例： `if [ -n "$VAR" ]; then` 表示如果 $VAR 非空，则执行后续操作。
- `-z`:  英文缩写：`zero length`。检查字符串是否 `为空`。示例： `if [ -z "$VAR" ]; then` 表示如果 $VAR 为空，则执行后续操作。

```bash
# 判断 WEB_PORT 是否为空。为空则赋予默认值。
if [ -z "${WEB_PORT}" ]; then
    echo "WEB_PORT 为空"
    WEB_PORT=8069
fi

# -n 判断一个变量是否有值
if [ ! -n "$var" ]; then
  echo "$var is empty"
  exit 0
fi
```

## 判断两个变量是否相等

```bash
# 判断两个变量是否相等
if [ "$var1" = "$var2" ]; then
  echo '$var1 eq $var2'
else
  echo '$var1 not eq $var2'
fi

# 判断第一个参数的值
if [ "$1" = "update" ]; then
    echo "----ARG1--IS--update......"
    exit 0
fi
```

## 判断两个变量是否不相等

```bash
# 示例变量
my_var="hello"

# 方法1: 使用 != 运算符
if [ "$my_var" != "world" ]; then
    echo "my_var 不等于 'world'"
else
    echo "my_var 等于 'world'"
fi

# 处理大小写不同的情况
if [ "${my_var,,}" != "HELLO" ]; then
    echo "my_var(忽略大小写) 不等于 'HELLO'"
else
    echo "my_var(忽略大小写) 等于 'HELLO'"
fi

# 数字比较示例
num_var=10
if [ "$num_var" -ne 5 ]; then
    echo "$num_var 不等于 5"
fi
```

## 文件路径判断

```
-d filename 如果 filename为目录，则为真 
-f filename 如果 filename为常规文件，则为真
-e filename 如果 filename存在，则为真 
-L filename 如果 filename为符号链接，则为真 
-r filename 如果 filename可读，则为真 
-w filename 如果 filename可写，则为真 
-x filename 如果 filename可执行，则为真 
-s filename 如果文件长度不为0，则为真 
-h filename 如果文件是软链接，则为真
```


### 判断文件夹是否存在

```bash
# 检查是否存在.git目录
if [ -d "${ODOO_ADDONS}/.git" ]; then
    echo "------检测到${ODOO_ADDONS}目录存在.git"
else
    echo "------${ODOO_ADDONS}目录下不存在.git目录，跳过..."
fi
```

### 判断文件是否存在

```bash
# 如果存在 .env 文件，从中读取环境变量
# https://stackoverflow.com/questions/19331497/set-environment-variables-from-file-of-key-value-pairs
if [ -f .env ]; then
    echo "发现.env文件，加载环境变量......"
    export $(cat .env | sed 's/#.*//g' | xargs)
fi
```

----------

> Shell中判断文件,目录是否存在 https://www.cnblogs.com/DreamDrive/p/7706585.html