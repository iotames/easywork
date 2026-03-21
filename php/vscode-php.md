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
extension=curl
extension=openssl
extension=mbstring
extension=fileinfo
; 某些PHP框架使用mysqli
extension=mysqli
; 某些框架例如symfony使用pdo
extension=pdo_mysql
;extension=pdo_pgsql
;extension=pdo_sqlite
;extension=pgsql
```

- 第三方依赖库下载: https://windows.php.net/downloads/php-sdk/deps/vc15/x64/

### 启动php-cgi：

```bash
php-cgi.exe -b 127.0.0.1:9000 -c php.ini
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