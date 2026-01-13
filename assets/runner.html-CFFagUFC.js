import{_ as e,c as s,e as a,o as i}from"./app-u0RXAV85.js";const l={};function r(t,n){return i(),s("div",null,[...n[0]||(n[0]=[a(`<h2 id="runner介绍" tabindex="-1"><a class="header-anchor" href="#runner介绍"><span>Runner介绍</span></a></h2><p>GitLab中的 <code>Runner</code> 是 GitLab <code>CI/CD</code> 的关键组件，负责执行 <code>.gitlab-ci.yml</code> 文件中定义的作业。</p><p><code>GitLab Runner</code> 本质上是一个独立的应用程序，它会与 GitLab 服务器建立连接，接收来自 GitLab 的作业请求，并在本地环境中执行这些作业。</p><p>当代码仓库中有新的提交触发了 CI/CD Pipeline 时，GitLab 会将作业分配给合适的 Runner 来执行。</p><h2 id="runner类型" tabindex="-1"><a class="header-anchor" href="#runner类型"><span>Runner类型</span></a></h2><ol><li>实例运行器：适用于所有的群组和项目。由系统管理员创建。</li><li>群组Runner: 适用于指定群组下的所有项目。由群组管理员创建。</li><li>项目Runner: 适用于指定项目。由项目管理员创建。</li></ol><h2 id="创建runner" tabindex="-1"><a class="header-anchor" href="#创建runner"><span>创建Runner</span></a></h2><ol><li>标签：可填写多个标签，用逗号 <code>,</code> 隔开。<code>.gitlab-ci.yml</code> 文件中的具体任务，也要填写具体标签，才能被运行。</li><li>新手推荐勾选 <code>运行未打标签的作业</code>。默认没打标签的任务，才可以匹配到 <code>Runner</code>，从而被正常被运行。</li><li>注册和安装Runner: 在远程机器上，安装Runner客户端程序，配合 <code>GitLab</code> 服务端工作。</li></ol><h2 id="注册和安装runner" tabindex="-1"><a class="header-anchor" href="#注册和安装runner"><span>注册和安装Runner</span></a></h2><p>以Linux为例：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 下载Runner客户端可执行文件</span>
<span class="line">sudo curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64</span>
<span class="line"></span>
<span class="line"># 赋予可执行权限</span>
<span class="line">sudo chmod +x /usr/local/bin/gitlab-runner</span>
<span class="line"></span>
<span class="line"># Create a GitLab Runner user</span>
<span class="line">sudo useradd --comment &#39;GitLab Runner&#39; --create-home gitlab-runner --shell /bin/bash</span>
<span class="line"></span>
<span class="line"># Install and run as a service</span>
<span class="line">sudo gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner</span>
<span class="line">sudo gitlab-runner start</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装完成后，执行 <code>注册命令</code>，生成包含GitLab服务端的url地址和密钥token的配置文件，Runner才能正常工作。</p><p>注册命令如下所示：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">gitlab-runner register  --url http://172.16.160.10:8929  --token glrt-t2_xxxxxxxxxx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>注册 Runner 后，<code>token</code> 密钥，将储存在客户端的配置文件 <code>config.toml</code> 中，并且无法从界面中再次访问。</p><h2 id="runner配置和优化" tabindex="-1"><a class="header-anchor" href="#runner配置和优化"><span>Runner配置和优化</span></a></h2><p>以上操作后，<code>Runner</code> 会以守护进程的方式，在客户端机器后台常驻运行。</p><p>运行命令 <code>systemctl status gitlab-runner</code> 查看，内容如下所示：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">● gitlab-runner.service - GitLab Runner</span>
<span class="line">     Loaded: loaded (/etc/systemd/system/gitlab-runner.service; enabled; preset: enabled)</span>
<span class="line">     Active: active (running) since Sat 2025-04-26 21:42:18 CST; 28s ago</span>
<span class="line">   Main PID: 1117278 (gitlab-runner)</span>
<span class="line">      Tasks: 12 (limit: 9473)</span>
<span class="line">     Memory: 29.4M</span>
<span class="line">        CPU: 205ms</span>
<span class="line">     CGroup: /system.slice/gitlab-runner.service</span>
<span class="line">             └─1117278 /usr/local/bin/gitlab-runner run --config /etc/gitlab-runner/config.toml --working-directory /home/gitlab-runner --service gitlab-runner --user gitlab-runner</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>config.toml</code> 文件：</p><ul><li><code>/etc/gitlab-runner/config.toml</code>: 全局配置。</li><li><code>/home/yourname/.gitlab-runner/config.toml</code>: 个性配置。此前运行 <code>gitlab-runner register</code> 命令时生成。</li></ul><p>注：由于 <code>配置文件路径</code> 和 <code>用户权限</code>，可能导致某些作业，无法被正确执行。解决方法有如下几种：</p><ol><li>从 <code>~/.gitlab-runner/config.toml</code> 复制，更新 <code>/etc/gitlab-runner/config.toml</code> 文件。然后重启服务。</li><li>重新配置系统服务文件（推荐）： <code>/etc/systemd/system/gitlab-runner.service</code>。</li></ol><h3 id="重新配置gitlab-runner系统服务" tabindex="-1"><a class="header-anchor" href="#重新配置gitlab-runner系统服务"><span>重新配置gitlab-runner系统服务</span></a></h3><p>由命令 <code>systemctl status gitlab-runner</code> 可知，服务配置文件路径为：<code>/etc/systemd/system/gitlab-runner.service</code></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">sudo vim /etc/systemd/system/gitlab-runner.service</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>如下所示：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">[Unit]</span>
<span class="line">Description=GitLab Runner</span>
<span class="line">ConditionFileIsExecutable=/usr/local/bin/gitlab-runner</span>
<span class="line"></span>
<span class="line">After=network.target</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">[Service]</span>
<span class="line">StartLimitInterval=5</span>
<span class="line">StartLimitBurst=10</span>
<span class="line">ExecStart=/usr/local/bin/gitlab-runner run</span>
<span class="line"></span>
<span class="line">Restart=always</span>
<span class="line"></span>
<span class="line">RestartSec=120</span>
<span class="line">EnvironmentFile=-/etc/sysconfig/gitlab-runner</span>
<span class="line"></span>
<span class="line"># 下面这两个配置项比较重要</span>
<span class="line">WorkingDirectory=/home/yourname</span>
<span class="line">User=yourname</span>
<span class="line"></span>
<span class="line"># StandardOutput=file:/root/output.log</span>
<span class="line"># StandardError=file:/root/output.err.log</span>
<span class="line">[Install]</span>
<span class="line">WantedBy=multi-user.target</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>主要是在 <code>[Service]</code> 里面，添加 <code>WorkingDirectory</code> 和 <code>User</code> 两个配置项，并更改 <code>ExecStart</code> 配置。</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 变更前</span>
<span class="line">ExecStart=/usr/local/bin/gitlab-runner &quot;run&quot; &quot;--config&quot; &quot;/etc/gitlab-runner/config.toml&quot; &quot;--working-directory&quot; &quot;/home/gitlab-runner&quot; &quot;--service&quot; &quot;gitlab-runner&quot; &quot;--user&quot; &quot;gitlab-runner&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>变更后</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">ExecStart=/usr/local/bin/gitlab-runner &quot;run&quot; &quot;--config&quot; &quot;/home/yourname/.gitlab-runner/config.toml&quot; &quot;--working-directory&quot; &quot;/home/yourname&quot; &quot;--service&quot; &quot;gitlab-runner&quot; &quot;--user&quot; &quot;yourname&quot;</span>
<span class="line"></span>
<span class="line"># 或者简单点，如下面这样写也行</span>
<span class="line"># ExecStart=/usr/local/bin/gitlab-runner run</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重载服务配置：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">systemctl daemon-reload</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div>`,34)])])}const d=e(l,[["render",r]]),u=JSON.parse('{"path":"/devops/gitlab/runner.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1748484626000,"contributors":[{"name":"Hankin","username":"Hankin","email":"whq78164@gmail.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"a3e8cc4a74bd7085609fccf291a7daa63b1bef60","time":1748484626000,"email":"whq78164@gmail.com","author":"Hankin","message":"ADD gitlab for devops"}]},"filePathRelative":"devops/gitlab/runner.md"}');export{d as comp,u as data};
