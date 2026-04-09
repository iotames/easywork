## Certbot工具

- Certbot安装与使用 https://certbot.eff.org/instructions
- Certbot用户指南 https://eff-certbot.readthedocs.io/en/stable/using.html

1. 证书和私钥文件：通常位于 `/etc/letsencrypt/live/yoursite.com/` 目录下（以命令中第一个 -d指定的域名为目录名）
2. 自动续期：使用 `certbot renew --dry-run` 来测试续期流程是否正常


## SSL证书生成

```bash
# 1. 安装certbot
# 2. 获取同时包含2个域名的证书，下面2个命令任选一个。

# 通过当前Nginx服务的域名配置，获取或更新证书，并自动修改NGINX配置。
# 如使用certonly参数，则不会自动修改NGINX配置，需要手动修改NGINX配置。
# certbot certonly --nginx -d yoursite.com -d www.yoursite.com
certbot --nginx -d yoursite.com -d www.yoursite.com

# 指定当前正在运行、并能通过公网被访问到的真实根目录，获取或更新证书
# 会在指定的网站根目录下的 .well-known/acme-challenge/ 路径中放置一个验证文件
certbot certonly --webroot -w /var/www/html -d yoursite.com -d www.yoursite.com
```

证书配置（一般由certbot自动生成）：

```conf
server {
    server_name www.yoursite.com yoursite.com;

    # 网站根目录
    root /var/www/html;
    index index.html index.htm;

    # 安全与优化设置
    server_tokens off; # 隐藏Nginx版本信息[1](@ref)
    autoindex off;     # 禁止目录列表[1](@ref)

    # 省略掉其他配置 ......

    # 证书关键配置
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/www.yoursite.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/www.yoursite.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
```

certbot命令：

```bash
# --webroot -w /var/www/html 参数，用于验证的目录。必须指定当前正在运行、并能通过公网被访问到的真实根目录。
 sudo certbot certonly --webroot -w /var/www/html -d yoursite.com -d www.yoursite.com
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Certificate not yet due for renewal

You have an existing certificate that has exactly the same domains or certificate name you requested and isn't close to expiry.
(ref: /etc/letsencrypt/renewal/www.yoursite.com.conf)

What would you like to do?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: Keep the existing certificate for now
2: Renew & replace the certificate (may be subject to CA rate limits)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2
Renewing an existing certificate for yoursite.com and www.yoursite.com

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/www.yoursite.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/www.yoursite.com/privkey.pem
This certificate expires on 2026-06-24.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

通过NGINX进行端口号反向代理的网站，可能找不到网站根目录。

可使用 `--nginx` 代替 `--webroot -w /var/www/html` 命令参数，自动从NGINX配置中更新证书。

```bash
 sudo certbot certonly --nginx -d yoursite.com -d www.yoursite.com
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
You have an existing certificate that contains a portion of the domains you
requested (ref: /etc/letsencrypt/renewal/www.yoursite.com.conf)

It contains these names: www.yoursite.com

You requested these names for the new certificate: yoursite.com,
www.yoursite.com.

Do you want to expand and replace this existing certificate with the new
certificate?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(E)xpand/(C)ancel: E
Renewing an existing certificate for yoursite.com and www.yoursite.com

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/www.yoursite.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/www.yoursite.com/privkey.pem
This certificate expires on 2026-06-24.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```


## 跳转设置

1. 80端口域名跳转到443端口
2. 443端口的不带www域名跳转到www开头的域名


```conf
server {
  listen 80;
  server_name www.yoursite.com yoursite.com;
  
  if ($host = www.yoursite.com) {
    return 301 https://$host$request_uri;
  } # managed by Certbot

  if ($host = yoursite.com) {
    return 301 https://www.yoursite.com$request_uri;
  }

  return 301 https://www.yoursite.com$request_uri;
}

server {
    server_name www.yoursite.com yoursite.com;

    # 统一跳转到www开头的主域名
    if ($host = yoursite.com) {
        return 301 https://www.yoursite.com$request_uri;
    }

    # 网站根目录
    root /var/www/html;
    index index.html index.htm;

    # 安全与优化设置
    server_tokens off; # 隐藏Nginx版本信息[1](@ref)
    autoindex off;     # 禁止目录列表[1](@ref)

    # 核心性能优化
    sendfile on;       # 开启高效文件传输模式[5](@ref)
    tcp_nopush on;     # 提升网络包传输效率[5](@ref)
    tcp_nodelay on;    # 提高网络包传输实时性[5](@ref)
    keepalive_timeout 65;

    # 启用Gzip压缩
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 2;
    gzip_types text/plain text/css application/javascript application/xml text/javascript image/svg+xml;
    gzip_vary on;

    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }


    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/www.yoursite.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/www.yoursite.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
```