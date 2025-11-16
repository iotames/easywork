import{_ as e,c as n,e as a,o as i}from"./app-B2AIBiSr.js";const l={};function d(c,s){return i(),n("div",null,[...s[0]||(s[0]=[a(`<h2 id="systemctl和systemd简介" tabindex="-1"><a class="header-anchor" href="#systemctl和systemd简介"><span>systemctl和systemd简介</span></a></h2><ul><li>https://github.com/systemd/systemd</li></ul><p><code>systemd</code> 即： <code>system daemon</code>。源于Unix中的一个惯例：在Unix中常以 <code>d</code> 作为系统守护进程（英语：daemon）的后缀标识。</p><p><code>systemctl</code> 是 <code>systemd</code> 的一个命令行工具，用于管理 <code>systemd</code> 服务。<code>service</code> 则是Linux系统的另一种服务管理方式。</p><h2 id="systemctl-和-service" tabindex="-1"><a class="header-anchor" href="#systemctl-和-service"><span>systemctl 和 service</span></a></h2><ol><li>所属体系: <code>systemctl</code> 属于 <code>systemd</code> init系统，<code>service</code> 属于早期的 <code>SysVinit</code> init系统</li><li>控制范围: <code>service</code> 命令一般只能 启动、停止、重启和查看服务，<code>systemctl</code> 命令则更广。</li><li>开机流程: 开机系统初始化时，<code>SysVinit</code> 让多个任务依次启动，<code>systemd</code> 则是梳理依赖关系，并行启动所有任务。</li><li>应用目录: <code>service</code> 主要在 <code>/etc/init.d</code>，而 <code>systemctl</code> 在 <code>/etc/systemd/system</code> 等目录。</li></ol><p>service和systemctl命令对比：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 启动，停止，重启(先stop后再start)，查看状态</span></span>
<span class="line"><span class="token function">service</span> redis start<span class="token operator">|</span>stop<span class="token operator">|</span>restart<span class="token operator">|</span>status</span>
<span class="line">systemctl start httpd.service</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看所有已启动服务列表，以及每个服务的运行级别。</span></span>
<span class="line"><span class="token function">chkconfig</span> <span class="token parameter variable">--list</span></span>
<span class="line">systemctl list-units <span class="token parameter variable">--type</span><span class="token operator">=</span>service</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置开机启动，不开机启动</span></span>
<span class="line"><span class="token function">chkconfig</span> httpd on<span class="token operator">|</span>off</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span><span class="token operator">|</span>disable httpd.service</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="systemd-配置文件目录" tabindex="-1"><a class="header-anchor" href="#systemd-配置文件目录"><span>systemd 配置文件目录</span></a></h2><ol><li>添加自定义服务： <code>/etc/systemd/system/</code></li><li>修改系统服务：<code>/usr/lib/systemd/system/</code></li></ol><ul><li><p><code>/usr/lib/systemd/system/</code>: 存放系统级脚本，开机不登录就能运行。启动脚本的配置主要放这，类似 <code>/etc/init.d/</code></p></li><li><p><code>/lib/systemd/system/</code>: 文件从 <code>/usr/lib/systemd/system/</code> 拷贝而来，故存放文件基本相同。</p></li><li><p><code>/etc/systemd/system/</code>: 存放文件和目录最少，为 <code>/lib/systemd/system/</code> 目录下的软连接。优先级最高。</p></li><li><p><code>/run/systemd/system/</code>：保存系统执行产生的服务脚本，优先级比 <code>/usr/lib/systemd/system/</code> 高。</p></li><li><p><code>/usr/lib/systemd/user/</code>: 存放用户级脚本，登录后才可运行</p></li><li><p><code>~/.config/systemd/user/</code>:仅当前用户可用。</p></li></ul><h2 id="systemd自定义服务示例" tabindex="-1"><a class="header-anchor" href="#systemd自定义服务示例"><span>systemd自定义服务示例</span></a></h2><p>例：<code>vim /etc/systemd/system/qddns.service</code>:</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">[Unit]</span>
<span class="line">Description=DDNS timer</span>
<span class="line">After=network.target</span>
<span class="line"></span>
<span class="line">[Service]</span>
<span class="line">WorkingDirectory=/root/qddns</span>
<span class="line"># PIDFile=/run/qddns.pid</span>
<span class="line"># ExecStartPre=/usr/bin/rm -f /run/qddns.pid</span>
<span class="line">ExecStart=/root/qddns/qddns</span>
<span class="line"># ExecReload=/bin/kill -s HUP $MAINPID</span>
<span class="line"># ExecStop=/bin/kill -s QUIT $MAINPID</span>
<span class="line">User=root</span>
<span class="line">Restart=on-failure</span>
<span class="line">RestartSec=300</span>
<span class="line"># KillSignal=SIGQUIT</span>
<span class="line">TimeoutStopSec=10</span>
<span class="line"># KillMode=control-group</span>
<span class="line">StandardOutput=file:/root/qddns/output.log</span>
<span class="line"># StandardError=file:/root/qddns/output.err.log</span>
<span class="line"></span>
<span class="line">[Install]</span>
<span class="line">WantedBy=multi-user.target</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>常用命令：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 重载配置文件</span></span>
<span class="line">systemctl daemon-reload</span>
<span class="line"></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> qddns</span>
<span class="line">systemctl status qddns</span>
<span class="line">systemctl start qddns</span>
<span class="line">systemctl stop qddns</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="systemd系统服务示例" tabindex="-1"><a class="header-anchor" href="#systemd系统服务示例"><span>systemd系统服务示例</span></a></h2><p><code>cat /usr/lib/systemd/system/ssh.service</code>:</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">[Unit]</span>
<span class="line">Description=OpenBSD Secure Shell server</span>
<span class="line">Documentation=man:sshd(8) man:sshd_config(5)</span>
<span class="line">After=network.target auditd.service</span>
<span class="line">ConditionPathExists=!/etc/ssh/sshd_not_to_be_run</span>
<span class="line"># Wants=sshd-keygen.service</span>
<span class="line"></span>
<span class="line">[Service]</span>
<span class="line">EnvironmentFile=-/etc/default/ssh</span>
<span class="line">ExecStartPre=/usr/sbin/sshd -t</span>
<span class="line">ExecStart=/usr/sbin/sshd -D $SSHD_OPTS</span>
<span class="line">ExecReload=/usr/sbin/sshd -t</span>
<span class="line">ExecReload=/bin/kill -HUP $MAINPID</span>
<span class="line">KillMode=process</span>
<span class="line">Restart=on-failure</span>
<span class="line">RestartPreventExitStatus=255</span>
<span class="line">Type=notify</span>
<span class="line">RuntimeDirectory=sshd</span>
<span class="line">RuntimeDirectoryMode=0755</span>
<span class="line"># RestartSec=42s</span>
<span class="line"></span>
<span class="line">[Install]</span>
<span class="line">WantedBy=multi-user.target</span>
<span class="line">Alias=sshd.service</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="unit单元" tabindex="-1"><a class="header-anchor" href="#unit单元"><span>Unit单元</span></a></h2><p>在 <code>systemd</code> 管理体系中，被管理的 <code>deamon</code> (守护进程)称作 <code>unit</code> (单元)，通过 <code>systemctl</code> 命令控制。 <code>target</code> 取代了initd的RunLevel(运行等级), <code>target</code> (服务组)就是一组unit(服务)，当启动某个target时就会启动里面的所有 <code>unit</code>。</p><p>unit的常见类型：</p><ul><li>*.service 定义系统服务</li><li>*.target 模拟实现 <code>运行级别</code></li><li>*.device 定义内核识别的设备</li><li>*.mount 定义文件系统的挂载点</li><li>*.socket 标识进程间通信用到的socket文件</li><li>*.snapshot 管理系统快照</li><li>*.swap 标识swap设备</li><li>*.automount 定义文件系统自动点设备</li><li>*.path 定义文件系统中的一文件或目录</li></ul><p>常见 service 单元:</p><ul><li>/usr/lib/systemd/system/cron.service</li><li>/usr/lib/systemd/system/ssh.service</li><li>/usr/lib/systemd/system/rc-local.service</li></ul><h2 id="unit-file-配置文件解析" tabindex="-1"><a class="header-anchor" href="#unit-file-配置文件解析"><span>Unit File 配置文件解析</span></a></h2><h3 id="unit" tabindex="-1"><a class="header-anchor" href="#unit"><span>[Unit]</span></a></h3><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">[Unit]</span>
<span class="line">Description=服务描述</span>
<span class="line">Documentation=文档地址</span>
<span class="line">After=说明本服务是在哪个 daemon 启动之后才启动</span>
<span class="line">Before=在什么服务启动前最好启动本服务</span>
<span class="line">Requies=依赖到其它的units；强依赖，被依赖的units无法激活时，当前的unit即无法激活；</span>
<span class="line">Wants=依赖到其它的units；弱依赖；</span>
<span class="line">Confilcts=定义units 的冲突关系；</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>After 和 Before 只涉及启动顺序，不涉及依赖关系</li></ul><h3 id="service" tabindex="-1"><a class="header-anchor" href="#service"><span>[Service]</span></a></h3><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">[Service]</span>
<span class="line">Type=simple #服务类型</span>
<span class="line">User=用户名 #服务执行的用户，默认为root，其他用户管理systemd需经过root同意</span>
<span class="line">Environment=&quot;ENV_KEY=ENV_VALUE&quot; #定义环境变量</span>
<span class="line"></span>
<span class="line"># 执行的命令必须是绝对路径(脚本或进程)，不能执行shell的内部命令</span>
<span class="line">ExecStart=启动服务执行的命令</span>
<span class="line">ExecReload=重启服务执行的命令</span>
<span class="line">ExecStop=停止服务执行的命令</span>
<span class="line">ExecStartPre=启动服务之前执行的命令</span>
<span class="line">ExecStartPost字段：启动服务之后执行的命令</span>
<span class="line">ExecStopPost=停止服务之后执行的命令</span>
<span class="line"></span>
<span class="line">TimeoutSec=若这个服务在启动或者是关闭时，因为某些缘故导致无法顺利完成，设置一个超时。</span>
<span class="line"></span>
<span class="line"># RestartSec: 自动重启服务需要间隔的时间(单位: 秒)。默认100ms</span>
<span class="line">RestartSec=42</span>
<span class="line">StandardOutput=file:/root/qddns/output.log # 定义日志文件路径</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>短线符号 <code>-</code>: 错误忽略符。所有的启动设置前，都可以短线 <code>-</code> 忽略错误。即发生错误时，不影响其他命令执行。 例: <code>EnvironmentFile=-/etc/default/ssh</code>，即使 /etc/default/ssh 文件不存在，也不抛出错误。</p></li><li><p>[Service]中的启动、重启、停止命令要求使用<code>绝对路径</code></p></li></ul><h4 id="type-启动类型" tabindex="-1"><a class="header-anchor" href="#type-启动类型"><span>Type: 启动类型</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Type字段定义启动类型。它可以设置的值如下：</span>
<span class="line">&gt; simple（默认值）：ExecStart字段启动的进程为主进程</span>
<span class="line">&gt; forking：ExecStart字段将以fork()方式启动，此时父进程将会退出，子进程将成为主进程（后台运行）</span>
<span class="line">&gt; oneshot：类似于simple，但只执行一次，Systemd 会等它执行完，才启动其他服务</span>
<span class="line">&gt; dbus：类似于simple，但会等待 D-Bus 信号后启动</span>
<span class="line">&gt; notify：类似于simple，启动结束后会发出通知信号，然后 Systemd 再启动其他服务</span>
<span class="line">&gt; idle：类似于simple，但是要等到其他任务都执行完，才会启动该服务。一种使用场合是为让该服务的输出，不与其他服务的输出相混合</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="killmode-停止方式" tabindex="-1"><a class="header-anchor" href="#killmode-停止方式"><span>KillMode: 停止方式</span></a></h4><p><code>KillMode</code>：定义 Systemd 如何 <code>停止</code> 服务。</p><ul><li>control-group（默认值）：当前控制组里面的所有子进程，都会被杀掉</li><li>process：只杀主进程</li><li>mixed：主进程将收到 SIGTERM 信号，子进程收到 SIGKILL 信号</li><li>none：没有进程会被杀掉，只是执行服务的 stop 命令。</li></ul><p>ssh(sshd)服务，设置 <code>KillMode=process</code>，表示只停止主进程，不停止子进程，即子进程打开的 SSH session 仍然保持连接。这个设置不太常见，但对 sshd 很重要，否则你停止服务的时候，会连自己打开的 SSH session 一起杀掉。</p><h4 id="restart-重启条件" tabindex="-1"><a class="header-anchor" href="#restart-重启条件"><span>Restart: 重启条件</span></a></h4><p><code>Restart</code>：定义服务在什么情况下自动重启</p><p><code>Restart=on-failure</code>: 出现任何意外的失败，重启sshd。shd 正常停止（比如执行systemctl stop命令）的情况不重启。</p><ul><li>no（默认值）：退出后不会重启</li><li>on-success：只有正常退出时（退出状态码为0），才会重启</li><li>on-failure：非正常退出时（退出状态码非0），包括被信号终止和超时，才会重启</li><li>on-abnormal：只有被信号终止和超时，才会重启</li><li>on-abort：只有在收到没有捕捉到的信号终止时，才会重启</li><li>on-watchdog：超时退出，才会重启</li><li>always：不管是什么退出原因，总是重启</li></ul><p>注：对于 <code>守护进程</code>，推荐设为 <code>on-failure</code>。对于那些允许发生错误退出的服务，可以设为 <code>on-abnormal</code>。</p><h3 id="install-定义开机启动" tabindex="-1"><a class="header-anchor" href="#install-定义开机启动"><span>[Install]: 定义开机启动</span></a></h3><p><code>target</code>: 定义了一个含有多个服务的启动目标。 Systemd 有默认的启动 <code>Target</code>。</p><ul><li><code>multi-user.target</code>：表示多用户命令行状态；</li><li><code>graphical.target</code>：表示图形用户状态，它依赖于<code>multi-user.target</code>。</li></ul><p><code>systemctl enable</code> 命令会在 <code>/etc/systemd/system/multi-user.target.wants/</code> 目录生成 <code>软连接</code>。</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">[Install]</span>
<span class="line"># 表示该服务所在的 Target。定义为开机启动项</span>
<span class="line">WantedBy=multi-user.target</span>
<span class="line">RequiredBy=被哪些unit所依赖；</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>target</code> 相关命令:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查看系统默认target。如：输出 multi-user.target, 表示这个组的所有服务，都将开机启动</span>
<span class="line">systemctl get-default</span>
<span class="line"></span>
<span class="line">#查看 multi-user.target 包含的所有服务</span>
<span class="line">systemctl list-dependencies multi-user.target</span>
<span class="line"> </span>
<span class="line">#切换到另一个 target</span>
<span class="line">#shutdown.target 就是关机状态</span>
<span class="line">systemctl isolate shutdown.target</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="systemctl命令" tabindex="-1"><a class="header-anchor" href="#systemctl命令"><span>systemctl命令</span></a></h2><ul><li>重载配置 <code>systemctl daemon-reload</code>: 安装新服务，要重载配置文件，获取更改的配置并重新生成依赖树。</li><li>注销，取消注销服务 <code>systemctl mask|unmask firewalld</code>: 服务被注销后该服务就无法通过systemctl进行启停管理。</li><li>列出所有已安装单元 <code>systemctl list-units</code></li><li>列出所有可用单元 <code>systemctl list-unit-files</code></li></ul><h3 id="服务单元" tabindex="-1"><a class="header-anchor" href="#服务单元"><span>服务单元</span></a></h3><ul><li>开机启动 <code>systemctl enable httpd.service</code>: 在 <code>/etc/systemd/system/multi-user.target.wants/</code> 下，生成软链接</li><li>启动，停止和重载服务 <code>systemctl start|stop|reload sshd</code>: 通过 <code>*.service</code> 文件配置的systemctl命令</li><li>查看服务状态 <code>systemctl status qddns.service</code> 简写 <code>systemctl status qddns</code></li><li>查看所有服务 <code>systemctl list-units --type=service</code> 可用服务: <code>systemctl list-unit-files --type=service</code></li><li>列出开机启动的服务单元 <code>systemctl list-unit-files --type service | grep enabled</code></li></ul><h3 id="定时器单元" tabindex="-1"><a class="header-anchor" href="#定时器单元"><span>定时器单元</span></a></h3><ul><li>列出开机启动的定时器单元 <code>systemctl list-unit-files --type timers | grep enabled</code></li><li>列出所有定时器: <code>systemctl list-unit-files --type timers</code> or <code>systemctl list-timers</code></li><li>常规操作同服务单元: <code>systemctl start|stop|enable|disable|status mytimer.timer</code></li></ul><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查找qddns服务</span>
<span class="line">systemctl list-unit-files --type=service | grep qddns.service</span>
<span class="line"></span>
<span class="line"># 查看系统启动模式</span>
<span class="line">systemctl get-default</span>
<span class="line"></span>
<span class="line"># 设置系统为图形界面启动</span>
<span class="line">systemctl set-default graphical.target</span>
<span class="line"></span>
<span class="line"># 查看系统环境变量</span>
<span class="line">systemctl show-environment</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="日志" tabindex="-1"><a class="header-anchor" href="#日志"><span>日志</span></a></h2><ol><li>独立的日志文件</li></ol><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">[Service]</span>
<span class="line">StandardOutput=file:/root/qddns/output.log</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>journalctl 命令</li></ol><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查看某服务的日志</span>
<span class="line">journalctl -u nginx.service</span>
<span class="line"></span>
<span class="line"># 查看日志已占用的空间</span>
<span class="line">journalctl --disk-usage</span>
<span class="line"></span>
<span class="line"># 设置日志最大占用空间: 500M, 2G</span>
<span class="line">journalctl --vacuum-size=500M</span>
<span class="line"></span>
<span class="line"># 设置日志最大保存时间: 10d, 1years</span>
<span class="line">journalctl --vacuum-time=30d</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="注意事项" tabindex="-1"><a class="header-anchor" href="#注意事项"><span>注意事项</span></a></h2><p><code>/etc/systemd/system/default.target</code>: 默认运行等级配置文件</p><p>service文件中ExecStart、ExecReload、ExecStop不支持&gt; 、&gt;&gt;等重定向符号，可以用 <code>/bin/sh -c</code> 来实现。 <code>ExecStart=/bin/sh -c &#39;/path/demo/demo &gt;&gt;/path/demo/demo/reload.log 2&gt;&amp;1&#39;</code></p><p><code>/bin/sh -c</code> 命令fork出两个子进程，进程组的首进程，负责与终端tty交互，其次才是真正的demo进程。当执行reload时，实际上执行 <code>ExecReload=/bin/kill -s HUP $MAINPID</code> ，这个MAINPID其实是首进程，进程如果没做信号量的捕获，默认是执行中断操作，同时会给子进程发送 <code>SIGTREM信号</code> 杀掉子进程，所以systemctl命令报错。 换一种实现方法，就是查到demo进程的真实pid:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">ExecReload=/bin/sh -c &#39;/bin/kill -HUP $(pidof /path/demo/demo)&#39;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>为什么加入重定向就会循环fork出两个进程？</p><p><code>/bin/sh -c</code> 的原理就是fork+exec来产生一个进程，子进程是无法与tty（控制台）交互的后台进程，重定向需要与tty（控制台）交互，所以先fork出来一个重定向进程，再fork出一个真正的demo进程</p><hr><blockquote><p>Linux---系统守护systemd（System Daemon) https://blog.csdn.net/2301_80079642/article/details/148220777 CentOS7下systemctl添加自定义服务 https://www.cnblogs.com/rainbow-tan/p/16448004.html systemctl使用reload及踩坑 https://blog.csdn.net/weixin_39992480/article/details/95484293 Systemd 入门教程：实战篇 http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-part-two.html 详细讲解systemctl（附常用指令） https://blog.csdn.net/DBC_121/article/details/104005076 如何优雅的使用 Systemd 管理服务 https://zhuanlan.zhihu.com/p/271071439</p></blockquote>`,71)])])}const r=e(l,[["render",d]]),p=JSON.parse('{"path":"/linux/systemd/","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1759204370000,"contributors":[{"name":"Hankin","username":"Hankin","email":"hankin@catmes.com","commits":3,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"243b9d33d875cfd3cf0ebfaebf7d957020edd0b1","time":1759204370000,"email":"554553400@qq.com","author":"Hankin","message":"UPDATE systemd"},{"hash":"028e0006fb19cf5c192d554d2978465965f11e4a","time":1759131855000,"email":"554553400@qq.com","author":"Hankin","message":"UPDATE systemd.md: journalctl --vacuum-size=500M"},{"hash":"e8519aa41da5fe2f3877981a6c3e47115b07b22c","time":1752418311000,"email":"hankin@catmes.com","author":"Hankin","message":"ADD linux/systemd.md. UPDATE promtail"}]},"filePathRelative":"linux/systemd/README.md"}');export{r as comp,p as data};
