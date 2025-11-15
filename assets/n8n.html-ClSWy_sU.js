import{_ as s,c as a,e,o as l}from"./app-Dpp9EncG.js";const i={};function p(c,n){return l(),a("div",null,[...n[0]||(n[0]=[e(`<h2 id="启动n8n" tabindex="-1"><a class="header-anchor" href="#启动n8n"><span>启动n8n</span></a></h2><ul><li>Node.js版本: <code>&gt;=v18</code></li></ul><ol><li>npx免安装启动：<code>npx n8n</code></li><li>npm全局安装：<code>npm install n8n -g</code></li><li>docker启动：<code>docker run -d --name n8n -p 5678:5678 -v ./n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n</code></li><li>docker compose启动</li></ol><p>Node.js启动：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 如果网速慢，可使用国内gitee镜像。</span></span>
<span class="line"><span class="token comment"># git clone git@gitee.com:mirrors/n8n.git</span></span>
<span class="line"><span class="token function">git</span> clone git@github.com:n8n-io/n8n.git</span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">cd</span> n8n</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装n8n要使用管理员权限运行。npx n8n</span></span>
<span class="line"><span class="token comment"># 后续可通过命令npx n8n start 启动</span></span>
<span class="line">npx <span class="token parameter variable">--registry</span><span class="token operator">=</span>https://registry.npmmirror.com n8n</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 如需固定路径，改用全局安装。可以指定版本号</span></span>
<span class="line"><span class="token comment"># npm install -g n8n</span></span>
<span class="line"><span class="token comment"># npm install -g n8n@1.94.1</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Docker 启动：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># docker pull docker.n8n.io/n8nio/n8n:1.81.0</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> volume create n8n_data</span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> <span class="token parameter variable">--rm</span> <span class="token parameter variable">--name</span> n8n <span class="token parameter variable">-p</span> <span class="token number">5678</span>:5678 <span class="token parameter variable">-v</span> n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Using with PostgreSQL</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> <span class="token parameter variable">--rm</span> <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">--name</span> n8n <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">--network</span> <span class="token function">host</span> <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-p</span> <span class="token number">5678</span>:5678 <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-e</span> <span class="token assign-left variable">DB_TYPE</span><span class="token operator">=</span>postgresdb <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-e</span> <span class="token assign-left variable">DB_POSTGRESDB_DATABASE</span><span class="token operator">=</span><span class="token operator">&lt;</span>POSTGRES_DATABASE<span class="token operator">&gt;</span> <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-e</span> <span class="token assign-left variable">DB_POSTGRESDB_HOST</span><span class="token operator">=</span><span class="token operator">&lt;</span>POSTGRES_HOST<span class="token operator">&gt;</span> <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-e</span> <span class="token assign-left variable">DB_POSTGRESDB_PORT</span><span class="token operator">=</span><span class="token operator">&lt;</span>POSTGRES_PORT<span class="token operator">&gt;</span> <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-e</span> <span class="token assign-left variable">DB_POSTGRESDB_USER</span><span class="token operator">=</span><span class="token operator">&lt;</span>POSTGRES_USER<span class="token operator">&gt;</span> <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-e</span> <span class="token assign-left variable">DB_POSTGRESDB_SCHEMA</span><span class="token operator">=</span><span class="token operator">&lt;</span>POSTGRES_SCHEMA<span class="token operator">&gt;</span> <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-e</span> <span class="token assign-left variable">DB_POSTGRESDB_PASSWORD</span><span class="token operator">=</span><span class="token operator">&lt;</span>POSTGRES_PASSWORD<span class="token operator">&gt;</span> <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-e</span> <span class="token assign-left variable">GENERIC_TIMEZONE</span><span class="token operator">=</span><span class="token string">&quot;Asia/Shanghai&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token comment"># 本地局域网测试需要配置N8N_SECURE_COOKIE=false。因为默认强制开启SSL。</span></span>
<span class="line"> <span class="token parameter variable">-e</span> <span class="token assign-left variable">N8N_SECURE_COOKIE</span><span class="token operator">=</span>false <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-v</span> n8n_data:/home/node/.n8n <span class="token punctuation">\\</span></span>
<span class="line"> docker.n8n.io/n8nio/n8n</span>
<span class="line"><span class="token comment"># n8nio/n8n:1.95.2</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Docker Compose 启动：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">mkdir n8n-compose</span>
<span class="line">cd n8n-compose</span>
<span class="line"></span>
<span class="line">vim .env</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-.env line-numbers-mode" data-highlighter="prismjs" data-ext=".env"><pre><code class="language-.env"><span class="line"># DOMAIN_NAME and SUBDOMAIN together determine where n8n will be reachable from</span>
<span class="line"># The top level domain to serve from</span>
<span class="line">DOMAIN_NAME=example.com</span>
<span class="line"></span>
<span class="line"># The subdomain to serve from</span>
<span class="line">SUBDOMAIN=n8n</span>
<span class="line"></span>
<span class="line"># The above example serve n8n at: https://n8n.example.com</span>
<span class="line"></span>
<span class="line"># Optional timezone to set which gets used by Cron and other scheduling nodes</span>
<span class="line"># New York is the default value if not set</span>
<span class="line">GENERIC_TIMEZONE=Europe/Berlin</span>
<span class="line"></span>
<span class="line"># The email address to use for the TLS/SSL certificate creation</span>
<span class="line">SSL_EMAIL=user@example.com</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Docker Compose 文件配置了两个容器：一个用于 n8n，另一个用于运行 traefik，这是一个用于管理 TLS/SSL 证书和处理路由的应用程序代理。</p><div class="language-compose.yaml line-numbers-mode" data-highlighter="prismjs" data-ext="compose.yaml"><pre><code class="language-compose.yaml"><span class="line">services:</span>
<span class="line">  traefik:</span>
<span class="line">    image: &quot;traefik&quot;</span>
<span class="line">    restart: always</span>
<span class="line">    command:</span>
<span class="line">      - &quot;--api.insecure=true&quot;</span>
<span class="line">      - &quot;--providers.docker=true&quot;</span>
<span class="line">      - &quot;--providers.docker.exposedbydefault=false&quot;</span>
<span class="line">      - &quot;--entrypoints.web.address=:80&quot;</span>
<span class="line">      - &quot;--entrypoints.web.http.redirections.entryPoint.to=websecure&quot;</span>
<span class="line">      - &quot;--entrypoints.web.http.redirections.entrypoint.scheme=https&quot;</span>
<span class="line">      - &quot;--entrypoints.websecure.address=:443&quot;</span>
<span class="line">      - &quot;--certificatesresolvers.mytlschallenge.acme.tlschallenge=true&quot;</span>
<span class="line">      - &quot;--certificatesresolvers.mytlschallenge.acme.email=\${SSL_EMAIL}&quot;</span>
<span class="line">      - &quot;--certificatesresolvers.mytlschallenge.acme.storage=/letsencrypt/acme.json&quot;</span>
<span class="line">    ports:</span>
<span class="line">      - &quot;80:80&quot;</span>
<span class="line">      - &quot;443:443&quot;</span>
<span class="line">    volumes:</span>
<span class="line">      - traefik_data:/letsencrypt</span>
<span class="line">      - /var/run/docker.sock:/var/run/docker.sock:ro</span>
<span class="line"></span>
<span class="line">  n8n:</span>
<span class="line">    image: docker.n8n.io/n8nio/n8n</span>
<span class="line">    restart: always</span>
<span class="line">    ports:</span>
<span class="line">      - &quot;127.0.0.1:5678:5678&quot;</span>
<span class="line">    labels:</span>
<span class="line">      - traefik.enable=true</span>
<span class="line">      - traefik.http.routers.n8n.rule=Host(\`\${SUBDOMAIN}.\${DOMAIN_NAME}\`)</span>
<span class="line">      - traefik.http.routers.n8n.tls=true</span>
<span class="line">      - traefik.http.routers.n8n.entrypoints=web,websecure</span>
<span class="line">      - traefik.http.routers.n8n.tls.certresolver=mytlschallenge</span>
<span class="line">      - traefik.http.middlewares.n8n.headers.SSLRedirect=true</span>
<span class="line">      - traefik.http.middlewares.n8n.headers.STSSeconds=315360000</span>
<span class="line">      - traefik.http.middlewares.n8n.headers.browserXSSFilter=true</span>
<span class="line">      - traefik.http.middlewares.n8n.headers.contentTypeNosniff=true</span>
<span class="line">      - traefik.http.middlewares.n8n.headers.forceSTSHeader=true</span>
<span class="line">      - traefik.http.middlewares.n8n.headers.SSLHost=\${DOMAIN_NAME}</span>
<span class="line">      - traefik.http.middlewares.n8n.headers.STSIncludeSubdomains=true</span>
<span class="line">      - traefik.http.middlewares.n8n.headers.STSPreload=true</span>
<span class="line">      - traefik.http.routers.n8n.middlewares=n8n@docker</span>
<span class="line">    environment:</span>
<span class="line">      - N8N_HOST=\${SUBDOMAIN}.\${DOMAIN_NAME}</span>
<span class="line">      - N8N_PORT=5678</span>
<span class="line">      - N8N_PROTOCOL=https</span>
<span class="line">      - NODE_ENV=production</span>
<span class="line">      - WEBHOOK_URL=https://\${SUBDOMAIN}.\${DOMAIN_NAME}/</span>
<span class="line">      - GENERIC_TIMEZONE=\${GENERIC_TIMEZONE}</span>
<span class="line">    volumes:</span>
<span class="line">      - n8n_data:/home/node/.n8n</span>
<span class="line">      - ./local-files:/files</span>
<span class="line"></span>
<span class="line">volumes:</span>
<span class="line">  n8n_data:</span>
<span class="line">  traefik_data:</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>更新：npm update -g n8n</li></ul><h2 id="数据存储位置" tabindex="-1"><a class="header-anchor" href="#数据存储位置"><span>数据存储位置</span></a></h2><h3 id="源码启动" tabindex="-1"><a class="header-anchor" href="#源码启动"><span>源码启动</span></a></h3><ul><li><code>C:\\Users\\yourname\\.n8n</code>: 数据目录</li><li><code>C:\\Users\\yourname\\.n8n\\config</code>：配置文件</li></ul><h3 id="docker启动" tabindex="-1"><a class="header-anchor" href="#docker启动"><span>Docker启动</span></a></h3><p>默认情况下，Docker 卷存储在 Docker 管理的宿主机目录中，而不是由用户直接指定。</p><ul><li>Linux: <code>/var/lib/docker/volumes/</code></li><li>Windows: <code>C:\\ProgramData\\Docker\\volumes\\</code></li></ul><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查看所有卷</span>
<span class="line">docker volume ls</span>
<span class="line"></span>
<span class="line"># 查看某个卷的详细信息</span>
<span class="line">docker volume inspect &lt;volume_name&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><blockquote><p>n8n官方文档：https://docs.n8n.io/</p></blockquote>`,22)])])}const t=s(i,[["render",p]]),d=JSON.parse('{"path":"/nodejs/n8n.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1750430058000,"contributors":[{"name":"Hankin","username":"Hankin","email":"hankin@catmes.com","commits":4,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"c3040525cdf57df2da3df370c8d03a4b6e318b24","time":1750430058000,"email":"hankin@catmes.com","author":"Hankin","message":"UPDATE JAVA"},{"hash":"656c92062ed002289cd04e4803065f9cf232576c","time":1748847473000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE n8n"},{"hash":"3bf826a8ea9f53e5bfd3987281335f600c9bfcca","time":1748832915000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE nodejs: nvm, n8n"},{"hash":"9050ff3d6218227a004a1d381d9dcb0fd7980e71","time":1748797129000,"email":"hankin@catmes.com","author":"Hankin","message":"UPDATE nodejs: nvm, n8n. docker: proxy registry volumes"}]},"filePathRelative":"nodejs/n8n.md"}');export{t as comp,d as data};
