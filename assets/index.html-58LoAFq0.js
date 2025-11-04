import{_ as n,c as a,e,o as l}from"./app-DDw_-8DT.js";const p={};function t(i,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="官方资源" tabindex="-1"><a class="header-anchor" href="#官方资源"><span>官方资源</span></a></h2><ul><li>项目主页：https://github.com/kestra-io/kestra</li><li>docker镜像：https://hub.docker.com/r/kestra/kestra/tags</li><li>安装文档：https://kestra.io/docs/installation/docker</li><li>基础示例：https://kestra.io/docs/tutorial/fundamentals</li></ul><h2 id="安装启动" tabindex="-1"><a class="header-anchor" href="#安装启动"><span>安装启动</span></a></h2><h3 id="拉取镜像" tabindex="-1"><a class="header-anchor" href="#拉取镜像"><span>拉取镜像</span></a></h3><p>去官方网站，查看最新的镜像版本。生产环境建议固化版本号。如：<code>v0.23.4</code></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 拉取镜像</span></span>
<span class="line"><span class="token function">docker</span> pull kestra/kestra:v0.23.4</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置数据库" tabindex="-1"><a class="header-anchor" href="#配置数据库"><span>配置数据库</span></a></h3><p>官方的入门示例没挂载数据卷，没连接外部数据库(默认H2数据库)。按以下修改使其更符合生产环境。</p><p>应用配置文件 <code>application.yaml</code>：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">datasources</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">postgres</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">url</span><span class="token punctuation">:</span> jdbc<span class="token punctuation">:</span>postgresql<span class="token punctuation">:</span>//postgres<span class="token punctuation">:</span>5432/kestra</span>
<span class="line">    <span class="token key atrule">driverClassName</span><span class="token punctuation">:</span> org.postgresql.Driver</span>
<span class="line">    <span class="token key atrule">username</span><span class="token punctuation">:</span> kestra</span>
<span class="line">    <span class="token key atrule">password</span><span class="token punctuation">:</span> k3str4</span>
<span class="line"><span class="token key atrule">kestra</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">basicAuth</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line">      <span class="token key atrule">username</span><span class="token punctuation">:</span> <span class="token string">&quot;admin@kestra.io&quot;</span> <span class="token comment"># it must be a valid email address</span></span>
<span class="line">      <span class="token key atrule">password</span><span class="token punctuation">:</span> kestra</span>
<span class="line">  <span class="token key atrule">repository</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> postgres</span>
<span class="line">  <span class="token key atrule">storage</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> local</span>
<span class="line">    <span class="token key atrule">local</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">basePath</span><span class="token punctuation">:</span> <span class="token string">&quot;/app/data&quot;</span></span>
<span class="line">  <span class="token key atrule">queue</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> postgres</span>
<span class="line">  <span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">tmpDir</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/tmp/kestra-wd/tmp&quot;</span></span>
<span class="line">  <span class="token key atrule">url</span><span class="token punctuation">:</span> <span class="token string">&quot;http://localhost:8080/&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上配置取自官方仓库的 <a href="https://github.com/kestra-io/kestra/blob/develop/docker-compose.yml" target="_blank" rel="noopener noreferrer">docker-compose.yml</a> 文件。</p><h3 id="启动容器" tabindex="-1"><a class="header-anchor" href="#启动容器"><span>启动容器</span></a></h3><ol><li>docker启动</li></ol><ul><li>https://kestra.io/docs/installation/docker</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># --network host</span></span>
<span class="line"><span class="token comment"># -v $(pwd)/plugins:/app/plugins 挂载插件目录可能会导致扩展插件加载失败 </span></span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> kestra <span class="token parameter variable">--restart</span> unless-stopped <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-p</span> <span class="token number">8080</span>:8080 <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">--user</span><span class="token operator">=</span>root <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-v</span> <span class="token environment constant">$PWD</span>/application.yaml:/etc/config/application.yaml <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/confs:/app/confs <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/data:/app/data <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-v</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span>/secrets:/app/secrets <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-v</span> /var/run/docker.sock:/var/run/docker.sock <span class="token punctuation">\\</span></span>
<span class="line"> <span class="token parameter variable">-v</span> /tmp:/tmp <span class="token punctuation">\\</span></span>
<span class="line"> kestra/kestra:v0.23.4 server standalone <span class="token parameter variable">--config</span> /etc/config/application.yaml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>docker compose启动</li></ol><ul><li>https://kestra.io/docs/installation/docker-compose</li></ul><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">postgres-data</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> local</span>
<span class="line">  <span class="token key atrule">kestra-data</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">driver</span><span class="token punctuation">:</span> local</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">postgres</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> postgres</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> postgres<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/var/lib/postgresql/data</span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">POSTGRES_DB</span><span class="token punctuation">:</span> kestra</span>
<span class="line">      <span class="token key atrule">POSTGRES_USER</span><span class="token punctuation">:</span> kestra</span>
<span class="line">      <span class="token key atrule">POSTGRES_PASSWORD</span><span class="token punctuation">:</span> k3str4</span>
<span class="line">    <span class="token key atrule">healthcheck</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">test</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&quot;CMD-SHELL&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;pg_isready -d $\${POSTGRES_DB} -U $\${POSTGRES_USER}&quot;</span><span class="token punctuation">]</span></span>
<span class="line">      <span class="token key atrule">interval</span><span class="token punctuation">:</span> 30s</span>
<span class="line">      <span class="token key atrule">timeout</span><span class="token punctuation">:</span> 10s</span>
<span class="line">      <span class="token key atrule">retries</span><span class="token punctuation">:</span> <span class="token number">10</span></span>
<span class="line"></span>
<span class="line">  <span class="token key atrule">kestra</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> kestra/kestra<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">pull_policy</span><span class="token punctuation">:</span> always</span>
<span class="line">    <span class="token comment"># Note that this setup with a root user is intended for development purpose.</span></span>
<span class="line">    <span class="token comment"># Our base image runs without root, but the Docker Compose implementation needs root to access the Docker socket</span></span>
<span class="line">    <span class="token key atrule">user</span><span class="token punctuation">:</span> <span class="token string">&quot;root&quot;</span></span>
<span class="line">    <span class="token key atrule">command</span><span class="token punctuation">:</span> server standalone</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> kestra<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/app/storage</span>
<span class="line">      <span class="token punctuation">-</span> /var/run/docker.sock<span class="token punctuation">:</span>/var/run/docker.sock</span>
<span class="line">      <span class="token punctuation">-</span> /tmp/kestra<span class="token punctuation">-</span>wd<span class="token punctuation">:</span>/tmp/kestra<span class="token punctuation">-</span>wd</span>
<span class="line">    <span class="token comment"># 可以直接指定环境变量文件。环境变量名记得以 \`ENV_\` 开头。如 \`ENV_MY_HOST\`,在流程中通过 \`{{ envs.my_host }}\` 访问。</span></span>
<span class="line">    <span class="token key atrule">env_file</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ./.env</span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment"># 名为 \`ENV_MY_VARIABLE\` 的环境变量可以通过 \`{{ envs.my_variable }}\` 访问。</span></span>
<span class="line">      <span class="token key atrule">ENV_MY_VARIABLE</span><span class="token punctuation">:</span> extra variable value</span>
<span class="line">      <span class="token key atrule">KESTRA_CONFIGURATION</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">        datasources:</span>
<span class="line">          postgres:</span>
<span class="line">            url: jdbc:postgresql://postgres:5432/kestra</span>
<span class="line">            driverClassName: org.postgresql.Driver</span>
<span class="line">            username: kestra</span>
<span class="line">            password: k3str4</span>
<span class="line">        kestra:</span>
<span class="line">          server:</span>
<span class="line">            basicAuth:</span>
<span class="line">              enabled: false</span>
<span class="line">              username: &quot;admin@localhost.dev&quot; # it must be a valid email address</span>
<span class="line">              password: kestra</span>
<span class="line">          repository:</span>
<span class="line">            type: postgres</span>
<span class="line">          storage:</span>
<span class="line">            type: local</span>
<span class="line">            local:</span>
<span class="line">              basePath: &quot;/app/storage&quot;</span>
<span class="line">          queue:</span>
<span class="line">            type: postgres</span>
<span class="line">          tasks:</span>
<span class="line">            tmpDir:</span>
<span class="line">              path: /tmp/kestra-wd/tmp</span>
<span class="line">          url: http://localhost:8080/</span></span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;8080:8080&quot;</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;8081:8081&quot;</span></span>
<span class="line">    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">postgres</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">condition</span><span class="token punctuation">:</span> service_started</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="流程示例" tabindex="-1"><a class="header-anchor" href="#流程示例"><span>流程示例</span></a></h2><p>SSH登录服务器执行命令流程示例：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">id</span><span class="token punctuation">:</span> update_test_odoo</span>
<span class="line"><span class="token key atrule">namespace</span><span class="token punctuation">:</span> yourname.dev</span>
<span class="line"><span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> remote_opt</span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> io.kestra.plugin.fs.ssh.Command</span>
<span class="line">    <span class="token key atrule">commands</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> cd /home/yourname/erp.test/</span>
<span class="line">      <span class="token punctuation">-</span> echo &quot;$(date &#39;+%Y<span class="token punctuation">-</span>%m<span class="token punctuation">-</span>%d_%H<span class="token punctuation">:</span>%M&#39;) update.sh&quot; <span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span> kestra.log</span>
<span class="line">      <span class="token punctuation">-</span> ./update.sh</span>
<span class="line">    <span class="token key atrule">host</span><span class="token punctuation">:</span> 172.16.160.9</span>
<span class="line">    <span class="token key atrule">username</span><span class="token punctuation">:</span> yourname</span>
<span class="line">    <span class="token key atrule">password</span><span class="token punctuation">:</span> yourname123</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,21)])])}const o=n(p,[["render",t]]),u=JSON.parse('{"path":"/devops/kestra/","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1751895209000,"contributors":[{"name":"Hankin","username":"Hankin","email":"whq78164@gmail.com","commits":3,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"efee5832348a448d41c83c49df42727545990f6b","time":1751895209000,"email":"hankin@catmes.com","author":"Hankin","message":"UPDATE docker-compose.yml for kestra"},{"hash":"66a39994f54fb6eb2b01dcebbcff2220164c04a9","time":1751885484000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE docker-compose.yml for kestra"},{"hash":"cd555a58414909a3498092ad3c0726cc124fa163","time":1751616128000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE kestra"}]},"filePathRelative":"devops/kestra/README.md"}');export{o as comp,u as data};
