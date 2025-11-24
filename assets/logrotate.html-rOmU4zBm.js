import{_ as n,c as a,e,o as l}from"./app-uMlBmDag.js";const i={};function d(o,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="logrotate介绍" tabindex="-1"><a class="header-anchor" href="#logrotate介绍"><span>logrotate介绍</span></a></h2><p>Logrotate 是 Linux 系统中用于自动化管理日志文件的工具，能够高效、安全地轮转、压缩、清理日志文件，防止磁盘空间被耗尽，同时保留必要的历史日志以便问题排查。</p><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装"><span>安装</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">apt</span> <span class="token function">install</span> <span class="token function">logrotate</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h2><ul><li>rotate N 保留指定数量的历史日志（如 rotate 7 保留最近7份）。</li><li>maxage 删除超过天数的旧日志（如 maxage 30 删除30天前的文件）。</li><li>dateext：在日志名中添加日期后缀（如 app.log-20250508.gz），便于按时间归档。</li><li>olddir：将旧日志移动到指定目录（如 olddir /var/log/archive）。</li><li>weekly：按周进行轮转。优先级低于 size（如同时配置时，达到大小立即触发）。可用值：daily/weekly/monthly</li><li>size N 配置文件达到指定大小时触发轮转（如 <code>size 100M</code>）。</li><li>notifempty：空日志文件不轮转。</li></ul><h3 id="全局主配置文件" tabindex="-1"><a class="header-anchor" href="#全局主配置文件"><span>全局主配置文件</span></a></h3><p>路径：<code>/etc/logrotate.conf</code>，定义全局默认参数（如 compress、weekly）。</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line"># see &quot;man logrotate&quot; for details</span>
<span class="line"></span>
<span class="line"># global options do not affect preceding include directives</span>
<span class="line"></span>
<span class="line"># rotate log files weekly</span>
<span class="line">weekly</span>
<span class="line"></span>
<span class="line"># keep 4 weeks worth of backlogs</span>
<span class="line">rotate 4</span>
<span class="line"></span>
<span class="line"># create new (empty) log files after rotating old ones</span>
<span class="line">create</span>
<span class="line"></span>
<span class="line"># use date as a suffix of the rotated file</span>
<span class="line">#dateext</span>
<span class="line"></span>
<span class="line"># uncomment this if you want your log files compressed</span>
<span class="line">#compress</span>
<span class="line"></span>
<span class="line"># packages drop log rotation information into this directory</span>
<span class="line">include /etc/logrotate.d</span>
<span class="line"></span>
<span class="line"># system-specific logs may also be configured here.</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="子配置文件" tabindex="-1"><a class="header-anchor" href="#子配置文件"><span>子配置文件</span></a></h3><p>路径：<code>/etc/logrotate.d/</code> 目录下的文件（如 <code>nginx</code>、<code>mysql</code>、<code>odoo</code>），针对特定服务覆盖全局设置。</p><p>在 <code>/etc/logrotate.d/</code>下创建配置文件（如odoo）：</p><p><code>/etc/logrotate.d/odoo</code>:</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line"># /etc/logrotate.d/odoo文件</span>
<span class="line"># /var/log/odoo/*.log {</span>
<span class="line">/var/log/odoo/odoo.log {</span>
<span class="line">    daily          # 按天轮转</span>
<span class="line">    missingok      # 日志不存在时不报错</span>
<span class="line">    rotate 30      # 保留30天的日志</span>
<span class="line">    compress       # 压缩旧日志</span>
<span class="line">    delaycompress  # 延迟压缩（下次轮转时压缩）</span>
<span class="line">    notifempty     # 空日志不轮转</span>
<span class="line">    create 640 odoo odoo  # 创建新日志文件（权限、用户、组）</span>
<span class="line">    sharedscripts  # 脚本只执行一次</span>
<span class="line">    postrotate</span>
<span class="line">        # 向Odoo主进程发送USR1信号，通知其重新打开日志文件</span>
<span class="line">        # kill -USR1 $(cat /var/run/odoo/odoo.pid 2&gt;/dev/null) 2&gt;/dev/null || true</span>
<span class="line">        docker kill -s USR1 odoo_container_name</span>
<span class="line"></span>
<span class="line">        # 向Promtail发送HUP信号，通知其重新加载配置文件</span>
<span class="line">        docker kill -s HUP promtail_container_name</span>
<span class="line">    endscript</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>odoo.conf</code>:</p><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code class="language-ini"><span class="line"><span class="token key attr-name">logfile</span> <span class="token punctuation">=</span> <span class="token value attr-value">/var/log/odoo/odoo.log</span></span>
<span class="line"><span class="token comment"># Odoo默认可能不生成PID文件。添加pidfile</span></span>
<span class="line"><span class="token key attr-name">pidfile</span> <span class="token punctuation">=</span> <span class="token value attr-value">/var/run/odoo/odoo.pid</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置参数可以抽离公共部分：</p><p><code>/etc/logrotate.d/odoo</code>:</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line"># 全局配置</span>
<span class="line">daily</span>
<span class="line">missingok</span>
<span class="line">rotate 30</span>
<span class="line">compress</span>
<span class="line">delaycompress</span>
<span class="line">notifempty</span>
<span class="line">sharedscripts</span>
<span class="line">su myname crontab</span>
<span class="line">create 0660 sshd crontab</span>
<span class="line"># 组名crontab已存在，无需修改</span>
<span class="line">copytruncate</span>
<span class="line"># 确保容器日志安全轮转</span>
<span class="line">/home/myname/erp/odoo/log/odoo.log {</span>
<span class="line">    postrotate</span>
<span class="line">        docker kill -s USR1 odooweb      # 通知Odoo重载日志</span>
<span class="line">        docker kill -s HUP promtail       # 通知Promtail重载配置</span>
<span class="line">    endscript</span>
<span class="line">}</span>
<span class="line"># 测试环境日志</span>
<span class="line">/home/myname/erp.test/odoo/log/odoo.log {</span>
<span class="line">    postrotate</span>
<span class="line">        docker kill -s USR1 odoowebtest  # 通知测试环境</span>
<span class="line">        docker kill -s HUP promtail       # 通知Promtail</span>
<span class="line">    endscript</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>日志所属目录 <code>不能</code> 为 <code>777</code>，可设置为 <code>770</code> 。否则 logrotate 会拒绝操作，提示：<code>权限不够</code></li><li>注释 <code>不要</code> 加在每行配置项后面。如：<code>create 0640 appuser appgroup # 注释</code>。否则会报错，参数过多。</li><li>su 配置指令，要确保能正常执行。把能运行的用户，加入用户组：<code>sudo usermod -aG crontab myname</code></li></ol><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用"><span>使用</span></a></h2><h3 id="自动运行cron定时任务" tabindex="-1"><a class="header-anchor" href="#自动运行cron定时任务"><span>自动运行cron定时任务</span></a></h3><p>通过 <code>cron</code> 任务每日执行（路径：<code>/etc/cron.daily/logrotate</code>）</p><h3 id="手动执行" tabindex="-1"><a class="header-anchor" href="#手动执行"><span>手动执行</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 调试模式：显示计划，不实际修改文件</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">logrotate</span> <span class="token parameter variable">-d</span> /etc/logrotate.d/odoo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 强制立即执行</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">logrotate</span> <span class="token parameter variable">-f</span> /etc/logrotate.d/odoo</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,25)])])}const p=n(i,[["render",d]]),r=JSON.parse('{"path":"/devops/logrotate.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1753254692000,"contributors":[{"name":"Hankin","username":"Hankin","email":"whq78164@gmail.com","commits":4,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"6d7249246f4ea166453506b0552b6b2d6fe0e750","time":1753254692000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE promtail"},{"hash":"e8519aa41da5fe2f3877981a6c3e47115b07b22c","time":1752418311000,"email":"hankin@catmes.com","author":"Hankin","message":"ADD linux/systemd.md. UPDATE promtail"},{"hash":"2532d20cad7caa42d194628f1d1086e92212170a","time":1752227037000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE promtail, loki"},{"hash":"39d821a62f30206a59f608169caef96118afa4c4","time":1752206694000,"email":"whq78164@gmail.com","author":"Hankin","message":"ADD logrotate. ADD grafana, promtail, loki"}]},"filePathRelative":"devops/logrotate.md"}');export{p as comp,r as data};
