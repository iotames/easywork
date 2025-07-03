## GitLab简介

‌GitLab是一个基于Git的开源项目，旨在帮助团队更高效地合作和开发软件。‌它使用Ruby on Rails框架构建，提供了一个自托管的Git仓库管理工具，支持版本控制、代码审查、持续集成和持续部署等功能。‌

主要功能包括：

-‌ 版本控制‌：用户可以创建分支、合并代码，并处理冲突，确保代码的历史和变更管理得当。
‌- 代码审查‌：团队成员可以通过拉取请求（Pull Requests）对提交的代码进行评论和讨论，确保代码质量。
‌- 持续集成/持续部署（CI/CD）‌：GitLab内置了CI/CD功能，支持自动化的构建、测试和部署流程，提高开发效率。
‌- 项目管理‌：通过Issue跟踪、看板、里程碑等功能，帮助团队管理项目进度和任务。

GitLab还提供了权限管理和审计日志，确保代码的安全性和合规性，适用于从小型开源项目到大型企业级应用的各种规模团队。
GitLab是实现 `DevOPS` 自动化开发运维流水线的经典工具。


## 硬件需求

|硬件|需求|说明|
|---|---|---|
|硬盘|安装空间2.5G，转速 > 7200RPM| 实际存储空间取决于代码仓库所占大小 |
|CPU|8核|每秒最多 20 个请求或 1000 个用户|
|内存|至少8G，推荐16G|16G满足每秒最多 20 个请求或 1000 个用户|


## 设置GITLAB_HOME路径

先设置一个 `GITLAB_HOME` 环境变量，为gitlab的工作目录。有2个方式：

1. 写入环境变量配置文件（推荐）。在 `docker-compose.yml` 文件的同级目录创建 `.env` 文件。写入 `GITLAB_HOME=/srv/gitlab`

2. 添加到shell的启动配置文件中。`echo "GITLAB_HOME=/srv/gitlab" >> ~/.bash_profile`

通过第2种方式添加配置后，使用 `source ~/.bash_profile` 命令，使配置生效


## 创建docker挂载目录

进入上一步骤设置的 `$GITLAB_HOME` 目录中，新建 `data`, `logs`, `config` 个文件夹。

如下所示：

|宿主机目录|容器内部目录|说明|
|---|---|---|
|$GITLAB_HOME/data|/var/opt/gitlab|Stores application data.|
|$GITLAB_HOME/logs|/var/log/gitlab|Stores logs.|
|$GITLAB_HOME/config|/etc/gitlab|Stores the GitLab configuration files.|

## 获取可用的GitLab版本

```
# 镜像名格式：
gitlab/gitlab-ce:<version>-ce.0

# 指定固定版本镜像
gitlab/gitlab-ce:17.6.2-ce.0

# 使用最新版本镜像
gitlab/gitlab-ce:latest
```

## 编写docker-compose.yml文件

`docker-compose.yml`:

```
version: '3.6'
services:
  gitlab:
    image: gitlab/gitlab-ce:17.6.2-ce.0
    container_name: gitlab
    restart: always
    hostname: 'gitlab.example.com'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://gitlab.example.com:8929'
        gitlab_rails['gitlab_shell_ssh_port'] = 2424
    ports:
      - '8929:8929'
      - '443:443'
      - '2424:22'
    volumes:
      - '$GITLAB_HOME/config:/etc/gitlab'
      - '$GITLAB_HOME/logs:/var/log/gitlab'
      - '$GITLAB_HOME/data:/var/opt/gitlab'
    shm_size: '256m'
```

通过 `GITLAB_OMNIBUS_CONFIG` 环境变量，配置 `external_url` 参数，设定仓库的HTTP地址。

`ports` 的端口映射，以 `GITLAB_OMNIBUS_CONFIG` 的相关配置项为准。


## 启动docker

```
docker compose up -d
```

容器首次启动，需要数分钟的时间，请耐心等待。
启动成功后，容器状态由 `(health: starting)` 变为 `(healthy)`。如下所示：

```
NAME      IMAGE                          COMMAND             SERVICE   CREATED       STATUS                             PORTS
gitlab    gitlab/gitlab-ce:17.6.2-ce.0   "/assets/wrapper"   gitlab    2 hours ago   Up 12 seconds (health: starting)   0.0.0.0:443->443/tcp, :::443->443/tcp, 80/tcp, 0.0.0.0:8929->8929/tcp, :::8929->8929/tcp, 0.0.0.0:2424->22/tcp, [::]:2424->22/tcp
```

```
NAME      IMAGE                          COMMAND             SERVICE   CREATED       STATUS                    PORTS
gitlab    gitlab/gitlab-ce:17.6.2-ce.0   "/assets/wrapper"   gitlab    3 hours ago   Up 51 minutes (healthy)   0.0.0.0:443->443/tcp, :::443->443/tcp, 80/tcp, 0.0.0.0:8929->8929/tcp, :::8929->8929/tcp, 0.0.0.0:2424->22/tcp, [::]:2424->22/tcp
```

查看容器运行日志：

```
sudo docker logs -f gitlab
```

通过前面配置的 `external_url`，访问 GitLab 项目地址，登录root账号。

- 用户名为： `root`
- 用户密码查看文件：宿主机的 `$GITLAB_HOME/config/initial_root_password` 或容器内的 `/etc/gitlab/initial_root_password`

注：The password file is automatically deleted in the first container restart after 24 hours.


## 基础配置

### GITLAB_OMNIBUS_CONFIG

`GITLAB_OMNIBUS_CONFIG` 环境变量，允许预设 `gitlab.rb` 文件的配置项。
具有以下特点：

- 比容器内的 `gitlab.rb` 配置文件更先被读取。
- 只会在系统启动时被加载，而不会直接修改 `gitlab.rb` 文件。
- 允许设置多个配置项，使用 `;` 符号隔开。

配置可包含 GitLab项目地址，数据库配置等。具体请见: [gitlab.rb文件配置模板](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/files/gitlab-config-template/gitlab.rb.template)

- `external_url`：项目主页。如：`"http://gitlab.example.com:8929"`
- `gitlab_rails['gitlab_shell_ssh_port']`：SSH端口。如：`2424`
- `gitlab_rails['initial_root_password']`: 项目初始化时，预设的root用户密码。

项目首次启动时，也可在容器内注入环境变量 `GITLAB_ROOT_PASSWORD` ，预设 root 用户的登录密码。


Docker运行命令如下所示：

```
sudo docker run --detach \
  --hostname gitlab.example.com \
  --env GITLAB_OMNIBUS_CONFIG="external_url 'http://gitlab.example.com:8929'; gitlab_rails['gitlab_shell_ssh_port'] = 2424" \
  --publish 8929:8929 --publish 2424:22 \
  --name gitlab \
  --restart always \
  --volume $GITLAB_HOME/config:/etc/gitlab \
  --volume $GITLAB_HOME/logs:/var/log/gitlab \
  --volume $GITLAB_HOME/data:/var/opt/gitlab \
  --shm-size 256m \
  gitlab/gitlab-ce:<version>-ce.0
```

### 修改配置

1. 进入容器：`sudo docker exec -it gitlab /bin/bash`
2. 修改配置文件：`editor /etc/gitlab/gitlab.rb`
3. 重载配置：`gitlab-ctl reconfigure`

## 中文设置

1. 全局设置：左下角菜单 `Admin`，点击：`Settings` - `Preferences`。 页面找到 `Localization` - `Default language`

2. 用户个性化设置：点击左上角用户头像，下拉框选择 `Preferences`。页面找到 `Localization` - `Language`

当前用户，一定是更改 `用户个性化设置`，才能生效：

在页面右上方的用户菜单中，选择“Settings”。
进入Settings页面后，点击左侧导航栏中的“Preferences”选项。
在Preferences页面中，找到“Localization”区域，将“Language”选项修改为“简体中文”。
点击页面下方的“Save changes”按钮，保存语言设置。


## 推荐设置

GitLab的设置界面，从左下角的设置菜单进入。其设置机制，从上往下分三个层级：`管理员` -> `群组` -> `项目`。
上层级的设置，为下一层级的默认值。下一层修改设置，会覆盖上一层。

1. 点击左下角 `管理员` - `设置` - `CI/CD` - `持续集成和部署`：取消 `所有项目默认使用Auto DevOps流水线`, `为新项目启用实例 Runner` 这两个默认勾选。设置地址：`/admin/application_settings/ci_cd`



## 数据库配置

自 `GitLab 16.0` 起，GitLab默认使用2个数据库连接。我们可以禁用，回到原始的单连接模式。

```
sudo docker exec -it gitlab editor /etc/gitlab/gitlab.rb
gitlab_rails['databases']['ci']['enable'] = false
sudo docker restart gitlab
```


## 日志配置

GitLab Omnibus 包已经内置了强大的 logrotate 配置。主要修改 `/etc/gitlab/gitlab.rb` 文件。

Logrotate 核心配置：

```
# 启用并配置 logrotate
logging['logrotate_enabled'] = true

# 设置轮转周期：'daily' (默认), 'weekly', 'monthly'
logging['logrotate_frequency'] = "daily"

# 保留多少个轮转后的归档日志文件 (默认 30 个)
logging['logrotate_rotate'] = 7  # 强烈建议减少，例如保留 7 天。这是控制磁盘占用的关键！

# 轮转前旧日志的最大大小（可选，但建议设置）。例如 100MB。达到此大小即使没到轮转时间也触发轮转。
logging['logrotate_size'] = "100M"

# 轮转后立即压缩旧日志 (默认 true)
logging['logrotate_compress'] = true

# 使用日期作为轮转文件的后缀 (如 production.log-20230703.gz) (默认 true)
logging['logrotate_dateformat'] = true
```

使配置立即生效
```
sudo gitlab-ctl reconfigure  # 应用 gitlab.rb 中的配置更改，会重新生成 logrotate 规则
sudo gitlab-ctl restart      # 重启所有 GitLab 组件 (有时 reconfigure 后重启更保险)
# 强制 logrotate 立即执行一次轮转（即使未达到 size/time 条件）
sudo /opt/gitlab/embedded/sbin/logrotate -fv /var/opt/gitlab/logrotate/logrotate.conf
```


## 系统邮箱配置

1. 修改配置文件：`/etc/gitlab/gitlab.rb`
2. 重载配置，使其生效：`gitlab-ctl reconfigure`
3. `smtp_user_name` 和 `gitlab_email_from` 要填同一个邮箱，并且 `smtp_password` 这个密码必须和邮箱对得上。没有账号要让邮箱管理员开账号。

```
gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "smtp.server"
gitlab_rails['smtp_port'] = 465
gitlab_rails['smtp_user_name'] = "smtp user"
gitlab_rails['smtp_password'] = "smtp password"
gitlab_rails['smtp_domain'] = "example.com"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['smtp_openssl_verify_mode'] = 'peer'

# If your SMTP server does not like the default 'From: gitlab@localhost' you
# can change the 'From' with this setting.
gitlab_rails['gitlab_email_from'] = 'gitlab@example.com'
gitlab_rails['gitlab_email_reply_to'] = 'noreply@example.com'

# If your SMTP server is using a self signed certificate or a certificate which
# is signed by a CA which is not trusted by default, you can specify a custom ca file.
# Please note that the certificates from /etc/gitlab/trusted-certs/ are
# not used for the verification of the SMTP server certificate.
gitlab_rails['smtp_ca_file'] = '/path/to/your/cacert.pem'
```

示例：QQ exmail (腾讯企业邮箱)

```
gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "smtp.exmail.qq.com"
gitlab_rails['smtp_port'] = 465
gitlab_rails['smtp_user_name'] = "xxxx@xx.com"
gitlab_rails['smtp_password'] = "password"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = false
gitlab_rails['smtp_tls'] = true
gitlab_rails['gitlab_email_from'] = 'xxxx@xx.com'
gitlab_rails['smtp_domain'] = "exmail.qq.com"
```

----------

> GitLab installation requirements https://docs.gitlab.com/install/requirements/
> Install GitLab in a Docker container https://docs.gitlab.com/install/docker/installation/
> Steps after installing GitLab: https://docs.gitlab.com/install/next_steps/