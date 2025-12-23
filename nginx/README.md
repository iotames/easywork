## 禁用HTTP请求响应Nginx版本号

```bash
vim /etc/nginx/nginx.conf
```
确保 `server_tokens off;` 配置已启用。

```nginx.conf
http {
  ...
  server_tokens off;
  ...
}
```

## Ubuntu中的NGINX

注意：网站目录存放在 `/home/ubuntu` 路径下，很可能因权限问题无法访问。无论使用chmod还是chown命令修改权限，均无法解决。

```bash
tail -f /var/log/nginx/error.log

2025/12/23 09:27:57 [error] 3965262#3965262: *751 "/home/ubuntu/your_site/index.html" is forbidden (13: Permission denied), client: 103.167.135.33, server: site1.yoursite.com, request: "GET / HTTP/1.1", host: "site1.yoursite.com"
```

## 安装和配置

```bash
# 安装nginx
sudo apt install nginx

# 站点配置文件位置：
# /etc/nginx/sites-available/
# /etc/nginx/sites-enabled/
```

配置文件示例：

```conf
server {
    listen 80;
    server_name site1.yoursite.com;

    # 网站根目录
    root /var/www/site1.yoursite.com;
    index index.html index.htm;

    # 安全与优化设置
    server_tokens off; # 隐藏Nginx版本信息
    autoindex off;     # 禁止目录列表

    # 主location块
    location / {
    #       try_files $uri $uri/ /index.html; # 用于支持单页应用(SPA)的路由
            try_files $uri $uri/ =404;
    }

    # 图片及媒体文件缓存配置
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 30d; # 设置浏览器缓存时间为30天
        add_header Cache-Control "public, immutable";
    }

    # CSS与JavaScript文件缓存配置
    location ~* \.(css|js)$ {
        expires 7d; # 设置浏览器缓存时间为7天
        add_header Cache-Control "public";
    }

    # 禁止访问以点开头的隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # 错误页面配置
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/site1.yoursite.com;
    }
}
```


## Docker启动

```
#!/bin/bash

docker run -d --network host --name nginx -v /mnt/www:/mnt/www -v ~/vhost:/etc/nginx/conf.d
```

Nginx的虚拟主机配置文件中，`location` 语句块的 `proxy_pass` 配置，格式为：`proxy_pass http://<hostname>:<port>`。

如下所示：

```conf
  location / {
    proxy_set_header Host $host;
    # 下面如果漏掉http://前缀，会报错。
    proxy_pass http://prestashopnet:80;
  }
```

## Location语句块

- [Location表达式](location.md)
