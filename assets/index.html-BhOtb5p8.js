import{_ as e,c as i,e as l,a as s,d as c,w as d,r as p,o as r,b as t}from"./app-u0RXAV85.js";const o={};function u(m,n){const a=p("RouteLink");return r(),i("div",null,[n[1]||(n[1]=l(`<h2 id="禁用http请求响应nginx版本号" tabindex="-1"><a class="header-anchor" href="#禁用http请求响应nginx版本号"><span>禁用HTTP请求响应Nginx版本号</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">vim</span> /etc/nginx/nginx.conf</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>确保 <code>server_tokens off;</code> 配置已启用。</p><div class="language-nginx.conf line-numbers-mode" data-highlighter="prismjs" data-ext="nginx.conf"><pre><code class="language-nginx.conf"><span class="line">http {</span>
<span class="line">  ...</span>
<span class="line">  server_tokens off;</span>
<span class="line">  ...</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ubuntu中的nginx" tabindex="-1"><a class="header-anchor" href="#ubuntu中的nginx"><span>Ubuntu中的NGINX</span></a></h2><p>注意：网站目录存放在 <code>/home/ubuntu</code> 路径下，很可能因权限问题无法访问。无论使用chmod还是chown命令修改权限，均无法解决。</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">tail</span> <span class="token parameter variable">-f</span> /var/log/nginx/error.log</span>
<span class="line"></span>
<span class="line"><span class="token number">2025</span>/12/23 09:27:57 <span class="token punctuation">[</span>error<span class="token punctuation">]</span> <span class="token number">3965262</span><span class="token comment">#3965262: *751 &quot;/home/ubuntu/your_site/index.html&quot; is forbidden (13: Permission denied), client: 103.167.135.33, server: site1.yoursite.com, request: &quot;GET / HTTP/1.1&quot;, host: &quot;site1.yoursite.com&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装和配置" tabindex="-1"><a class="header-anchor" href="#安装和配置"><span>安装和配置</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 安装nginx</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> nginx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 站点配置文件位置：</span></span>
<span class="line"><span class="token comment"># /etc/nginx/sites-available/</span></span>
<span class="line"><span class="token comment"># /etc/nginx/sites-enabled/</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置文件示例：</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">server {</span>
<span class="line">    listen 80;</span>
<span class="line">    server_name site1.yoursite.com;</span>
<span class="line"></span>
<span class="line">    # 网站根目录</span>
<span class="line">    root /var/www/site1.yoursite.com;</span>
<span class="line">    index index.html index.htm;</span>
<span class="line"></span>
<span class="line">    # 安全与优化设置</span>
<span class="line">    server_tokens off; # 隐藏Nginx版本信息</span>
<span class="line">    autoindex off;     # 禁止目录列表</span>
<span class="line"></span>
<span class="line">    # 主location块</span>
<span class="line">    location / {</span>
<span class="line">    #       try_files $uri $uri/ /index.html; # 用于支持单页应用(SPA)的路由</span>
<span class="line">            try_files $uri $uri/ =404;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    # 图片及媒体文件缓存配置</span>
<span class="line">    location ~* \\.(jpg|jpeg|png|gif|ico|svg|webp)$ {</span>
<span class="line">        expires 30d; # 设置浏览器缓存时间为30天</span>
<span class="line">        add_header Cache-Control &quot;public, immutable&quot;;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    # CSS与JavaScript文件缓存配置</span>
<span class="line">    location ~* \\.(css|js)$ {</span>
<span class="line">        expires 7d; # 设置浏览器缓存时间为7天</span>
<span class="line">        add_header Cache-Control &quot;public&quot;;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    # 禁止访问以点开头的隐藏文件</span>
<span class="line">    location ~ /\\. {</span>
<span class="line">        deny all;</span>
<span class="line">        access_log off;</span>
<span class="line">        log_not_found off;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    # 错误页面配置</span>
<span class="line">    error_page 404 /404.html;</span>
<span class="line">    error_page 500 502 503 504 /50x.html;</span>
<span class="line">    location = /50x.html {</span>
<span class="line">        root /var/www/site1.yoursite.com;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="docker启动" tabindex="-1"><a class="header-anchor" href="#docker启动"><span>Docker启动</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">docker run -d --network host --name nginx -v /mnt/www:/mnt/www -v ~/vhost:/etc/nginx/conf.d</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Nginx的虚拟主机配置文件中，<code>location</code> 语句块的 <code>proxy_pass</code> 配置，格式为：<code>proxy_pass http://&lt;hostname&gt;:&lt;port&gt;</code>。</p><p>如下所示：</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">  location / {</span>
<span class="line">    proxy_set_header Host $host;</span>
<span class="line">    # 下面如果漏掉http://前缀，会报错。</span>
<span class="line">    proxy_pass http://prestashopnet:80;</span>
<span class="line">  }</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="location语句块" tabindex="-1"><a class="header-anchor" href="#location语句块"><span>Location语句块</span></a></h2>`,17)),s("ul",null,[s("li",null,[c(a,{to:"/nginx/location.html"},{default:d(()=>[...n[0]||(n[0]=[t("Location表达式",-1)])]),_:1})])])])}const b=e(o,[["render",u]]),h=JSON.parse('{"path":"/nginx/","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1766455597000,"contributors":[{"name":"Hankin","username":"Hankin","email":"whq78164@gmail.com","commits":5,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"fd289825fab5fedce7a998c8e07f381c58dbf3b4","time":1766455597000,"email":"554553400@qq.com","author":"Hankin","message":"UPDATE nginx/README.md"},{"hash":"c43135bb83678d73471215b9609150946934cd64","time":1751082170000,"email":"whq78164@gmail.com","author":"Hankin","message":"ADD nginxui.md"},{"hash":"8ccc8aa4bf9f6916bc5eddede3b30e66939637ac","time":1751017246000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE nginx md file. cicd.sh"},{"hash":"9320b9d51ebe9dac5b895941b1180d38f3478bfa","time":1750242607000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE nginx for docker"},{"hash":"d29f6d75fa1d1edf96a4bdb7f6b207c09932ca35","time":1745898409000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE docker-compose"}]},"filePathRelative":"nginx/README.md"}');export{b as comp,h as data};
