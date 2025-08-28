## 安装Spug运维平台

```bash
docker compose up -d
```

docker-compose.yml文件：

```yaml
# version: "3.3"
services:
  db:
    image: registry.cn-hangzhou.aliyuncs.com/openspug/mariadb:10.8.2
    container_name: spug-db
    restart: always
    command: --port 3306 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    volumes:
      - ./data/spug/mysql:/var/lib/mysql
    environment:
      - MYSQL_DATABASE=spug
      - MYSQL_USER=spug
      - MYSQL_PASSWORD=spug.cc
      - MYSQL_ROOT_PASSWORD=spug.cc
  spug:
    image: registry.cn-hangzhou.aliyuncs.com/openspug/spug-service
    container_name: spug
    privileged: true
    restart: always
    volumes:
      - ./data/spug/service:/data/spug
      - ./data/spug/repos:/data/repos
    ports:
      # 如果80端口被占用可替换为其他端口，例如: - "8000:80"
      - "88:80"
    environment:
      - MYSQL_DATABASE=spug
      - MYSQL_USER=spug
      - MYSQL_PASSWORD=spug.cc
      - MYSQL_HOST=db
      - MYSQL_PORT=3306
    depends_on:
      - db
```

## 初始化账号密码

以下操作会创建一个用户名为 admin 密码为 spug.cc 的管理员账户，可自行替换管理员账户/密码。

```bash
docker exec spug init_spug admin spug.cc
```

## 配置批量执行命令模板

1. 批量执行 - 模板管理 - 新建 - 脚本语言选择`Shell`
2. 点击 `参数化` 旁边的 `添加参数`，添加参数两个参数。

- 参数名：`用户名`。变量名：`username`。参数类型：`文本框`。必填：`否`。默认值：`:`。提示信息：`输入冒号:表示查询所有用户，留空不查询`

- 参数名：`用户组`。变量名：`usergroup`。参数类型：`文本框`。必填：`否`。默认值：`:`。提示信息：`输入冒号:表示查询所有用户组，留空不查询`

3. `模板内容` 如下所示：

```bash
if [ -n "$_SPUG_username" ]; then
  echo "用户列表："
  cat /etc/passwd | grep "$_SPUG_username"
else
  echo "跳过用户查询"
fi

if [ "$_SPUG_usergroup" != "" ]; then
  echo "用户组列表："
  cat /etc/group | grep "$_SPUG_usergroup"
else
  echo "跳过用户组查询"
fi
```