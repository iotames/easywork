---
lang: zh-CN
title: 使用vscode配置PHP开发环境
description: 本文详细记录了Windows系统下使用VSCode搭建PHP开发环境的完整流程。内容包括PHP下载与环境变量配置、VSCode必备插件（Intelephense、Debug、Server）安装、Xdebug调试环境搭建，以及配合Nginx解决“No input file specified”等常见错误的实战配置。
---

## 安装vscode

https://code.visualstudio.com/Download

按快捷键 `Ctl+Shift+X`，在应用商店中搜索扩展: `Chinese (Simplified)`, 安装简体中文扩展。


## PHP下载和配置

### PHP下载

https://windows.php.net/downloads/releases/archives/

下载并解压对应平台的PHP压缩包，并添加解压后的目录到 `PATH环境变量`
这边下载的PHP版本是: [php-7.2.9-nts-Win32-VC15-x64.zip](https://windows.php.net/downloads/releases/archives/php-7.2.9-nts-Win32-VC15-x64.zip)


### PHP配置

1. 复制 `php.ini-development.ini` 或 `php.ini-production` 为 `php.ini`
2. 在 `php.ini` 根据实际情况，设置扩展插件目录。如: `extension_dir = "ext"`
3. 关闭开启插件的注释。

```ini
memory_limit = 512M
; 最大执行时间，默认30秒。
; PHP老项目首次启动，生成缓存可能耗时较高。
max_execution_time = 300

; Directory in which the loadable extensions (modules) reside.
; http://php.net/extension-dir
;extension_dir = "./"
; On windows:
extension_dir = "ext"

; 取消注释，开启常用扩展

; 网络通讯常用扩展
extension=curl
; 用于HTTPS等安全通讯和数据加密，许多网络请求和加密功能依赖于此扩展。
extension=openssl
; 处理非拉丁文字（如中文）的必备扩展。
extension=mbstring
; 常用于验证用户上传的文件是否与其扩展名相符。
extension=fileinfo
; 某些PHP框架使用mysqli。提供了面向对象和面向过程两种方式
extension=mysqli
; 它提供了一个统一的、面向对象的数据库操作接口。很多现代框架，例如symfony使用pdo
extension=pdo_mysql
;extension=pdo_pgsql
;extension=pdo_sqlite
;extension=pgsql

; 用于动态创建和修改图片，常见用途包括生成验证码、添加水印、制作缩略图等。
extension=gd
; PHP的包管理工具Composer在安装依赖包时必须依赖此扩展。
extension=zip

; Intl 扩展提供了国际化相关的功能,包括字符集转换、日期时间处理、数字格式化、货币格式化、语言环境设置等
; 解决报错 Class "NumberFormatter" not found
extension=intl
```

- 第三方依赖库下载: https://windows.php.net/downloads/php-sdk/deps/vc15/x64/

### 启动php-cgi：

```bash
php-cgi.exe -b 127.0.0.1:9000 -c php.ini
```


## composer包管理器

### 安装composer

- https://docs.phpcomposer.com/00-intro.html

```bash
# 1. 设置系统的环境变量PATH，并下载 composer.phar 文件
set PATH=%PATH%;D:\bin
cd C:\bin
php -r "readfile('https://getcomposer.org/installer');" | php

# 2. 创建composer.bat文件，用于便捷调用composer.phar文件
echo @php "%~dp0composer.phar" %*>composer.bat
```

### 配置composer镜像

```bash
# 配置镜像
composer config -g repo.packagist composer https://packagist.phpcomposer.com

# 取消使用镜像
# ~/.config/composer/config.json
# C:\Users\用户名\AppData\Roaming\Composer\config.json
composer config -g --unset repos.packagist
```

`~/.config/composer/config.json` 或 `C:\Users\用户名\AppData\Roaming\Composer\config.json`

```json
{
    "config": {},
    "repositories": [{
        "name": "packagist",
        "type": "composer",
        "url": "https://packagist.phpcomposer.com"
    }]
}
```

### 设置composer代理

```bash
# Windows 命令提示符 (CMD)
set http_proxy=http://你的代理服务器地址:端口
set https_proxy=http://你的代理服务器地址:端口

# Windows PowerShell
$env:HTTP_PROXY="http://你的代理服务器地址:端口"
$env:HTTPS_PROXY="http://你的代理服务器地址:端口"

# Linux 或 macOS
export HTTP_PROXY=http://你的代理服务器地址:端口
export HTTPS_PROXY=http://你的代理服务器地址:端口
```

### Github令牌配置

- https://getcomposer.org/doc/articles/authentication-for-private-packages.md

登录GitHub账号 -》  Settings -》 Developer settings -》 Personal access tokens -》 Fine-grained tokens -》 Generate new token

生成token后，编辑composer的 `auth.json` 文件，路径如下所示：`C:\Users\yourname\AppData\Roaming\Composer\auth.json`

```json
{
    "github-oauth": {
        "github.com": "github_pat_11xxxxxxxxxxxxx5IP7CGo_4AL08JiFptdAGIwkwuZSk1r3P49utxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```


## vscode的PHP相关插件

- `PHP Intelephense`: 代码提示、追踪跳转插件
- `PHP Debug`: 代码调试插件，使用前面下的xdebug动态链接库来调试（可选）
- `PHP Server`: Web服务器插件，方便本地打卡PHP网页调试（可选）

vscode的 `settings.json` 文件配置如下:

```json
{
    "php.validate.executablePath": "D:\\App\\php-7.2.9-nts-Win32-VC15-x64\\php.exe"
}
```

以下为可选:
```json
{
    "php.debug.executablePath": "D:\\App\\php-7.2.9-nts-Win32-VC15-x64\\php.exe",
    "phpserver.phpConfigPath": "D:\\App\\php-7.2.9-nts-Win32-VC15-x64\\php.ini",
    "phpserver.phpPath": "D:\\App\\php-7.2.9-nts-Win32-VC15-x64\\php.exe",
}    
```


## 启动Web服务

- nginx for Windows: https://nginx.org/en/docs/windows.html
- nginx 下载: https://nginx.org/en/download.html

- 配置文件: `conf/nginx.conf`

- 启动NGINX： `start nginx.exe`


Nginx重载配置或退出：

```bash
nginx.exe -s reload
nginx.exe -s quit
```


## Xdebug插件（可选）

### xdebug下载

进入 `xdebug` 官网的下载地址: https://xdebug.org/download/historical，下载 `对应PHP版本` 的动态链接库二进制文件。
这边下载的文件是: [php_xdebug-3.1.6-7.2-vc15-nts-x86_64.dll](https://xdebug.org/files/php_xdebug-3.1.6-7.2-vc15-nts-x86_64.dll)

### xdebug安装

1. 进入PHP目录下的 `ext` 目录中，放入前面下载的动态链接库文件 `php_xdebug-3.1.6-7.2-vc15-nts-x86_64.dll`

2. 重命名PHP目录下的 `php.ini-development` 为 `php.ini`.
在末尾添加配置:

```ini
[xdebug]
zend_extension="D:/App/php-7.2.9-nts-Win32-VC15-x64/ext/php_xdebug-3.1.6-7.2-vc15-nts-x86_64.dll"
xdebug.remote_enable = 1
xdebug.remote_autostart = 1
```


## 报错处理

`nginx` 在浏览器输出: `No input file specified.` 错误

1. 检查 `nginx` 的 `*.conf` 配置文件(如: `conf/nginx.conf`)的 `root`, `index`, 和 `fastcgi_param` 三个配置项


将 `fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;` 改为:
`fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;` 或:
`fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;`

```
    server {
        listen 8081;
        listen [::]:8081;
        server_name example.com;
        root D:\\projects\\yourphpapp\\public;

        index index.html index.php;
    
        charset utf-8;
    
        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }
        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        location ~ \.php$ {
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            # fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
            # fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include        fastcgi_params;
        }
        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }

        location ~ .*\.(js|css)?$
        {
            expires      12h;
        }

        location ~ /\.(?!well-known).* {
            deny all;
        }
    }

```

2. `php.ini` 配置：cgi.fix_pathinfo=0 改为 cgi.fix_pathinfo=1。某些老旧的PHP框架需要如此设置。

```ini
; 默认配置cgi.fix_pathinfo=1
; 可能导致著名的PHP路径穿越漏洞，推荐设置为0。
; 某些旧的PHP框架依赖PATH_INFO来解析路由：
; http://example.com/index.php/controller/method
cgi.fix_pathinfo=0
```

----------

> vscode开发php https://blog.csdn.net/qq_43000219/article/details/122758971
> 用 VScode 怎么运行 php 代码？ https://www.zhihu.com/question/572439528/answer/3123247807
> php-openssl下载 https://blog.csdn.net/weixin_31290291/article/details/115510973
> 解决NGINX PHP ＂No input file specified＂http://blog.chinaunix.net/uid-20622737-id-3464343.html
> nginx for Windows https://nginx.org/en/docs/windows.html