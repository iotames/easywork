## 问题

国内互联网环境状况堪忧。最近连国内各大docker镜像源都用不了。拉取Docker镜像一直失败。尝试用HTTP代理也经常报错。发现还是socks5代理好用。

## 代理设置

```
mkdir -p /etc/systemd/system/docker.service.d
vim /etc/systemd/system/docker.service.d/http-proxy.conf
```

往 `/etc/systemd/system/docker.service.d/http-proxy.conf` 文件添加内容：

```
[Service]
Environment="HTTP_PROXY=socks5://user:pass@127.0.0.1:1080"
Environment="HTTPS_PROXY=socks5://user:pass@127.0.0.1:1080"
# 如果要访问本地私有网络，可以设置 NO_PROXY 环境变量。或禁用代理。
Environment="NO_PROXY=localhost,127.0.0.1"
```

重启docker

```
systemctl daemon-reload
systemctl restart docker
```

查看环境变量:

```
sudo systemctl show --property=Environment docker
```


### 群晖NAS


群晖 `Container Manager` 配置代理

```
mkdir -p /etc/systemd/system/pkg-ContainerManager-dockerd.service.d
vi /etc/systemd/system/pkg-ContainerManager-dockerd.service.d/http-proxy.conf
```

```
[Service]
Environment="HTTP_PROXY=socks5://192.168.1.3:10808"
Environment="HTTPS_PROXY=socks5://192.168.1.3:10808"
Environment="NO_PROXY=localhost,127.0.0.1"
```

```
systemctl daemon-reload
systemctl restart pkg-ContainerManager-dockerd.service
```

```
systemctl show --property=Environment pkg-ContainerManager-dockerd.service
```

另外如果要在 Docker 容器内通过代理访问网络，你可以在运行 Docker 容器时，设置环境变量来指定代理，例如：

```
docker run -e http_proxy=http://your-proxy:port \
           -e https_proxy=http://your-proxy:port \
           -e no_proxy=localhost,127.0.0.1 \
           your-image

```

----------

> Docker Hub 镜像加速 https://gitee.com/wanfeng789/docker-hub
> Synology 群辉NAS安装（5）介绍一下NAS的体系和安装container manager https://blog.csdn.net/haoyujie/article/details/145368583