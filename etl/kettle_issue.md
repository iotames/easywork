## 编码错误

用kettle对mysql数据迁移到PostgreSQL时，执行到一半报错:
```
was aborted: ERROR: invalid byte sequence for encoding "UTF8": 0x00
```

mysql数据库字符集为 utf8mb4, PostgreSQL字符集为 UTF8， 本以为是不兼容的字符导致。
故编辑目标库的 `DB连接` -> `选项`, 设置命名参数 `characterEncoding` 值为 `uft8` 然而并无效果。

### 原因

invalid byte sequence for encoding "UTF8": 0x00（注意：若不是0x00则很可能是字符集设置有误），是PostgreSQL独有的错误信息，因为PostgreSQL内部采用C语言风格的字符串（以0x00）表示结尾，varchar型的字段或变量不接受含有'\0'（也即数值0x00、UTF编码'\u0000'）的字符串 。

### 解决方法

替换掉 `0x00` 字符:

```JAVA
str..replace("\u0000", "").replace("\\u0000", ""));
```

```SQL
SELECT replace(review_content, char(0), '') as 评论内容 [FROM reviews_table]
```

## 数据库驱动错误

```
Driver class 'org.gjt.mm.mysql.Driver' could not be found, make sure the 'MySQL' driver (jar file) is installed.
org.gjt.mm.mysql.Driver
```

缺少MySQL驱动。

### 解决方法

进入：https://downloads.mysql.com/archives/c-j/ -> 下拉框选择：`Platform Independent` ->  选择 `Platform Independent (Architecture Independent), ZIP Archive` 下载.

- 例： 下载 https://cdn.mysql.com/archives/mysql-connector-java-9.2/mysql-connector-j-9.2.0.zip 然后解压缩，复制文件 `mysql-connector-j-9.2.0.jar` 到 Kettle 的 `lib` 目录下。然后重启 Kettle。


