## logrotate介绍

Logrotate 是 Linux 系统中用于自动化管理日志文件的工具，能够高效、安全地轮转、压缩、清理日志文件，防止磁盘空间被耗尽，同时保留必要的历史日志以便问题排查。

## 安装

```bash
apt install logrotate
```

## 配置

- rotate N 保留指定数量的历史日志（如 rotate 7 保留最近7份）。
- maxage 删除超过天数的旧日志（如 maxage 30 删除30天前的文件）。
- dateext：在日志名中添加日期后缀（如 app.log-20250508.gz），便于按时间归档。
- olddir：将旧日志移动到指定目录（如 olddir /var/log/archive）。
- weekly：按周进行轮转。优先级低于 size（如同时配置时，达到大小立即触发）。可用值：daily/weekly/monthly
- size N 配置文件达到指定大小时触发轮转（如 `size 100M`）。
- notifempty：空日志文件不轮转。


### 全局主配置文件

路径：`/etc/logrotate.conf`，定义全局默认参数（如 compress、weekly）。

```conf
# see "man logrotate" for details

# global options do not affect preceding include directives

# rotate log files weekly
weekly

# keep 4 weeks worth of backlogs
rotate 4

# create new (empty) log files after rotating old ones
create

# use date as a suffix of the rotated file
#dateext

# uncomment this if you want your log files compressed
#compress

# packages drop log rotation information into this directory
include /etc/logrotate.d

# system-specific logs may also be configured here.
```

### 子配置文件

路径：`/etc/logrotate.d/` 目录下的文件（如 `nginx`、`mysql`、`odoo`），针对特定服务覆盖全局设置。


在 `/etc/logrotate.d/`下创建配置文件（如odoo）：

`/etc/logrotate.d/odoo`:

```conf
# /etc/logrotate.d/odoo文件
# /var/log/odoo/*.log {
/var/log/odoo/odoo.log {
    daily          # 按天轮转
    missingok      # 日志不存在时不报错
    rotate 30      # 保留30天的日志
    compress       # 压缩旧日志
    delaycompress  # 延迟压缩（下次轮转时压缩）
    notifempty     # 空日志不轮转
    create 640 odoo odoo  # 创建新日志文件（权限、用户、组）
    sharedscripts  # 脚本只执行一次
    postrotate
        # 向Odoo主进程发送USR1信号，通知其重新打开日志文件
        # kill -USR1 $(cat /var/run/odoo/odoo.pid 2>/dev/null) 2>/dev/null || true
        docker kill -s USR1 odoo_container_name

        # 向Promtail发送HUP信号，通知其重新加载配置文件
        docker kill -s HUP promtail_container_name
    endscript
}
```

`odoo.conf`:

```ini
logfile = /var/log/odoo/odoo.log
# Odoo默认可能不生成PID文件。添加pidfile
pidfile = /var/run/odoo/odoo.pid
```


配置参数可以抽离公共部分：

`/etc/logrotate.d/odoo`:

```conf
# 全局配置
daily
missingok
rotate 30
compress
delaycompress
notifempty
sharedscripts
su myname crontab
create 0660 sshd crontab
# 组名crontab已存在，无需修改
copytruncate
# 确保容器日志安全轮转
/home/myname/erp/odoo/log/odoo.log {
    postrotate
        docker kill -s USR1 odooweb      # 通知Odoo重载日志
        docker kill -s HUP promtail       # 通知Promtail重载配置
    endscript
}
# 测试环境日志
/home/myname/erp.test/odoo/log/odoo.log {
    postrotate
        docker kill -s USR1 odoowebtest  # 通知测试环境
        docker kill -s HUP promtail       # 通知Promtail
    endscript
}
```

1. 日志所属目录 `不能` 为 `777`，可设置为 `770` 。否则 logrotate 会拒绝操作，提示：`权限不够`
2. 注释 `不要` 加在每行配置项后面。如：`create 0640 appuser appgroup # 注释`。否则会报错，参数过多。
3. su 配置指令，要确保能正常执行。把能运行的用户，加入用户组：`sudo usermod -aG crontab myname`


## 使用

### 自动运行cron定时任务

通过 `cron` 任务每日执行（路径：`/etc/cron.daily/logrotate`）

### 手动执行

```bash
# 调试模式：显示计划，不实际修改文件
sudo logrotate -d /etc/logrotate.d/odoo

# 强制立即执行
sudo logrotate -f /etc/logrotate.d/odoo
```