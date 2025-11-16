import{_ as n,c as a,e,o as i}from"./app-B5WmjTv7.js";const l={};function c(d,s){return i(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="ssh私钥登录" tabindex="-1"><a class="header-anchor" href="#ssh私钥登录"><span>SSH私钥登录</span></a></h2><h3 id="配置ssh服务端" tabindex="-1"><a class="header-anchor" href="#配置ssh服务端"><span>配置SSH服务端</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 生成密钥对：私钥id_rsa和公钥id_rsa.pub</span></span>
<span class="line">ssh-keygen <span class="token parameter variable">-C</span> forLiLei</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装公钥</span></span>
<span class="line"><span class="token builtin class-name">cd</span> ~/.ssh</span>
<span class="line"><span class="token function">cat</span> id_rsa.pub <span class="token operator">&gt;&gt;</span> authorized_keys</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改权限</span></span>
<span class="line"><span class="token function">chmod</span> <span class="token number">600</span> ~/.ssh/authorized_keys</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重启ssh服务</span></span>
<span class="line"><span class="token function">service</span> sshd reload</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置ssh客户端" tabindex="-1"><a class="header-anchor" href="#配置ssh客户端"><span>配置SSH客户端</span></a></h3><p>vim <code>~/.ssh/config</code></p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">TCPKeepAlive=yes</span>
<span class="line"># Client每隔 60 秒发送一次请求给 Server，然后 Server响应，从而保持连接</span>
<span class="line">ServerAliveInterval 60</span>
<span class="line"># Client发出请求后，服务器端没有响应得次数达到3，就自动断开连接，正常情况下，Server 不会不响应</span>
<span class="line">ServerAliveCountMax 3</span>
<span class="line"></span>
<span class="line">#############本地电脑################</span>
<span class="line"></span>
<span class="line">Host alpine</span>
<span class="line">HostName 127.0.0.1</span>
<span class="line">Port 2222</span>
<span class="line">User root</span>
<span class="line">IdentityFile ~/.ssh/alpine.pri</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>SSH登录的私钥权限不能过大(可授予400 or 600权限)：<code>chmod 600 ~/.ssh/alpine.pri</code></li></ul><h3 id="服务端配置-可选" tabindex="-1"><a class="header-anchor" href="#服务端配置-可选"><span>服务端配置（可选）</span></a></h3><p>修改SSH守护进程配置文件： <code>/etc/ssh/sshd_config</code></p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line"># 禁用密码登录，慎重！</span>
<span class="line">PasswordAuthentication no</span>
<span class="line">RSAAuthentication        yes</span>
<span class="line">PubkeyAuthentication     yes</span>
<span class="line">PermitRootLogin          yes</span>
<span class="line">ChallengeResponseAuthentication no</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10)])])}const r=n(l,[["render",c]]),t=JSON.parse('{"path":"/linux/ssh.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1753170766000,"contributors":[{"name":"Hankin","username":"Hankin","email":"whq78164@gmail.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"9aae07ba4b68fc50a8a6a20d0fc22f361c441d06","time":1753170766000,"email":"whq78164@gmail.com","author":"Hankin","message":"ADD ssh.md for Linux"}]},"filePathRelative":"linux/ssh.md"}');export{r as comp,t as data};
