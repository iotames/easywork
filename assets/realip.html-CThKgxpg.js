import{_ as s,c as a,e,o as i}from"./app-B5WmjTv7.js";const l={};function t(p,n){return i(),a("div",null,[...n[0]||(n[0]=[e(`<h2 id="http请求头ip和tcp源ip" tabindex="-1"><a class="header-anchor" href="#http请求头ip和tcp源ip"><span>HTTP请求头IP和TCP源IP</span></a></h2><p>打破砂锅问到底：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">下面两个HTTP请求头的含义是什么？有何区别？</span>
<span class="line">&quot;X-Forwarded-For&quot;: [&quot;119.91.107.106, 153.99.246.174&quot;]</span>
<span class="line">&quot;X-Real-Ip&quot;: [&quot;153.99.246.174&quot;]</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">按照HTTP协议，请求头都是可伪造的。如果我想获取HTTP请求的真实IP(因为X-Real-Ip请求头还是有伪造的可能)。要怎么做？</span>
<span class="line">也就是说，如果网络请求，经过中间层层转发，我只能获取最后一层的服务器IP做为真实IP。如果没经过转发，那就是最初发起请求的客户端IP了。能理解吗？</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">如果使用Go语言的net/http标准库构建了Web服务器，如何获取“最后一层真实IP”？</span>
<span class="line">如果使用Go语言的net/http标准库构建了Web服务器，但是接收到的网络请求，是先经过本机的另一个NGINX服务做了反向代理，然后再转发到这台Go语言的Web服务器。那么获取到的IP是哪个？</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">如果HTTP请求头存在X-Real-Ip，且与真实的TCP源IP不一致，是否可以判定是网络攻击？</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="笔记" tabindex="-1"><a class="header-anchor" href="#笔记"><span>笔记</span></a></h2><p>NGINX配置：</p><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx"><pre><code class="language-nginx"><span class="line"><span class="token comment"># $remote_addr就是客户端真实IP</span></span>
<span class="line"><span class="token directive"><span class="token keyword">log_format</span> main <span class="token string">&#39;<span class="token variable">$remote_addr</span> [<span class="token variable">$time_local]</span> &quot;<span class="token variable">$request</span>&quot;&#39;</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">proxy_pass</span> http://127.0.0.1:8080</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment"># 将客户端真实IP（Nginx看到的远程IP）写入X-Real-IP头。</span></span>
<span class="line">    <span class="token comment"># 因为存在NGINX反向代理，使得http://127.0.0.1:8080应用服务端，获取的TCP源IP是NGINX的IP，也就是127.0.0.1。</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Real-IP <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment"># 记录完整的转发链（客户端IP, 中间代理IP）</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Go语言代码：</p><div class="language-golang line-numbers-mode" data-highlighter="prismjs" data-ext="golang"><pre><code class="language-golang"><span class="line">package main</span>
<span class="line"></span>
<span class="line">import (</span>
<span class="line">	&quot;net&quot;</span>
<span class="line">	&quot;net/http&quot;</span>
<span class="line">	&quot;strings&quot;</span>
<span class="line">)</span>
<span class="line"></span>
<span class="line">func main() {</span>
<span class="line">	http.HandleFunc(&quot;/get-real-ip&quot;, func(w http.ResponseWriter, r *http.Request) {</span>
<span class="line">		// 1. 获取 TCP 连接的源地址（格式：IP:端口）</span>
<span class="line">		remoteAddr := r.RemoteAddr</span>
<span class="line"></span>
<span class="line">		// 2. 分割 IP 和端口（处理可能的错误，如地址格式异常）</span>
<span class="line">		ip, _, err := net.SplitHostPort(remoteAddr)</span>
<span class="line">		if err != nil {</span>
<span class="line">			// 极端情况：如果地址格式不符合 &quot;IP:端口&quot;（如 Unix 域套接字），直接使用原始地址作为 IP</span>
<span class="line">			ip = remoteAddr</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		// 3. 返回结果。如果是NGINX转发过来的请求，那TCP连接的源IP只能是NGINX的IP</span>
<span class="line">		w.Write([]byte(&quot;最后一层真实IP: &quot; + ip))</span>
<span class="line"></span>
<span class="line">        // 从Nginx转发的X-Real-IP头中获取客户端真实IP</span>
<span class="line">        clientIP := r.Header.Get(&quot;X-Real-IP&quot;)</span>
<span class="line">        if clientIP == &quot;&quot; {</span>
<span class="line">            // 降级处理：如果没有X-Real-IP，使用最后一级IP（Nginx的IP）</span>
<span class="line">            ip, _, _ := net.SplitHostPort(r.RemoteAddr)</span>
<span class="line">            clientIP = ip</span>
<span class="line">        }</span>
<span class="line">        w.Write([]byte(&quot;客户端真实IP（来自Nginx转发）: &quot; + clientIP))</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">	})</span>
<span class="line"></span>
<span class="line">	// 启动服务器，监听 8080 端口</span>
<span class="line">	http.ListenAndServe(&quot;:8080&quot;, nil)</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11)])])}const c=s(l,[["render",t]]),r=JSON.parse('{"path":"/nginx/realip.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1758685450000,"contributors":[{"name":"Hankin","username":"Hankin","email":"554553400@qq.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"7123bb51ac334816ca4e66e4bb49b5967d44aa7d","time":1758685450000,"email":"554553400@qq.com","author":"Hankin","message":"ADD realip.md for nginx"}]},"filePathRelative":"nginx/realip.md"}');export{c as comp,r as data};
