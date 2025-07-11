## 安装

```bash
apt install logrotate
```

## 配置

`odoo.conf`:

```ini
logfile = /var/log/odoo/odoo.log
# Odoo默认可能不生成PID文件。添加pidfile
pidfile = /var/run/odoo/odoo.pid
```

在 `/etc/logrotate.d/`下创建配置文件（如odoo）：

```bash
vim /etc/logrotate.d/odoo
```

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

配置参数可以抽离公共部分：

`/etc/logrotate.d/odoo`:

```conf
# 全局配置（无空行分隔！）
daily
missingok
rotate 30
compress
delaycompress
notifempty
sharedscripts
su myname crontab
create 0640 sshd crontab
# 组名crontab已存在，无需修改
copytruncate
# 确保容器日志安全轮转
# 生产环境日志（紧跟全局配置，无空行）
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
2. 注释不要加在每行配置项后面，如：`create 0640 appuser appgroup # 注释`。否则会报错，参数过多。
3. 每行配置之间不能有空格。
4. su 配置指令，要确保能正常执行。把真实能运行的用户，加入用户组：`sudo usermod -aG crontab myname`

## 调试

```bash
# 模拟执行（调试模式）
sudo logrotate -d /etc/logrotate.d/odoo

# 强制立即执行
sudo logrotate -f /etc/logrotate.d/odoo
```