import{_ as n,c as e,e as a,o as i}from"./app-CfbfoSO9.js";const l={};function c(p,s){return i(),e("div",null,[...s[0]||(s[0]=[a(`<h2 id="certbot工具" tabindex="-1"><a class="header-anchor" href="#certbot工具"><span>Certbot工具</span></a></h2><ul><li>Certbot安装与使用 https://certbot.eff.org/instructions</li><li>Certbot用户指南 https://eff-certbot.readthedocs.io/en/stable/using.html</li></ul><ol><li>证书和私钥文件：通常位于 <code>/etc/letsencrypt/live/yoursite.com/</code> 目录下（以命令中第一个 -d指定的域名为目录名）</li><li>自动续期：使用 <code>certbot renew --dry-run</code> 来测试续期流程是否正常</li></ol><h2 id="ssl证书生成" tabindex="-1"><a class="header-anchor" href="#ssl证书生成"><span>SSL证书生成</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 安装certbot</span></span>
<span class="line"><span class="token comment"># 2. 获取同时包含2个域名的证书，下面2个命令任选一个。</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 通过当前Nginx服务的域名配置，获取或更新证书，并自动修改NGINX配置。</span></span>
<span class="line"><span class="token comment"># 如使用certonly参数，则不会自动修改NGINX配置，需要手动修改NGINX配置。</span></span>
<span class="line"><span class="token comment"># certbot certonly --nginx -d yoursite.com -d www.yoursite.com</span></span>
<span class="line">certbot <span class="token parameter variable">--nginx</span> <span class="token parameter variable">-d</span> yoursite.com <span class="token parameter variable">-d</span> www.yoursite.com</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 指定当前正在运行、并能通过公网被访问到的真实根目录，获取或更新证书</span></span>
<span class="line"><span class="token comment"># 会在指定的网站根目录下的 .well-known/acme-challenge/ 路径中放置一个验证文件</span></span>
<span class="line">certbot certonly <span class="token parameter variable">--webroot</span> <span class="token parameter variable">-w</span> /var/www/html <span class="token parameter variable">-d</span> yoursite.com <span class="token parameter variable">-d</span> www.yoursite.com</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>证书配置（一般由certbot自动生成）：</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">server {</span>
<span class="line">    server_name www.yoursite.com yoursite.com;</span>
<span class="line"></span>
<span class="line">    # 网站根目录</span>
<span class="line">    root /var/www/html;</span>
<span class="line">    index index.html index.htm;</span>
<span class="line"></span>
<span class="line">    # 安全与优化设置</span>
<span class="line">    server_tokens off; # 隐藏Nginx版本信息[1](@ref)</span>
<span class="line">    autoindex off;     # 禁止目录列表[1](@ref)</span>
<span class="line"></span>
<span class="line">    # 省略掉其他配置 ......</span>
<span class="line"></span>
<span class="line">    # 证书关键配置</span>
<span class="line">    listen 443 ssl; # managed by Certbot</span>
<span class="line">    ssl_certificate /etc/letsencrypt/live/www.yoursite.com/fullchain.pem; # managed by Certbot</span>
<span class="line">    ssl_certificate_key /etc/letsencrypt/live/www.yoursite.com/privkey.pem; # managed by Certbot</span>
<span class="line">    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot</span>
<span class="line">    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>certbot命令：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># --webroot -w /var/www/html 参数，用于验证的目录。必须指定当前正在运行、并能通过公网被访问到的真实根目录。</span></span>
<span class="line"> <span class="token function">sudo</span> certbot certonly <span class="token parameter variable">--webroot</span> <span class="token parameter variable">-w</span> /var/www/html <span class="token parameter variable">-d</span> yoursite.com <span class="token parameter variable">-d</span> www.yoursite.com</span>
<span class="line">Saving debug log to /var/log/letsencrypt/letsencrypt.log</span>
<span class="line">Certificate not yet due <span class="token keyword">for</span> renewal</span>
<span class="line"></span>
<span class="line">You have an existing certificate that has exactly the same domains or certificate name you requested and isn<span class="token string">&#39;t close to expiry.</span>
<span class="line">(ref: /etc/letsencrypt/renewal/www.yoursite.com.conf)</span>
<span class="line"></span>
<span class="line">What would you like to do?</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">1: Keep the existing certificate for now</span>
<span class="line">2: Renew &amp; replace the certificate (may be subject to CA rate limits)</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">Select the appropriate number [1-2] then [enter] (press &#39;</span>c<span class="token string">&#39; to cancel): 2</span>
<span class="line">Renewing an existing certificate for yoursite.com and www.yoursite.com</span>
<span class="line"></span>
<span class="line">Successfully received certificate.</span>
<span class="line">Certificate is saved at: /etc/letsencrypt/live/www.yoursite.com/fullchain.pem</span>
<span class="line">Key is saved at:         /etc/letsencrypt/live/www.yoursite.com/privkey.pem</span>
<span class="line">This certificate expires on 2026-06-24.</span>
<span class="line">These files will be updated when the certificate renews.</span>
<span class="line">Certbot has set up a scheduled task to automatically renew this certificate in the background.</span>
<span class="line"></span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">If you like Certbot, please consider supporting our work by:</span>
<span class="line"> * Donating to ISRG / Let&#39;</span>s Encrypt:   https://letsencrypt.org/donate</span>
<span class="line"> * Donating to EFF:                    https://eff.org/donate-le</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过NGINX进行端口号反向代理的网站，可能找不到网站根目录。</p><p>可使用 <code>--nginx</code> 代替 <code>--webroot -w /var/www/html</code> 命令参数，自动从NGINX配置中更新证书。</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"> <span class="token function">sudo</span> certbot certonly <span class="token parameter variable">--nginx</span> <span class="token parameter variable">-d</span> yoursite.com <span class="token parameter variable">-d</span> www.yoursite.com</span>
<span class="line">Saving debug log to /var/log/letsencrypt/letsencrypt.log</span>
<span class="line"></span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">You have an existing certificate that contains a portion of the domains you</span>
<span class="line">requested <span class="token punctuation">(</span>ref: /etc/letsencrypt/renewal/www.yoursite.com.conf<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">It contains these names: www.yoursite.com</span>
<span class="line"></span>
<span class="line">You requested these names <span class="token keyword">for</span> the new certificate: yoursite.com,</span>
<span class="line">www.yoursite.com.</span>
<span class="line"></span>
<span class="line">Do you want to <span class="token function">expand</span> and replace this existing certificate with the new</span>
<span class="line">certificate?</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line"><span class="token punctuation">(</span>E<span class="token punctuation">)</span>xpand/<span class="token punctuation">(</span>C<span class="token punctuation">)</span>ancel: E</span>
<span class="line">Renewing an existing certificate <span class="token keyword">for</span> yoursite.com and www.yoursite.com</span>
<span class="line"></span>
<span class="line">Successfully received certificate.</span>
<span class="line">Certificate is saved at: /etc/letsencrypt/live/www.yoursite.com/fullchain.pem</span>
<span class="line">Key is saved at:         /etc/letsencrypt/live/www.yoursite.com/privkey.pem</span>
<span class="line">This certificate expires on <span class="token number">2026</span>-06-24.</span>
<span class="line">These files will be updated when the certificate renews.</span>
<span class="line">Certbot has <span class="token builtin class-name">set</span> up a scheduled task to automatically renew this certificate <span class="token keyword">in</span> the background.</span>
<span class="line"></span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line">If you like Certbot, please consider supporting our work by:</span>
<span class="line"> * Donating to ISRG / Let&#39;s Encrypt:   https://letsencrypt.org/donate</span>
<span class="line"> * Donating to EFF:                    https://eff.org/donate-le</span>
<span class="line">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="跳转设置" tabindex="-1"><a class="header-anchor" href="#跳转设置"><span>跳转设置</span></a></h2><ol><li>80端口域名跳转到443端口</li><li>443端口的不带www域名跳转到www开头的域名</li></ol><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">server {</span>
<span class="line">   if ($host = www.yoursite.com) {</span>
<span class="line">        return 301 https://$host$request_uri;</span>
<span class="line">    } # managed by Certbot</span>
<span class="line"></span>
<span class="line">    if ($host = yoursite.com) {</span>
<span class="line">        return 301 https://www.yoursite.com$request_uri;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">     listen 80;</span>
<span class="line">     server_name www.yoursite.com yoursite.com;</span>
<span class="line">     return 301 https://www.yoursite.com$request_uri;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">server {</span>
<span class="line">    server_name www.yoursite.com yoursite.com;</span>
<span class="line"></span>
<span class="line">    # 统一跳转到www开头的主域名</span>
<span class="line">    if ($host = yoursite.com) {</span>
<span class="line">        return 301 https://www.yoursite.com$request_uri;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    # 网站根目录</span>
<span class="line">    root /var/www/html;</span>
<span class="line">    index index.html index.htm;</span>
<span class="line"></span>
<span class="line">    # 安全与优化设置</span>
<span class="line">    server_tokens off; # 隐藏Nginx版本信息[1](@ref)</span>
<span class="line">    autoindex off;     # 禁止目录列表[1](@ref)</span>
<span class="line"></span>
<span class="line">    # 核心性能优化</span>
<span class="line">    sendfile on;       # 开启高效文件传输模式[5](@ref)</span>
<span class="line">    tcp_nopush on;     # 提升网络包传输效率[5](@ref)</span>
<span class="line">    tcp_nodelay on;    # 提高网络包传输实时性[5](@ref)</span>
<span class="line">    keepalive_timeout 65;</span>
<span class="line"></span>
<span class="line">    # 启用Gzip压缩</span>
<span class="line">    gzip on;</span>
<span class="line">    gzip_min_length 1k;</span>
<span class="line">    gzip_comp_level 2;</span>
<span class="line">    gzip_types text/plain text/css application/javascript application/xml text/javascript image/svg+xml;</span>
<span class="line">    gzip_vary on;</span>
<span class="line"></span>
<span class="line">    client_max_body_size 20M;</span>
<span class="line"></span>
<span class="line">    location / {</span>
<span class="line">        proxy_pass http://localhost:3001;</span>
<span class="line">        proxy_http_version 1.1;</span>
<span class="line">        proxy_set_header Upgrade $http_upgrade;</span>
<span class="line">        proxy_set_header Connection &#39;upgrade&#39;;</span>
<span class="line">        proxy_set_header Host $host;</span>
<span class="line">        proxy_cache_bypass $http_upgrade;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    listen 443 ssl; # managed by Certbot</span>
<span class="line">    ssl_certificate /etc/letsencrypt/live/www.yoursite.com/fullchain.pem; # managed by Certbot</span>
<span class="line">    ssl_certificate_key /etc/letsencrypt/live/www.yoursite.com/privkey.pem; # managed by Certbot</span>
<span class="line">    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot</span>
<span class="line">    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot</span>
<span class="line"></span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,15)])])}const r=n(l,[["render",c]]),d=JSON.parse('{"path":"/nginx/httpsconf.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1774575174000,"contributors":[{"name":"Hankin","username":"Hankin","email":"554553400@qq.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"c976b93eb617096bbffa5fa3fb2897193597f094","time":1774575174000,"email":"554553400@qq.com","author":"Hankin","message":"ADD httpsconf for NGINX"}]},"filePathRelative":"nginx/httpsconf.md"}');export{r as comp,d as data};
