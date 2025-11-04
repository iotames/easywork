import{_ as n,c as e,e as a,o as l}from"./app-DDw_-8DT.js";const i={};function d(r,s){return l(),e("div",null,[...s[0]||(s[0]=[a(`<h2 id="systemd-journal-系统日志" tabindex="-1"><a class="header-anchor" href="#systemd-journal-系统日志"><span>Systemd Journal 系统日志</span></a></h2><p>日志配置：</p><p><code>vim /etc/systemd/journald.conf</code></p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">[Journal]</span>
<span class="line">SystemMaxUse=1G</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>重启系统日志服务，使得配置立即生效：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">systemctl restart systemd-journald</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="常见命令" tabindex="-1"><a class="header-anchor" href="#常见命令"><span>常见命令</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查看服务的日志</span>
<span class="line">journalctl -u cdnguard.service</span>
<span class="line"></span>
<span class="line"># 查看日志已占用的空间</span>
<span class="line">journalctl --disk-usage</span>
<span class="line"></span>
<span class="line"># 设置日志最大占用空间: 500M, 2G</span>
<span class="line">journalctl --vacuum-size=500M</span>
<span class="line"></span>
<span class="line"># 设置日志最大保存时间: 10d, 1years</span>
<span class="line">journalctl --vacuum-time=30d</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8)])])}const t=n(i,[["render",d]]),u=JSON.parse('{"path":"/linux/systemd/journald.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1759204370000,"contributors":[{"name":"Hankin","username":"Hankin","email":"554553400@qq.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"243b9d33d875cfd3cf0ebfaebf7d957020edd0b1","time":1759204370000,"email":"554553400@qq.com","author":"Hankin","message":"UPDATE systemd"}]},"filePathRelative":"linux/systemd/journald.md"}');export{t as comp,u as data};
