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

### 其他命令模板

```bash
pwd
cd $_SPUG_path
echo "the path is:$_SPUG_path"
pwd
git pull
git status
git log --max-count=1
```

```bash
get_latest_commits() {
    n=${1:-1}
    # 验证参数是否为正整数
    if ! echo "$n" | grep -Eq '^[0-9]+$' || [ "$n" -eq 0 ]; then
        echo "错误：参数必须是正整数" >&2
        return 1
    fi

    # 获取最近n条提交的commitID
    git log --pretty=format:%H -n "$n" | awk -v line="$n" 'NR==line'
}
pwd
cd $_SPUG_gpath
pwd
if [ "$_SPUG_commit_index" = "0" ]; then
    echo "拉取最新代码：git pull"
    git pull
else
    echo "重置至第$_SPUG_commit_index条提交"
    echo "重置前："
    git log --max-count=1
    commitID=$(get_latest_commits $_SPUG_commit_index)
    git reset --hard $commitID
    echo "重置后："
    git log --max-count=1
fi
```