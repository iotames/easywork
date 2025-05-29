## Runner介绍

GitLab中的 `Runner` 是 GitLab `CI/CD` 的关键组件，负责执行 `.gitlab-ci.yml` 文件中定义的作业。

`GitLab Runner` 本质上是一个独立的应用程序，它会与 GitLab 服务器建立连接，接收来自 GitLab 的作业请求，并在本地环境中执行这些作业。

当代码仓库中有新的提交触发了 CI/CD Pipeline 时，GitLab 会将作业分配给合适的 Runner 来执行。


## Runner类型

1. 实例运行器：适用于所有的群组和项目。由系统管理员创建。
2. 群组Runner: 适用于指定群组下的所有项目。由群组管理员创建。
3. 项目Runner: 适用于指定项目。由项目管理员创建。


## 创建Runner

1. 标签：可填写多个标签，用逗号 `,` 隔开。`.gitlab-ci.yml` 文件中的具体任务，也要填写具体标签，才能被运行。
2. 新手推荐勾选 `运行未打标签的作业`。默认没打标签的任务，才可以匹配到 `Runner`，从而被正常被运行。
3. 注册和安装Runner: 在远程机器上，安装Runner客户端程序，配合 `GitLab` 服务端工作。


## 注册和安装Runner

以Linux为例：

```
# 下载Runner客户端可执行文件
sudo curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64

# 赋予可执行权限
sudo chmod +x /usr/local/bin/gitlab-runner

# Create a GitLab Runner user
sudo useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash

# Install and run as a service
sudo gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner
sudo gitlab-runner start
```

安装完成后，执行 `注册命令`，生成包含GitLab服务端的url地址和密钥token的配置文件，Runner才能正常工作。

注册命令如下所示：

```
gitlab-runner register  --url http://172.16.160.10:8929  --token glrt-t2_xxxxxxxxxx
```

注册 Runner 后，`token` 密钥，将储存在客户端的配置文件 `config.toml` 中，并且无法从界面中再次访问。


## Runner配置和优化

以上操作后，`Runner` 会以守护进程的方式，在客户端机器后台常驻运行。

运行命令 `systemctl status gitlab-runner` 查看，内容如下所示：

```
● gitlab-runner.service - GitLab Runner
     Loaded: loaded (/etc/systemd/system/gitlab-runner.service; enabled; preset: enabled)
     Active: active (running) since Sat 2025-04-26 21:42:18 CST; 28s ago
   Main PID: 1117278 (gitlab-runner)
      Tasks: 12 (limit: 9473)
     Memory: 29.4M
        CPU: 205ms
     CGroup: /system.slice/gitlab-runner.service
             └─1117278 /usr/local/bin/gitlab-runner run --config /etc/gitlab-runner/config.toml --working-directory /home/gitlab-runner --service gitlab-runner --user gitlab-runner
```

`config.toml` 文件：

- `/etc/gitlab-runner/config.toml`: 全局配置。
- `/home/yourname/.gitlab-runner/config.toml`: 个性配置。此前运行 `gitlab-runner register` 命令时生成。

注：由于 `配置文件路径` 和 `用户权限`，可能导致某些作业，无法被正确执行。解决方法有如下几种：

1. 从 `~/.gitlab-runner/config.toml` 复制，更新 `/etc/gitlab-runner/config.toml` 文件。然后重启服务。
2. 重新配置系统服务文件（推荐）： `/etc/systemd/system/gitlab-runner.service`。


### 重新配置gitlab-runner系统服务

由命令 `systemctl status gitlab-runner` 可知，服务配置文件路径为：`/etc/systemd/system/gitlab-runner.service`

```
sudo vim /etc/systemd/system/gitlab-runner.service
```

如下所示：

```
[Unit]
Description=GitLab Runner
ConditionFileIsExecutable=/usr/local/bin/gitlab-runner

After=network.target


[Service]
StartLimitInterval=5
StartLimitBurst=10
ExecStart=/usr/local/bin/gitlab-runner run

Restart=always

RestartSec=120
EnvironmentFile=-/etc/sysconfig/gitlab-runner

# 下面这两个配置项比较重要
WorkingDirectory=/home/yourname
User=yourname

# StandardOutput=file:/root/output.log
# StandardError=file:/root/output.err.log
[Install]
WantedBy=multi-user.target
```

主要是在 `[Service]` 里面，添加 `WorkingDirectory` 和 `User` 两个配置项，并更改 `ExecStart` 配置。

```
# 变更前
ExecStart=/usr/local/bin/gitlab-runner "run" "--config" "/etc/gitlab-runner/config.toml" "--working-directory" "/home/gitlab-runner" "--service" "gitlab-runner" "--user" "gitlab-runner"
```

变更后
```
ExecStart=/usr/local/bin/gitlab-runner "run" "--config" "/home/yourname/.gitlab-runner/config.toml" "--working-directory" "/home/yourname" "--service" "gitlab-runner" "--user" "yourname"

# 或者简单点，如下面这样写也行
# ExecStart=/usr/local/bin/gitlab-runner run
```

重载服务配置：

```
systemctl daemon-reload
```
