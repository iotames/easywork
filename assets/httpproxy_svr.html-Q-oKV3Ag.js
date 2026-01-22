import{_ as s,c as a,e as p,o as t}from"./app-A13fHkUV.js";const e={};function l(c,n){return t(),a("div",null,[...n[0]||(n[0]=[p(`<h2 id="http代理服务器第三方代码库" tabindex="-1"><a class="header-anchor" href="#http代理服务器第三方代码库"><span>Http代理服务器第三方代码库</span></a></h2><ul><li>https://github.com/valyala/fasthttp：<code>Start 22.9K</code> 运行效率高。</li><li>https://github.com/elazarl/goproxy：<code>Start 6.5k</code> 功能强大，支持MITM</li></ul><h2 id="使用go语言搭建http代理服务器" tabindex="-1"><a class="header-anchor" href="#使用go语言搭建http代理服务器"><span>使用Go语言搭建HTTP代理服务器</span></a></h2><p>代理服务器的工作方式如下：</p><ol><li>客户端向代理服务器发送请求，表明自己需要请求的网站内容</li><li>代理服务器接收到来自客户端的请求之后，通过解析，获取到需要访问的web服务</li><li>代理服务器将客户端的请求信息全部转发给web服务器</li><li>web服务器返回响应消息给代理服务器</li><li>代理服务器将返回的消息转发给对应的客户端</li></ol><p>简易实现的代理服务器不支持HTTPS，要支持，请移步前面的 <code>第三方代码库</code>。</p><div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code class="language-go"><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">    <span class="token string">&quot;bufio&quot;</span></span>
<span class="line">    <span class="token string">&quot;bytes&quot;</span></span>
<span class="line">    <span class="token string">&quot;fmt&quot;</span></span>
<span class="line">    <span class="token string">&quot;io&quot;</span></span>
<span class="line">    <span class="token string">&quot;net&quot;</span></span>
<span class="line">    <span class="token string">&quot;strings&quot;</span></span>
<span class="line">    <span class="token string">&quot;time&quot;</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> MAX_BUFF_SIZE <span class="token operator">=</span> <span class="token number">255</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 端口号可以自己指定</span></span>
<span class="line">    l<span class="token punctuation">,</span> err <span class="token operator">:=</span> net<span class="token punctuation">.</span><span class="token function">Listen</span><span class="token punctuation">(</span><span class="token string">&quot;tcp&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;127.0.0.1:8080&quot;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 接收客户端的请求</span></span>
<span class="line">        conn<span class="token punctuation">,</span> err <span class="token operator">:=</span> l<span class="token punctuation">.</span><span class="token function">Accept</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">continue</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token comment">// 一旦建立连接，那么进行处理</span></span>
<span class="line">        <span class="token keyword">go</span> <span class="token function">handleConn</span><span class="token punctuation">(</span>conn<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">handleConn</span><span class="token punctuation">(</span>conn net<span class="token punctuation">.</span>Conn<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">var</span> request <span class="token operator">=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">byte</span><span class="token punctuation">,</span> MAX_BUFF_SIZE<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 从conn中读取请求数据</span></span>
<span class="line">    n<span class="token punctuation">,</span> err <span class="token operator">:=</span> conn<span class="token punctuation">.</span><span class="token function">Read</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">        fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;read request error: &quot;</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">return</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    reader <span class="token operator">:=</span> bytes<span class="token punctuation">.</span><span class="token function">NewReader</span><span class="token punctuation">(</span>request<span class="token punctuation">[</span><span class="token punctuation">:</span>n<span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line">    r <span class="token operator">:=</span> bufio<span class="token punctuation">.</span><span class="token function">NewReader</span><span class="token punctuation">(</span>reader<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 读取第一行请求数据，中间包含需要访问的服务器内容</span></span>
<span class="line">    s<span class="token punctuation">,</span> err <span class="token operator">:=</span> r<span class="token punctuation">.</span><span class="token function">ReadString</span><span class="token punctuation">(</span><span class="token char">&#39;\\n&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">        fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;read string error: &quot;</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">return</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    uri <span class="token operator">:=</span> strings<span class="token punctuation">.</span><span class="token function">Split</span><span class="token punctuation">(</span>s<span class="token punctuation">,</span> <span class="token string">&quot; &quot;</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 找到 hostname, 比如  httpbin.org 而不是 http://httpbin.org/</span></span>
<span class="line">    <span class="token keyword">if</span> strings<span class="token punctuation">.</span><span class="token function">Contains</span><span class="token punctuation">(</span>uri<span class="token punctuation">,</span> <span class="token string">&quot;http://&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        uri <span class="token operator">=</span> uri<span class="token punctuation">[</span><span class="token number">7</span><span class="token punctuation">:</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 获取到服务端的主机</span></span>
<span class="line">    pos <span class="token operator">:=</span> strings<span class="token punctuation">.</span><span class="token function">Index</span><span class="token punctuation">(</span>uri<span class="token punctuation">,</span> <span class="token string">&quot;/&quot;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">var</span> hostname <span class="token operator">=</span> uri</span>
<span class="line">    <span class="token keyword">if</span> pos <span class="token operator">&gt;</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token punctuation">{</span></span>
<span class="line">        hostname <span class="token operator">=</span> uri<span class="token punctuation">[</span><span class="token punctuation">:</span>pos<span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">// fmt.Println(&quot;hostname: &quot;, hostname)</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 获取到主机，以及端口号</span></span>
<span class="line">    colon <span class="token operator">:=</span> strings<span class="token punctuation">.</span><span class="token function">Index</span><span class="token punctuation">(</span>hostname<span class="token punctuation">,</span> <span class="token string">&quot;:&quot;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">var</span> host<span class="token punctuation">,</span> port <span class="token builtin">string</span></span>
<span class="line">    <span class="token keyword">if</span> colon <span class="token operator">&gt;</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token punctuation">{</span></span>
<span class="line">        host <span class="token operator">=</span> hostname<span class="token punctuation">[</span><span class="token punctuation">:</span>colon<span class="token punctuation">]</span></span>
<span class="line">        port <span class="token operator">=</span> hostname<span class="token punctuation">[</span>colon<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 如果没有指定端口号，默认使用80端口</span></span>
<span class="line">        host <span class="token operator">=</span> hostname</span>
<span class="line">        port <span class="token operator">=</span> <span class="token string">&quot;80&quot;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    fmt<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;host: %s, port: %s\\n&quot;</span><span class="token punctuation">,</span> host<span class="token punctuation">,</span> port<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 建立到想要请求的服务端的连接</span></span>
<span class="line">    c<span class="token punctuation">,</span> err <span class="token operator">:=</span> net<span class="token punctuation">.</span><span class="token function">DialTimeout</span><span class="token punctuation">(</span><span class="token string">&quot;tcp&quot;</span><span class="token punctuation">,</span> net<span class="token punctuation">.</span><span class="token function">JoinHostPort</span><span class="token punctuation">(</span>host<span class="token punctuation">,</span> port<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">30</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">        fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">return</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 将需要请求的数据转发一份</span></span>
<span class="line">    <span class="token boolean">_</span><span class="token punctuation">,</span> err <span class="token operator">=</span> c<span class="token punctuation">.</span><span class="token function">Write</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">        fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;write request error: &quot;</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">return</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 将从服务端读取到的内容全部转发给客户端</span></span>
<span class="line">    <span class="token keyword">var</span> buff <span class="token punctuation">[</span><span class="token number">512</span><span class="token punctuation">]</span><span class="token builtin">byte</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">{</span></span>
<span class="line">        n<span class="token punctuation">,</span> err <span class="token operator">:=</span> c<span class="token punctuation">.</span><span class="token function">Read</span><span class="token punctuation">(</span>buff<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> err <span class="token operator">==</span> io<span class="token punctuation">.</span>EOF <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">break</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            <span class="token keyword">return</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token boolean">_</span><span class="token punctuation">,</span> err <span class="token operator">=</span> conn<span class="token punctuation">.</span><span class="token function">Write</span><span class="token punctuation">(</span>buff<span class="token punctuation">[</span><span class="token punctuation">:</span>n<span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">            fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;write to client error: &quot;</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">return</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7)])])}const i=s(e,[["render",l]]),u=JSON.parse('{"path":"/golang/httpproxy_svr.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1756103822000,"contributors":[{"name":"huanglinyan","username":"huanglinyan","email":"2710995269@qq.com","commits":1,"url":"https://github.com/huanglinyan"}],"changelog":[{"hash":"6ce83631744ff588f0fafd4d6ccf57da73e9a595","time":1756103822000,"email":"2710995269@qq.com","author":"huanglinyan","message":"ADD dialog, proxy svr, client for go"}]},"filePathRelative":"golang/httpproxy_svr.md"}');export{i as comp,u as data};
