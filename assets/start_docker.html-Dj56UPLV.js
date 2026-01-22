import{_ as n,c as a,e,o as i}from"./app-A13fHkUV.js";const l={};function c(p,s){return i(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="项目下载" tabindex="-1"><a class="header-anchor" href="#项目下载"><span>项目下载</span></a></h2><ul><li>docker: version &gt;= 19.03.0+</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">git</span> clone https://github.com/taigaio/taiga-docker.git</span>
<span class="line"><span class="token builtin class-name">cd</span> taiga-docker/</span>
<span class="line"><span class="token function">git</span> checkout stable</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置变量" tabindex="-1"><a class="header-anchor" href="#配置变量"><span>配置变量</span></a></h2><ul><li>配置：https://docs.djangoproject.com/zh-hans/5.2/ref/settings/</li></ul><p>在 <code>.env</code> 文件配置变量，以覆盖默认值。 docker-compose.yml 和 docker-compose-inits.yml 都将从此文件中读取数据</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line"># 数据库账号密码</span>
<span class="line">POSTGRES_USER=taiga</span>
<span class="line">POSTGRES_PASSWORD=taiga</span>
<span class="line"></span>
<span class="line"># URL 设置</span>
<span class="line">TAIGA_SCHEME=http</span>
<span class="line">TAIGA_DOMAIN=localhost:9000</span>
<span class="line"># it&#39;ll be appended to the TAIGA_DOMAIN (use either &quot;&quot; or a &quot;/subpath&quot;)</span>
<span class="line">SUBPATH=&quot;&quot;</span>
<span class="line"># events connection protocol (use either &quot;ws&quot; or &quot;wss&quot;)</span>
<span class="line">WEBSOCKETS_SCHEME=ws</span>
<span class="line"></span>
<span class="line"># 设置密钥，用于加密签名。</span>
<span class="line">SECRET_KEY=&quot;taiga-secret-key&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>电子邮件配置</li></ul><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line"># 默认情况下，电子邮件将打印在标准输出 （EMAIL_BACKEND=console）。如果您有自己的 SMTP 服务，请将其更改为 EMAIL_BACKEND=smtp</span>
<span class="line">EMAIL_BACKEND=console  # use an SMTP server or display the emails in the console (either &quot;smtp&quot; or &quot;console&quot;)</span>
<span class="line">EMAIL_HOST=smtp.host.example.com  # SMTP server address</span>
<span class="line">EMAIL_PORT=587   # default SMTP port</span>
<span class="line">EMAIL_HOST_USER=user  # user to connect the SMTP server</span>
<span class="line">EMAIL_HOST_PASSWORD=password  # SMTP user&#39;s password</span>
<span class="line">EMAIL_DEFAULT_FROM=changeme@example.com  # email address for the automated emails</span>
<span class="line"></span>
<span class="line"># EMAIL_USE_TLS/EMAIL_USE_SSL are mutually exclusive (only set one of those to True)</span>
<span class="line">EMAIL_USE_TLS=True  # use TLS (secure) connection with the SMTP server</span>
<span class="line">EMAIL_USE_SSL=False  # use implicit TLS (secure) connection with the SMTP server</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>队列管理器设置: 用于在 rabbitmq 服务中保留消息。</li></ul><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">RABBITMQ_USER=taiga  # user to connect to RabbitMQ</span>
<span class="line">RABBITMQ_PASS=taiga  # RabbitMQ user&#39;s password</span>
<span class="line">RABBITMQ_VHOST=taiga  # RabbitMQ container name</span>
<span class="line">RABBITMQ_ERLANG_COOKIE=secret-erlang-cookie  # unique value shared by any connected instance of RabbitMQ</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="其他自定义配置" tabindex="-1"><a class="header-anchor" href="#其他自定义配置"><span>其他自定义配置</span></a></h3><p>默认情况下，所有这些自定义选项都处于禁用状态，需要您编辑 <code>docker-compose.yml</code></p><p>应该在适当的服务（或在 <code>docker-compose.yml</code> 文件中的 <code>&amp;default-back-environment</code> 组）中添加相应的环境变量，并使用有效值来启用它们。</p><p>如果您使用的是 HTTP（尽管强烈建议反对它），则需要配置以下环境变量，以便您可以访问 Admin：</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line"># Django Admin 中的会话 cookie</span>
<span class="line"># 添加到 &amp;default-back-environment 环境</span>
<span class="line">SESSION_COOKIE_SECURE: &quot;False&quot;</span>
<span class="line">CSRF_COOKIE_SECURE: &quot;False&quot;</span>
<span class="line"></span>
<span class="line"># 公众注册</span>
<span class="line"># 添加到 &amp;default-back-environment 环境</span>
<span class="line">PUBLIC_REGISTER_ENABLED: &quot;True&quot;</span>
<span class="line"># 添加到 taiga-front 服务环境</span>
<span class="line">PUBLIC_REGISTER_ENABLED: &quot;true&quot;</span>
<span class="line"></span>
<span class="line"># Gitlab OAuth 登录</span>
<span class="line"># 添加到 &amp;default-back-environment 环境</span>
<span class="line">ENABLE_GITLAB_AUTH: &quot;True&quot;</span>
<span class="line">GITLAB_API_CLIENT_ID: &quot;gitlab-client-id&quot;</span>
<span class="line">GITLAB_API_CLIENT_SECRET: &quot;gitlab-client-secret&quot;</span>
<span class="line">GITLAB_URL: &quot;gitlab-url&quot;</span>
<span class="line">PUBLIC_REGISTER_ENABLED: &quot;True&quot;</span>
<span class="line"># 添加到 taiga-front 服务环境</span>
<span class="line">ENABLE_GITLAB_AUTH: &quot;true&quot;</span>
<span class="line">GITLAB_CLIENT_ID: &quot;gitlab-client-id&quot;</span>
<span class="line">GITLAB_URL: &quot;gitlab-url&quot;</span>
<span class="line">PUBLIC_REGISTER_ENABLED: &quot;true&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="高级配置-可选" tabindex="-1"><a class="header-anchor" href="#高级配置-可选"><span>高级配置(可选)</span></a></h2><p>高级配置将忽略 docker-compose.yml 或 docker-compose-inits.yml 中的环境变量。如果您使用的是 env vars，请跳过此部分。</p><p>此为直接修改代码配置文件。</p><h3 id="映射-config-py-文件" tabindex="-1"><a class="header-anchor" href="#映射-config-py-文件"><span>映射 config.py 文件</span></a></h3><p>从 https://github.com/taigaio/taiga-back 下载文件，settings/config.py.prod.example 并重命名它：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mv</span> settings/config.py.prod.example settings/config.py</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>将文件映射到 /taiga-back/settings/config.py 。请记住，您必须同时以 docker-compose.yml 和 docker-compose-inits.yml 映射它。您可以通过示例查看 <code>docker-compose.yml</code> 中的 <code>x-volumes</code> 部分。</p><p>编辑 <code>config.py</code>:</p><ul><li>Taiga secret key：更改它很重要 。它必须与 taiga-events 和 taiga-protected 中的密钥具有相同的值</li><li>Taiga urls：使用 TAIGA_URL、SITES 和 FORCE_SCRIPT_NAME 配置 Taiga 的投放位置（见下面的示例）</li><li>连接到 PostgreSQL;check 文件中的 DATABASES 部分</li><li>连接到 RabbitMQ 以使用 taiga-events;检查文件中的 “EVENTS” 部分</li><li>连接到 RabbitMQ 以进行 taiga-async;检查文件中的 “TAIGA ASYNC” 部分</li><li>电子邮件凭证;检查文件中的 “EMAIL” 部分</li><li>启用/禁用匿名遥测;检查文件中的 “TELEMETRY” 部分</li></ul><h3 id="映射-conf-json-文件" tabindex="-1"><a class="header-anchor" href="#映射-conf-json-文件"><span>映射 conf.json 文件</span></a></h3><p>从 https://github.com/taigaio/taiga-front 下载文件 conf/conf.example.json 并重命名它：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">mv</span> conf.example.json conf.json</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>示例：</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;api&quot;</span><span class="token operator">:</span> <span class="token string">&quot;https://taiga.mycompany.com/api/v1/&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;eventsUrl&quot;</span><span class="token operator">:</span> <span class="token string">&quot;wss://taiga.mycompany.com/events&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;baseHref&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    ...</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置admin用户" tabindex="-1"><a class="header-anchor" href="#配置admin用户"><span>配置Admin用户</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> compose up <span class="token parameter variable">-d</span></span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> compose <span class="token parameter variable">-f</span> docker-compose.yml <span class="token parameter variable">-f</span> docker-compose-inits.yml run <span class="token parameter variable">--rm</span> taiga-manage createsuperuser</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="启动并运行" tabindex="-1"><a class="header-anchor" href="#启动并运行"><span>启动并运行</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> compose up <span class="token parameter variable">-d</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="配置nginx代理" tabindex="-1"><a class="header-anchor" href="#配置nginx代理"><span>配置NGINX代理</span></a></h2><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">server {</span>
<span class="line">  server_name taiga.mycompany.com;</span>
<span class="line"></span>
<span class="line">  location / {</span>
<span class="line">    proxy_set_header Host $http_host;</span>
<span class="line">    proxy_set_header X-Real-IP $remote_addr;</span>
<span class="line">    proxy_set_header X-Scheme $scheme;</span>
<span class="line">    proxy_set_header X-Forwarded-Proto $scheme;</span>
<span class="line">    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span>
<span class="line">    proxy_redirect off;</span>
<span class="line">    proxy_pass http://localhost:9000/;</span>
<span class="line">  }</span>
<span class="line"></span>
<span class="line">  # Events</span>
<span class="line">  location /events {</span>
<span class="line">      proxy_pass http://localhost:9000/events;</span>
<span class="line">      proxy_http_version 1.1;</span>
<span class="line">      proxy_set_header Upgrade $http_upgrade;</span>
<span class="line">      proxy_set_header Connection &quot;upgrade&quot;;</span>
<span class="line">      proxy_set_header Host $host;</span>
<span class="line">      proxy_connect_timeout 7d;</span>
<span class="line">      proxy_send_timeout 7d;</span>
<span class="line">      proxy_read_timeout 7d;</span>
<span class="line">  }</span>
<span class="line"></span>
<span class="line">  # TLS: Configure your TLS following the best practices inside your company</span>
<span class="line">  # Logs and other configurations</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><blockquote><p>在生产环境中安装 Taiga: https://docs.taiga.io/setup-production.html#setup-prod-with-docker</p></blockquote>`,38)])])}const d=n(l,[["render",c]]),r=JSON.parse('{"path":"/devops/taiga/start_docker.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1752747784000,"contributors":[{"name":"Hankin","username":"Hankin","email":"whq78164@gmail.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"619e8fa004878f73536aef1148b73bedff1f7608","time":1752747784000,"email":"whq78164@gmail.com","author":"Hankin","message":"ADD taiga"}]},"filePathRelative":"devops/taiga/start_docker.md"}');export{d as comp,r as data};
