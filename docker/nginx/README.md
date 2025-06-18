## 说明

```
#!/bin/bash

docker run -d --network host --name nginx -v /mnt/www:/mnt/www -v ~/vhost:/etc/nginx/conf.d
```

Nginx的虚拟主机配置文件中，`location` 语句块的 `proxy_pass` 配置，格式为：`proxy_pass http://<hostname>:<port>`。

如下所示：

```
  location / {
    proxy_set_header Host $host;
    # 下面如果漏掉http://前缀，会报错。
    proxy_pass http://prestashopnet:80;
  }
```
