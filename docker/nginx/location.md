
## location表达式

### 示例

1. 使用正则表达式，同时匹配多个前缀

- 该配置会匹配以 /admin-api/、/user-api/ 或 /payment-api/ 开头的请求（如 /admin-api/users、/payment-api/checkout）
- 高频核心路径（如 /admin-api）建议独立配置 location ^~ /admin-api，以提升性能

```
# 正则匹配。使用 ~ 或 ~* 修饰符定义正则表达式，通过 | 符号分隔多个前缀.
# 优先级低于优先前缀匹配：^~
location ~ ^/(admin-api|user-api|payment-api)/ {
    proxy_pass http://backend_server;
    proxy_set_header Host $host;
}
```

### 匹配规则和顺序

1. 精确匹配：`location = /abc/ {}`，`location = /docs/index.html {}`
2. 优先前缀匹配：`location ^~ /docs/ {}`
3. 正则匹配（`~`或`~*`）：例：`location ~ doc\.html$ {}`, `location ~ \.html$ {}`, `location ~ ^/(admin-api|user-api|payment-api)/ {}`。反斜杠`\`指出小数点不能转义，`$` 符号表示匹配字符串的结尾。
4. 普通前缀匹配（默认规则）：匹配大小写敏感的前缀。`location /index/ {}`，`location /api {}`
5. 通用匹配：`location / {}`

- 优先级顺序：`精确匹配` > `优先前缀匹配` > `正则匹配` > `普通前缀匹配` > `通用匹配`

```shell
# 精确匹配：=
location = /abc/ {}
#http://abc.com/abc [匹配成功]
#http://abc.com/abc/index [匹配失败]

# 优先前缀匹配，忽略后缀：^~
location ^~ /abc.html {}
#http://abc.com/abc.html [匹配成功]
#http://abc.com/abc.html/cba.html [匹配成功]
#http://abc.com/abc.htm [匹配失败]

# 正则匹配，区分大小写：~
location ~ /Abc/ {}
#http://abc.com/Abc/ [匹配成功]
#http://abc.com/abc/ [匹配失败]

# 正则匹配，不区分大小写：~*
location ~* /Abc/ {}
#http://abc.com/Abc/ [匹配成功]
#http://abc.com/abc/ [匹配成功]

# 不加任何规则，默认为大小写敏感的前缀匹配
location /index/ {}
#http://abc.com/index  [匹配成功]
#http://abc.com/index/index.page  [匹配成功]
#http://abc.com/test/index  [匹配失败]
#http://abc.com/Index  [匹配失败]
```

### 总结

|匹配类型   |  语法示例 |优先级| 特点与适用场景|
|:---------|:----------|:----|:-------------|
|精确匹配 | location = /path | 最高 | 仅匹配完全相同的 URI（如 /doc.html），匹配后立即终止搜索 |
|优先前缀匹配 | location ^~ /prefix | 次高 | 匹配以指定字符串开头的 URI（如 /admin-api），匹配后跳过正则检查 |
|正则匹配 | location ~ \.html$ | 中 | 区分大小写的正则匹配（~* 不区分大小写），按配置文件中的顺序匹配，首个匹配生效即停止 |
|普通前缀匹配 | location /prefix | 低 |无修饰符的前缀匹配（如 location /static），在正则匹配后执行，按最长前缀原则匹配 |
|通用匹配 | location / | 最低 | 匹配所有未匹配的请求，相当于默认路由 |
