## systemctl和systemd简介

- https://github.com/systemd/systemd

`systemd` 即： `system daemon`。源于Unix中的一个惯例：在Unix中常以 `d` 作为系统守护进程（英语：daemon）的后缀标识。

`systemctl` 是 `systemd` 的一个命令行工具，用于管理 `systemd` 服务。`service` 则是Linux系统的另一种服务管理方式。


## systemctl 和 service 

1. 所属体系: `systemctl` 属于 `systemd` init系统，`service` 属于早期的 `SysVinit` init系统
2. 控制范围: `service` 命令一般只能 启动、停止、重启和查看服务，`systemctl` 命令则更广。
3. 开机流程: 开机系统初始化时，`SysVinit` 让多个任务依次启动，`systemd` 则是梳理依赖关系，并行启动所有任务。
4. 应用目录: `service` 主要在 `/etc/init.d`，而 `systemctl` 在 `/etc/systemd/system` 等目录。

service和systemctl命令对比：

```bash
# 启动，停止，重启(先stop后再start)，查看状态
service redis start|stop|restart|status
systemctl start httpd.service

# 查看所有已启动服务列表，以及每个服务的运行级别。
chkconfig --list
systemctl list-units --type=service

# 设置开机启动，不开机启动
chkconfig httpd on|off
systemctl enable|disable httpd.service
```


## systemd 配置文件目录

1. 添加自定义服务： `/etc/systemd/system/`
2. 修改系统服务：`/usr/lib/systemd/system/`

- `/usr/lib/systemd/system/`: 存放系统级脚本，开机不登录就能运行。启动脚本的配置主要放这，类似 `/etc/init.d/`
- `/lib/systemd/system/`: 文件从 `/usr/lib/systemd/system/` 拷贝而来，故存放文件基本相同。
- `/etc/systemd/system/`: 存放文件和目录最少，为 `/lib/systemd/system/` 目录下的软连接。优先级最高。

- `/run/systemd/system/`：保存系统执行产生的服务脚本，优先级比 `/usr/lib/systemd/system/` 高。
- `/usr/lib/systemd/user/`: 存放用户级脚本，登录后才可运行
- `~/.config/systemd/user/`:仅当前用户可用。


## systemd自定义服务示例

例：`vim /etc/systemd/system/qddns.service`:

```conf
[Unit]
Description=DDNS timer
After=network.target

[Service]
WorkingDirectory=/root/qddns
# PIDFile=/run/qddns.pid
# ExecStartPre=/usr/bin/rm -f /run/qddns.pid
ExecStart=/root/qddns/qddns
# ExecReload=/bin/kill -s HUP $MAINPID
# ExecStop=/bin/kill -s QUIT $MAINPID
User=root
Restart=on-failure
RestartSec=300
# KillSignal=SIGQUIT
TimeoutStopSec=10
# KillMode=control-group
StandardOutput=file:/root/qddns/output.log
# StandardError=file:/root/qddns/output.err.log

[Install]
WantedBy=multi-user.target
```

常用命令：

```bash
# 重载配置文件
systemctl daemon-reload

systemctl enable qddns
systemctl status qddns
systemctl start qddns
systemctl stop qddns
```


## systemd系统服务示例

`cat /usr/lib/systemd/system/ssh.service`:

```conf
[Unit]
Description=OpenBSD Secure Shell server
Documentation=man:sshd(8) man:sshd_config(5)
After=network.target auditd.service
ConditionPathExists=!/etc/ssh/sshd_not_to_be_run
# Wants=sshd-keygen.service

[Service]
EnvironmentFile=-/etc/default/ssh
ExecStartPre=/usr/sbin/sshd -t
ExecStart=/usr/sbin/sshd -D $SSHD_OPTS
ExecReload=/usr/sbin/sshd -t
ExecReload=/bin/kill -HUP $MAINPID
KillMode=process
Restart=on-failure
RestartPreventExitStatus=255
Type=notify
RuntimeDirectory=sshd
RuntimeDirectoryMode=0755
# RestartSec=42s

[Install]
WantedBy=multi-user.target
Alias=sshd.service
```


## Unit单元

在 `systemd` 管理体系中，被管理的 `deamon` (守护进程)称作 `unit` (单元)，通过 `systemctl` 命令控制。
`target` 取代了initd的RunLevel(运行等级), `target` (服务组)就是一组unit(服务)，当启动某个target时就会启动里面的所有 `unit`。


unit的常见类型：

- *.service 定义系统服务
- *.target 模拟实现 `运行级别`
- *.device 定义内核识别的设备
- *.mount 定义文件系统的挂载点
- *.socket 标识进程间通信用到的socket文件
- *.snapshot 管理系统快照
- *.swap 标识swap设备
- *.automount 定义文件系统自动点设备
- *.path 定义文件系统中的一文件或目录

常见 service 单元:

- /usr/lib/systemd/system/cron.service
- /usr/lib/systemd/system/ssh.service
- /usr/lib/systemd/system/rc-local.service


## Unit File 配置文件解析

### [Unit]

```conf
[Unit]
Description=服务描述
Documentation=文档地址
After=说明本服务是在哪个 daemon 启动之后才启动
Before=在什么服务启动前最好启动本服务
Requies=依赖到其它的units；强依赖，被依赖的units无法激活时，当前的unit即无法激活；
Wants=依赖到其它的units；弱依赖；
Confilcts=定义units 的冲突关系；
```

- After 和 Before 只涉及启动顺序，不涉及依赖关系


### [Service]

```conf
[Service]
Type=simple #服务类型
User=用户名 #服务执行的用户，默认为root，其他用户管理systemd需经过root同意
Environment="ENV_KEY=ENV_VALUE" #定义环境变量

# 执行的命令必须是绝对路径(脚本或进程)，不能执行shell的内部命令
ExecStart=启动服务执行的命令
ExecReload=重启服务执行的命令
ExecStop=停止服务执行的命令
ExecStartPre=启动服务之前执行的命令
ExecStartPost字段：启动服务之后执行的命令
ExecStopPost=停止服务之后执行的命令

TimeoutSec=若这个服务在启动或者是关闭时，因为某些缘故导致无法顺利完成，设置一个超时。

# RestartSec: 自动重启服务需要间隔的时间(单位: 秒)。默认100ms
RestartSec=42
StandardOutput=file:/root/qddns/output.log # 定义日志文件路径
```

- 短线符号 `-`: 错误忽略符。所有的启动设置前，都可以短线 `-` 忽略错误。即发生错误时，不影响其他命令执行。
例: `EnvironmentFile=-/etc/default/ssh`，即使 /etc/default/ssh 文件不存在，也不抛出错误。

- [Service]中的启动、重启、停止命令要求使用`绝对路径`


#### Type: 启动类型

```
Type字段定义启动类型。它可以设置的值如下：
> simple（默认值）：ExecStart字段启动的进程为主进程
> forking：ExecStart字段将以fork()方式启动，此时父进程将会退出，子进程将成为主进程（后台运行）
> oneshot：类似于simple，但只执行一次，Systemd 会等它执行完，才启动其他服务
> dbus：类似于simple，但会等待 D-Bus 信号后启动
> notify：类似于simple，启动结束后会发出通知信号，然后 Systemd 再启动其他服务
> idle：类似于simple，但是要等到其他任务都执行完，才会启动该服务。一种使用场合是为让该服务的输出，不与其他服务的输出相混合
```

#### KillMode: 停止方式

`KillMode`：定义 Systemd 如何 `停止` 服务。

- control-group（默认值）：当前控制组里面的所有子进程，都会被杀掉
- process：只杀主进程
- mixed：主进程将收到 SIGTERM 信号，子进程收到 SIGKILL 信号
- none：没有进程会被杀掉，只是执行服务的 stop 命令。

ssh(sshd)服务，设置 `KillMode=process`，表示只停止主进程，不停止子进程，即子进程打开的 SSH session 仍然保持连接。这个设置不太常见，但对 sshd 很重要，否则你停止服务的时候，会连自己打开的 SSH session 一起杀掉。


#### Restart: 重启条件

`Restart`：定义服务在什么情况下自动重启

`Restart=on-failure`: 出现任何意外的失败，重启sshd。shd 正常停止（比如执行systemctl stop命令）的情况不重启。

- no（默认值）：退出后不会重启
- on-success：只有正常退出时（退出状态码为0），才会重启
- on-failure：非正常退出时（退出状态码非0），包括被信号终止和超时，才会重启
- on-abnormal：只有被信号终止和超时，才会重启
- on-abort：只有在收到没有捕捉到的信号终止时，才会重启
- on-watchdog：超时退出，才会重启
- always：不管是什么退出原因，总是重启

注：对于 `守护进程`，推荐设为 `on-failure`。对于那些允许发生错误退出的服务，可以设为 `on-abnormal`。


### [Install]: 定义开机启动


`target`: 定义了一个含有多个服务的启动目标。 Systemd 有默认的启动 `Target`。

- `multi-user.target`：表示多用户命令行状态；
- `graphical.target`：表示图形用户状态，它依赖于`multi-user.target`。

`systemctl enable` 命令会在 `/etc/systemd/system/multi-user.target.wants/` 目录生成 `软连接`。

```conf
[Install]
# 表示该服务所在的 Target。定义为开机启动项
WantedBy=multi-user.target
RequiredBy=被哪些unit所依赖；
```

`target` 相关命令:

```
# 查看系统默认target。如：输出 multi-user.target, 表示这个组的所有服务，都将开机启动
systemctl get-default

#查看 multi-user.target 包含的所有服务
systemctl list-dependencies multi-user.target
 
#切换到另一个 target
#shutdown.target 就是关机状态
systemctl isolate shutdown.target
```


## systemctl命令

- 重载配置 `systemctl daemon-reload`: 安装新服务，要重载配置文件，获取更改的配置并重新生成依赖树。
- 注销，取消注销服务 `systemctl mask|unmask firewalld`: 服务被注销后该服务就无法通过systemctl进行启停管理。
- 列出所有已安装单元 `systemctl list-units`
- 列出所有可用单元 `systemctl list-unit-files`

### 服务单元

- 开机启动 `systemctl enable httpd.service`: 在 `/etc/systemd/system/multi-user.target.wants/` 下，生成软链接
- 启动，停止和重载服务 `systemctl start|stop|reload sshd`: 通过 `*.service` 文件配置的systemctl命令
- 查看服务状态 `systemctl status qddns.service` 简写 `systemctl status qddns`
- 查看所有服务 `systemctl list-units --type=service` 可用服务: `systemctl list-unit-files --type=service`
- 列出开机启动的服务单元 `systemctl list-unit-files --type service | grep enabled`


### 定时器单元

- 列出开机启动的定时器单元 `systemctl list-unit-files --type timers | grep enabled`
- 列出所有定时器: `systemctl list-unit-files --type timers` or `systemctl list-timers`
- 常规操作同服务单元: `systemctl start|stop|enable|disable|status mytimer.timer`

```
# 查找qddns服务
systemctl list-unit-files --type=service | grep qddns.service

# 查看系统启动模式
systemctl get-default

# 设置系统为图形界面启动
systemctl set-default graphical.target

# 查看系统环境变量
systemctl show-environment
```


## 日志

1. 独立的日志文件

```
[Service]
StandardOutput=file:/root/qddns/output.log
```

2. journalctl 命令

```
# 查看某服务的日志
journalctl -u nginx.service

# 查看日志已占用的空间
journalctl --disk-usage

# 设置日志最大占用空间: 500M, 2G
journalctl --vacuum-size=500M

# 设置日志最大保存时间: 10d, 1years
journalctl --vacuum-time=30d
```

## 注意事项

`/etc/systemd/system/default.target`: 默认运行等级配置文件

service文件中ExecStart、ExecReload、ExecStop不支持> 、>>等重定向符号，可以用 `/bin/sh -c` 来实现。
`ExecStart=/bin/sh -c '/path/demo/demo >>/path/demo/demo/reload.log  2>&1'`

`/bin/sh -c` 命令fork出两个子进程，进程组的首进程，负责与终端tty交互，其次才是真正的demo进程。当执行reload时，实际上执行 `ExecReload=/bin/kill -s HUP $MAINPID` ，这个MAINPID其实是首进程，进程如果没做信号量的捕获，默认是执行中断操作，同时会给子进程发送 `SIGTREM信号` 杀掉子进程，所以systemctl命令报错。
换一种实现方法，就是查到demo进程的真实pid:

```
ExecReload=/bin/sh -c '/bin/kill -HUP $(pidof /path/demo/demo)'
```

为什么加入重定向就会循环fork出两个进程？

`/bin/sh -c` 的原理就是fork+exec来产生一个进程，子进程是无法与tty（控制台）交互的后台进程，重定向需要与tty（控制台）交互，所以先fork出来一个重定向进程，再fork出一个真正的demo进程


--------------

> Linux---系统守护systemd（System Daemon) https://blog.csdn.net/2301_80079642/article/details/148220777
> CentOS7下systemctl添加自定义服务 https://www.cnblogs.com/rainbow-tan/p/16448004.html
> systemctl使用reload及踩坑 https://blog.csdn.net/weixin_39992480/article/details/95484293
> Systemd 入门教程：实战篇 http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-part-two.html
> 详细讲解systemctl（附常用指令） https://blog.csdn.net/DBC_121/article/details/104005076
> 如何优雅的使用 Systemd 管理服务 https://zhuanlan.zhihu.com/p/271071439