import{_ as s,c as a,e,o as i}from"./app-BzD7cbQj.js";const l={};function t(p,n){return i(),a("div",null,[...n[0]||(n[0]=[e(`<h2 id="loki收集nginx日志" tabindex="-1"><a class="header-anchor" href="#loki收集nginx日志"><span>Loki收集nginx日志</span></a></h2><h3 id="修改nginx配置" tabindex="-1"><a class="header-anchor" href="#修改nginx配置"><span>修改nginx配置</span></a></h3><p>为了方便grafana dashbord展示，我们把日志格式修改为json</p><p><code>vim nginx.conf</code>:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">  log_format json escape=json &#39;{&#39;</span>
<span class="line">                    &#39;&quot;remote_addr&quot;: &quot;$remote_addr&quot;, &#39;</span>
<span class="line">                    &#39;&quot;request_uri&quot;: &quot;$request_uri&quot;, &#39;</span>
<span class="line">                    &#39;&quot;request_length&quot;: &quot;$request_length&quot;, &#39;</span>
<span class="line">                    &#39;&quot;request_time&quot;: &quot;$request_time&quot;, &#39;</span>
<span class="line">                    &#39;&quot;request_method&quot;: &quot;$request_method&quot;, &#39;                   </span>
<span class="line">                    &#39;&quot;status&quot;: &quot;$status&quot;, &#39;</span>
<span class="line">                    &#39;&quot;body_bytes_sent&quot;: &quot;$body_bytes_sent&quot;, &#39;</span>
<span class="line">                    &#39;&quot;http_referer&quot;: &quot;$http_referer&quot;, &#39;</span>
<span class="line">                    &#39;&quot;http_user_agent&quot;: &quot;$http_user_agent&quot;, &#39;</span>
<span class="line">                    &#39;&quot;http_x_forwarded_for&quot;: &quot;$http_x_forwarded_for&quot;, &#39;</span>
<span class="line">                    &#39;&quot;http_host&quot;: &quot;$http_host&quot;, &#39;</span>
<span class="line">                    &#39;&quot;server_name&quot;: &quot;$server_name&quot;, &#39;</span>
<span class="line">                    &#39;&quot;upstream&quot;: &quot;$upstream_addr&quot;, &#39;</span>
<span class="line">                    &#39;&quot;upstream_response_time&quot;: &quot;$upstream_response_time&quot;, &#39;</span>
<span class="line">                    &#39;&quot;upstream_status&quot;: &quot;$upstream_status&quot;, &#39;</span>
<span class="line">                    #&#39;&quot;geoip_country_code&quot;: &quot;$geoip2_data_country_code&quot;, &#39;</span>
<span class="line">                    #&#39;&quot;geoip_country_name&quot;: &quot;$geoip2_data_country_name&quot;, &#39;</span>
<span class="line">                    #&#39;&quot;geoip_city_name&quot;: &quot;$geoip2_data_city_name&quot;&#39;</span>
<span class="line">                    &#39;}&#39;;</span>
<span class="line"></span>
<span class="line"># 应用日志格式</span>
<span class="line">access_log /var/log/nginx/json_access.log json;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx服务器上二进制安装promtail" tabindex="-1"><a class="header-anchor" href="#nginx服务器上二进制安装promtail"><span>nginx服务器上二进制安装promtail</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment">#Loki,promtail二进制文件下载</span></span>
<span class="line"><span class="token function">wget</span> https://github.com/grafana/loki/releases/download/v2.8.1/promtail-linux-amd64.zip</span>
<span class="line"></span>
<span class="line"><span class="token comment">#解压</span></span>
<span class="line"><span class="token function">unzip</span> promtail-linux-amd64.zip</span>
<span class="line"></span>
<span class="line"><span class="token comment">#移动到对应目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /opt/loki/promtail</span>
<span class="line"><span class="token function">mv</span> promtail-linux-amd64 /opt/loki/promtail</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建配置文件:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /opt/loki/promtail/promtail-local-config.yaml <span class="token operator">&lt;&lt;</span><span class="token string">&quot;EOF&quot;</span>
<span class="line">server:</span>
<span class="line">  http_listen_port: 9080</span>
<span class="line">  grpc_listen_port: 0</span>
<span class="line"></span>
<span class="line">positions:</span>
<span class="line">  filename: /tmp/positions.yaml</span>
<span class="line"></span>
<span class="line">clients:</span>
<span class="line">  - url: http://192.168.11.60:3100/loki/api/v1/push</span>
<span class="line"></span>
<span class="line">scrape_configs:</span>
<span class="line">- job_name: system</span>
<span class="line">  static_configs:</span>
<span class="line">  - targets:</span>
<span class="line">      - localhost</span>
<span class="line">    labels:</span>
<span class="line">      job: varlogs</span>
<span class="line">      __path__: /var/log/*log</span>
<span class="line">  - targets:</span>
<span class="line">      - localhost</span>
<span class="line">    labels:</span>
<span class="line">      job: nginxlogs</span>
<span class="line">      __path__: /var/log/nginx/*log</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>nginx日志路径/var/log/nginx，根据实际修改</li><li>192.168.11.60:3100 为loki服务器地址，根据实际修改</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 创建用户</span></span>
<span class="line"><span class="token function">useradd</span> <span class="token parameter variable">-M</span> <span class="token parameter variable">-s</span> /usr/sbin/nologin loki</span>
<span class="line"><span class="token comment"># 更改loki文件夹权限</span></span>
<span class="line"><span class="token function">chown</span> loki:loki <span class="token parameter variable">-R</span> /opt/loki</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建 systemd 服务:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/systemd/system/promtail.service <span class="token operator">&lt;&lt;</span><span class="token string">&quot;EOF&quot;</span>
<span class="line">[Unit]</span>
<span class="line">Description=promtail</span>
<span class="line">Documentation=https://github.com/topics/promtail</span>
<span class="line">After=network.target</span>
<span class="line">[Service]</span>
<span class="line">User=loki</span>
<span class="line">Group=loki</span>
<span class="line">Type=simple</span>
<span class="line">ExecStart=/opt/loki/promtail/promtail-linux-amd64 --config.file=/opt/loki/promtail/promtail-local-config.yaml</span>
<span class="line">Restart=on-failure</span>
<span class="line">[Install]</span>
<span class="line">WantedBy=multi-user.target</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动 loki和 promtail</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">systemctl daemon-reload</span>
<span class="line">systemctl start promtail</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="grafana图形展示nginx日志" tabindex="-1"><a class="header-anchor" href="#grafana图形展示nginx日志"><span>grafana图形展示nginx日志</span></a></h3><p>点击设置里面的 <code>数据源</code> --点插件--然后搜索 <code>loki</code> --点击搜索出来的loki插件, 创建loki数据源。填写loki数据源地址，应用并保存</p><ul><li>添加doshbarod</li></ul><ol><li>id：16101</li><li>https://grafana.com/grafana/dashboards/16101-grafana-loki-dashboard-for-nginx-service-mesh/?tab=revisions</li></ol><h2 id="grafana图形展示nginx日志中客户端ip的国家和城市" tabindex="-1"><a class="header-anchor" href="#grafana图形展示nginx日志中客户端ip的国家和城市"><span>grafana图形展示nginx日志中客户端ip的国家和城市</span></a></h2><h3 id="nginx安装ngx-http-geoip2-module扩展" tabindex="-1"><a class="header-anchor" href="#nginx安装ngx-http-geoip2-module扩展"><span>Nginx安装ngx_http_geoip2_module扩展</span></a></h3><p>二选一：</p><ol><li>nginx编译安装ngx_http_geoip2_module（略）</li><li>docker安装已经编译好ngx_http_geoip2_module的nginx</li></ol><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 如通过docker-compose安装好的tengine，已经安装了ngx_http_geoip2_module模块，如下命令检查</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> tengine nginx -V<span class="token operator">|</span><span class="token function">grep</span> <span class="token string">&quot;ngx_http_geoip2_module-3.4&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="下载geolite2数据库" tabindex="-1"><a class="header-anchor" href="#下载geolite2数据库"><span>下载GeoLite2数据库</span></a></h3><ul><li>官网下载(<code>GeoLite2 City</code> 对应的zip压缩包)：https://www.maxmind.com/en/accounts/current/geoip/downloads</li><li>阿里云盘下载：https://www.aliyundrive.com/s/QDMPjoknb8b</li></ul><p>把下载好的GeoLite2解压得到的GeoLite2-City.mmdb数据库文件放在nginx服务器上 编译安装nginx存放位置：/etc/nginx/geoip2/GeoLite2-City.mmdb docker安装tengine存放位置：docker-compose/tengine/geoip2/GeoLite2-City.mmdb</p><h3 id="修改配置" tabindex="-1"><a class="header-anchor" href="#修改配置"><span>修改配置</span></a></h3><p><code>docker-compose.yml</code>配置：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">tengine</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>shenzhen.aliyuncs.com/linge360/tengine<span class="token punctuation">:</span>2.4.0<span class="token punctuation">-</span>geoip2</span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>    </span>
<span class="line">      <span class="token punctuation">-</span> ./geoip2<span class="token punctuation">:</span>/etc/nginx/geoip2</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>nginx.conf</code> 配置</p><p><code>vim nginx.conf</code> 增加如下配置：<code>/etc/nginx/geoip2/GeoLite2-City.mmdb</code> 根据实际填写</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">http {</span>
<span class="line">  log_format json escape=json &#39;{&#39;</span>
<span class="line">                    ...</span>
<span class="line">                    ...</span>
<span class="line">                    &#39;&quot;geoip_country_code&quot;: &quot;$geoip2_data_country_code&quot;, &#39;</span>
<span class="line">                    &#39;&quot;geoip_country_name&quot;: &quot;$geoip2_data_country_name&quot;, &#39;</span>
<span class="line">                    &#39;&quot;geoip_city_name&quot;: &quot;$geoip2_data_city_name&quot;&#39;</span>
<span class="line">                    &#39;}&#39;</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    geoip2 /etc/nginx/geoip2/GeoLite2-City.mmdb {</span>
<span class="line">        $geoip2_data_country_code country iso_code; #字符显示国家</span>
<span class="line">        $geoip2_data_city_name city names zh-CN; #中文显示城市名</span>
<span class="line">        $geoip2_data_country_name country names zh-CN; #中文显示国家名</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重启容器：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">docker compose restart</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="修改图形" tabindex="-1"><a class="header-anchor" href="#修改图形"><span>修改图形</span></a></h3><p>修改Top 10 visitor IPs这张图形，表达式修改如下</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">topk(10, sum by(remote_addr, geoip_country_code, geoip_country_name, geoip_city_name) (count_over_time({$label_name=~&quot;$label_value&quot;, job=~&quot;$job&quot;, instance=~&quot;$instance&quot;} | json | __error__=&quot;&quot; [$__interval])))</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>新增加请求非200的图形</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">{$label_name=~&quot;$label_value&quot;, job=~&quot;$job&quot;, instance=~&quot;$instance&quot;} | json | status &gt;= 400 and request_uri !=&quot;/favicon.ico&quot; | line_format &quot;➡️ {{.remote_addr}} {{.geoip_country_name}} {{.geoip_city_name}} {{.request_method}} {{.http_host}}{{.request_uri}} status: {{.status}} &quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><blockquote><p>Loki收集nginx日志 https://www.yuque.com/linge365/bfgv2p/tlap3n4k4tnky32v https://www.bilibili.com/video/BV1nw411D7n7</p></blockquote>`,42)])])}const c=s(l,[["render",t]]),d=JSON.parse('{"path":"/devops/grafana/loki_nginx.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1752422697000,"contributors":[{"name":"Hankin","username":"Hankin","email":"hankin@catmes.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"dc1ff8ad7a266889c76b9ccb98473be4ad49392b","time":1752422697000,"email":"hankin@catmes.com","author":"Hankin","message":"ADD loki_nginx.md"}]},"filePathRelative":"devops/grafana/loki_nginx.md"}');export{c as comp,d as data};
