## HTTrack介绍

HTTrack是一个免费的离线浏览器工具，可以将整个网站下载到本地，让你在没有网络时也能浏览。它通过递归抓取，保留网站的目录和链接结构，就像一个本地的网站“镜像”

下载页面：https://www.httrack.com/page/2/en/index.html

从源码自己构建：

```bash
git clone https://github.com/xroche/httrack.git --recurse
cd httrack
# ./configure --prefix=$HOME/usr && make -j8 && make install
./configure && make -j8 && make install DESTDIR=/
```

## HTTrack使用

```bash

httrack "https://example.com" -O "./my_site_mirror" --depth=5 --robots=0 -A10000000 -c8 -%v --disable-security-limits --keep-alive --referer "https://example.com" +"*.example.com/*" -"*/forum/*" -*.zip
```

--robots=0 忽略 robots.txt，不遵循爬虫君子协议。

-O "./my_site_mirror" 指定本地存储目录

-A10000000：允许下载小于10MB的大文件（如图片、文档）。

-c8：使用8个连接加速。

--referer "https://example.com"：为所有请求设置来源页，可突破部分防盗链。

--disable-security-limits：绕过一些可能导致下载中断的系统限制

### 精细控制

+"*.example.com/*"：强制抓取来自 example.com 及其子域的所有资源，这是解决跨域图床问题的关键。

-"*/forum/*"：排除forum目录。

-*.zip：排除所有ZIP文件。


## 使用wget命令下载整站镜像

```bash
# 整站镜像：使用-m选项镜像整个网站，相当于-r -N -l inf -nr的组合。
# 此命令会镜像整个网站，并遵守robots.txt规则
wget -m https://example.com

# 以下命令会镜像整个网站，转换链接为相对链接，并下载完整页面所需的所有元素：
# 使用-p选项可以下载显示完整页面所需的所有元素（如图片、CSS、JS等）。
# 使用-k选项可以在下载后转换文档中的链接，使其适合本地离线浏览。
wget -m -k -p -e robots=off --header="User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36" https://example.com
```
