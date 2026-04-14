---
title: "PostgreSQL数据库"
order: 5
---
## 手动安装

### 下载源码包

```bash
cd /usr/local
wget -c  https://ftp.postgresql.org/pub/source/v16.3/postgresql-16.3.tar.gz
```

### 解压源码包

```bash
tar -zxvf postgresql-16.3.tar.gz && cd postgresql-16.3
```

### 安装依赖

根据自己需要的增加依赖，这里的依赖是根据下面的编译参数确定的。
如果ssh客户端不支持多行，需要合并成一行来运行

```bash
apt install  build-essential liblz4-dev lz4 pkg-config libreadline-dev zlib1g-dev libxml2-dev libxml2 libssh-dev uuid-dev libossp-uuid-dev
```

### 编译安装

编译参数，根据自己的需要添加

```bash
./configure --with-lz4 --with-openssl --with-libxml --with-ossp-uuid --enable-debug
```

```bash
make
make install
```

### 创建用户组和用户

```bash
groupadd postgres
useradd -g postgres postgres -m
```

注: 分组和用户必须都为  `postgres` , 否则容易出现错误:

```bash
psql: error: 连接到套接字"/var/run/postgresql/.s.PGSQL.5432"上的服务器失败:FATAL:  database "your_username" does not exist
```

### 创建数据目录

```bash
mkdir /var/pgsqldata
chmod -R 0700 /var/pgsqldata
# 可选。初始化数据库目录
# /usr/local/pgsql/bin/initdb -D /var/pgsqldata

chown postgres:postgres /var/pgsqldata
```

### 配置环境变量

编辑环境变量文件: `vi /etc/profile`

添加如下内容:

```conf
export PGHOME=/usr/local/pgsql
export PGDATA=/var/pgsqldata
PATH=$PATH:$PGHOME/bin
```

刷新环境变量

```bash
source /etc/profile
```

### 切换用户并初始化数据库

pgsql不允许用root初始化和登录，必须用创建的账号

```bash
su - postgres
initdb
```

测试启动和测试停止:
 
```bash
pg_ctl -D /var/pgsqldata -l logfile  start
pg_ctl -D /var/pgsqldata -l logfile stop
```

### 修改配置文件

```bash
vi /var/pgsqldata/postgresql.conf
```

```conf
# listen_addresses = 'localhost' 改为 listen_addresses = '*' 允许别的机器访问
listen_addresses = '*'

# 修改最大连接数（100太低了）
max_connections=1000
```
修改listen_addresses为listen_addresses = ‘*’，并取消前面的#号，允许别的机器访问

```bash
vi /var/pgsqldata/pg_hba.conf
```
在文件最下面添加 `host all all 0.0.0.0/0 md5`，允许外部密码登录

### 通过systemctl管理

```bash
vi /usr/lib/systemd/system/pgsql.service

# 内容如下
[Unit]
Description=postgresql

[Service]
Type=forking
Group=postgres
User=postgres
ExecStart=/usr/local/pgsql/bin/pg_ctl -D /var/pgsqldata start
ExecReload=/usr/local/pgsql/bin/pg_ctl -D /var/pgsqldata restart
ExecStop=/usr/local/pgsql/bin/pg_ctl -D /var/pgsqldata stop

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl start pgsql.service
systemctl enable pgsql.service
```

### 进入命令行并创建密码

```bash
# pgsql不允许用root初始化和登录，必须用创建的账号
su - postgres
psql
ALTER USER postgres WITH PASSWORD 'abc123456';
# 输入quit退出
```

pgsql数据库
账号：postgres
密码：上面设定的
本地访问是可以无密码的


## 分发包安装

```bash
apt install postgresql
```

### 文件和配置

这种方式安装后，会创建一个postgres用户，密码为空，并且此时postgreSQL只能本地访问。

- 应用的位置: `/usr/lib/postgresql/`
- 配置文件的位置: `/etc/postgresql/`
- 数据库文件位置：`/var/lib/postgresql/15/main`
- 可执行文件：`/bin/pg_ctlcluster`, `/usr/lib/postgresql/15/bin/postgres`, `/usr/lib/postgresql/15/bin/pg_ctl`

修改 `/etc/postgresql/14/main/pg_hba.conf`:

`host  all  all 127.0.0.1/32  scram-sha-256` 改为: 

```conf
# 也可以在文件末尾，直接添加此行配置
host  all  all 0.0.0.0/0  scram-sha-256
```

修改 `/etc/postgresql/14/main/postgresql.conf`: 

```conf
listen_addresses = '*'
```

### 修改密码

修改默认的postgres数据库密码:

```bash
su postgres
psql
\password postgres
```

或者:

```bash
# step1: 登录PostgreSQL：
sudo -u postgres psql

#step2: 修改登录PostgreSQL密码：
ALTER USER postgres WITH PASSWORD 'postgres';

step3: 退出PostgreSQL：
\q
```

重启服务:

```bash
systemctl stop postgresql
systemctl start postgresql
```

### systemd系统文件

添加自定义配置文件 `/lib/systemd/system/pgsql.service`:

```conf
[Unit]
Description=PostgreSQL Database Server
After=network.target

[Service]
Type=forking
# User=postgres
# Group=postgres
# 明确指定pg_ctl路径和数据目录路径
# ExecStart=/usr/lib/postgresql/15/bin/pg_ctl -D /var/lib/postgresql/15/main start
# ExecStop=/usr/lib/postgresql/15/bin/pg_ctl -D /var/lib/postgresql/15/main stop

ExecStart=/bin/pg_ctlcluster 15 main start
ExecStop=/bin/pg_ctlcluster 15 main stop
ExecReload=/bin/pg_ctlcluster 15 main reload

# 可选：重启策略
Restart=on-failure
RestartSec=10s

[Install]
WantedBy=multi-user.target
```

使用自定义系统命令：

```bash
systemctl daemon-reload
systemctl status pgsql
systemctl start pgsql
```


## 使用

超管postgres用户登录，执行SQL

```bash
# 创建用户
create user tzq with password '123456';
# 创建数据库
create database tzqdb owner tzq;
# 授权数据库给用户
grant all privileges on database tzqdb to tzq;
# 创建schema
create schema tzq authorization tzq;
```

## 常见问题

- 有多个socket导致无法直接登录

报错:
```bash
connection to server on socket “/var/run/postgresql/.s.PGSQL.5432” failed: No such file or directory
```
或
```bash
psql: error: 连接到套接字"/var/run/postgresql/.s.PGSQL.5432"上的服务器失败:没有那个文件或目录
        服务器是否在本地运行并接受该套接字上的连接?
```

解决:
```bash
# 查找所有的pgsql的socket
find / -name "*s.PGSQL.5432*"
psql -h /tmp/ postgres
```
或者在 `/var/pgsqldata/` 数据库目录中，更改 `postgresql.conf` 的 `unix_socket_directories` 配置项

----------

> PostgreSQL15 16 编译安装+问题解决+bash安装脚本 https://blog.csdn.net/ziqibit/article/details/129392672
> Debian安装PostgreSQL https://blog.csdn.net/itbs/article/details/127909359
> PostgreSql数据库-创建用户、数据库、schema https://blog.csdn.net/tttzzzqqq2018/article/details/132613396