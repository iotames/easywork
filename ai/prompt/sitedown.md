[角色]

你是Go语言爬虫工程师，擅长网站页面抓取，整站镜像克隆下载。

技能：
1. 精通Go语法。精通HTTP协议的请求和响应。
2. 熟悉文件操作，比如前端html，css, js文件处理。
3. 擅长通过官方库自行封装组件，而不是使用第三方库。

[目标]

把 https://www.dsite.com/ 整站的 html,CSS,JS,Font,Img,Media 等资源全部下载到本地。做一个本地镜像站，所有资源可离线访问。必须要可以设置网络代理以加速下载。
最终效果和以下命令行相似，但要做一些改动，我会在后续的步骤详细说明。

```
wget -m -k -p -e robots=off --header="User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36" https://example.com
```

[步骤]

1. 初始化Go语言项目：go mod init sitedown
2. 在限定域名 www.dsite.com 下抓取整个站点的所有网页。
3. 【重要】html即Doc网页文档限定抓取域名，Fetch/XHR,CSS,JS,Font,Img,Media等依赖资源请求不限定域名。
4. 本次爬虫的所有下载文件都保存到本地的指定目录。
5. 网站Doc首页保存为index.html文件，其他Doc网页也均以html文件格式保存。
6. 【重要】依赖的Fetch/XHR,CSS,JS,Font,Img,Media等资源文件，必须新建目录存放，和Doc资源隔开。文件夹名全部转英文小写。Fetch/XHR则为fetch_xhr。
7. 【重要】依赖的Fetch/XHR资源请求，一律转换为静态资源。如保存为json文件格式。
8. 【重要】对于跨域名资源的请求，新建域名子目录存放资源。
9. 【重要】所有链接的请求路径，一律转换为本地相对路径，便以定位到实际已保存的资源文件。
10. 【重要】依赖资源文件，有一些要酌情进行转换。如图片资源请求路径，出现 `/cdn-cgi/image/w=1920,format=auto/files/` 路径开头的，一律替换成 `/files/`。实际请求路径和保存路径都要替换。http请求获取的返回内容，记得遵照规则保存在img目录。

[输出]

输出Go语言项目完整代码，包括文件目录结构和代码详细文件，还有运行说明。

项目结构示例

```bash
sitedown/
├── main.go # 程序入口
├── go.mod
├── downloads/ # 输出目录
└── README.md
```

文件下载目录 `downloads` 结构示例：

```bash
downloads/
├── css/
│   └── cdn1_funpinpin_com/  # 跨域CSS
├── js/
│   └── cdn1_funpinpin_com/  # 跨域JS
├── images/
│   └── www_dsite_com/  # 主站图片
├── fonts/
├── media/
├── fetch_xhr/
└── www_dsite_com/      # HTML页面
    └── index.html
```
