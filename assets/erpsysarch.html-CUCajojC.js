import{_ as n,c as a,e as p,o as e}from"./app-CoWQeDNb.js";const l={};function t(o,s){return e(),a("div",null,[...s[0]||(s[0]=[p(`<h2 id="系统架构设计" tabindex="-1"><a class="header-anchor" href="#系统架构设计"><span>系统架构设计</span></a></h2><p>参考互联网分层模型，设计集团公司的ERP系统架构。</p><h3 id="架构底座" tabindex="-1"><a class="header-anchor" href="#架构底座"><span>架构底座</span></a></h3><ol><li>编程语言：使用静态语言如：C, Go</li><li>主要职责：外网请求的唯一入口。负责接收，过滤，分发网络请求，记录日志，统计数据。</li><li>数据流转：数据在架构底座经过三层流转：网络防护层，业务分发层，结果处理层（负责最终响应，耗时统计等）。</li><li>网络防护层：过滤、拦截网络攻击。记录请求进来的时间begin_at。记录请求日志，包括IP，请求头，流量（数据包大小）。</li><li>业务分发层：对外业务网络请求的中央调度器。记录请求进来的时间begin_biz_at。通过URI路由映射，分发外部进来的网络请求到业务应用层的微服务。</li><li>结果处理层：对外响应请求结果。记录业务应用层完成请求的时间done_biz_at。</li><li>日志与统计组件：分析统计业务应用层，各个微服务，网络请求统计，包括耗时统计，API访问统计，报错统计。。。设置日志留存时间，防止存储空间不足。</li></ol><h3 id="业务应用层" tabindex="-1"><a class="header-anchor" href="#业务应用层"><span>业务应用层</span></a></h3><ol><li>编程语言：使用动态脚本语言。如Python, PHP</li><li>主要职责：处理业务逻辑，数据处理与存储。</li><li>组织形式：领域驱动设计，按业务场景解耦，明确职责边界。每个业务领域，服务名以stbiz_开头，组成微服务。</li><li>数据流转：微服务之间，通过TCP协议调用API接口进行内网通信。</li></ol><h2 id="系统架构图" tabindex="-1"><a class="header-anchor" href="#系统架构图"><span>系统架构图</span></a></h2><div class="language-mermaid line-numbers-mode" data-highlighter="prismjs" data-ext="mermaid"><pre><code class="language-mermaid"><span class="line"><span class="token keyword">flowchart</span> TD</span>
<span class="line">    <span class="token comment">%% 外部请求入口</span></span>
<span class="line">    A<span class="token text string">[外部请求&lt;br&gt;来自互联网]</span> <span class="token arrow operator">--&gt;</span> B<span class="token text string">[架构底座]</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">%% 架构底座 - 主流程</span></span>
<span class="line">    B <span class="token arrow operator">--&gt;</span> C<span class="token text string">[网络防护层]</span></span>
<span class="line">    C <span class="token arrow operator">--&gt;</span> D<span class="token text string">[业务分发层]</span></span>
<span class="line">    D <span class="token arrow operator">--&gt;</span> E<span class="token text string">[结果处理层]</span></span>
<span class="line">    E <span class="token arrow operator">--&gt;</span> F<span class="token text string">[响应返回客户端]</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">%% 网络防护层细节</span></span>
<span class="line">    <span class="token keyword">subgraph</span> C <span class="token text string">[网络防护层]</span></span>
<span class="line">        C1<span class="token text string">[过滤/拦截网络攻击]</span></span>
<span class="line">        C2<span class="token text string">[记录 begin_at]</span></span>
<span class="line">        C3<span class="token text string">[记录 IP/请求头/流量]</span></span>
<span class="line">        C1 <span class="token arrow operator">--&gt;</span> C2 <span class="token arrow operator">--&gt;</span> C3</span>
<span class="line">    <span class="token keyword">end</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">%% 业务分发层细节</span></span>
<span class="line">    <span class="token keyword">subgraph</span> D <span class="token text string">[业务分发层]</span></span>
<span class="line">        D1<span class="token text string">[记录 begin_biz_at]</span></span>
<span class="line">        D2<span class="token text string">[URI 路由映射]</span></span>
<span class="line">        D3<span class="token text string">[请求分发]</span></span>
<span class="line">        D1 <span class="token arrow operator">--&gt;</span> D2 <span class="token arrow operator">--&gt;</span> D3</span>
<span class="line">    <span class="token keyword">end</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">%% 结果处理层细节</span></span>
<span class="line">    <span class="token keyword">subgraph</span> E <span class="token text string">[结果处理层]</span></span>
<span class="line">        E1<span class="token text string">[记录 done_biz_at]</span></span>
<span class="line">        E2<span class="token text string">[处理响应结果]</span></span>
<span class="line">        E3<span class="token text string">[耗时统计]</span></span>
<span class="line">        E1 <span class="token arrow operator">--&gt;</span> E2 <span class="token arrow operator">--&gt;</span> E3</span>
<span class="line">    <span class="token keyword">end</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">%% 日志组件</span></span>
<span class="line">    G<span class="token text string">[日志与统计组件&lt;br&gt;分析统计/日志留存]</span></span>
<span class="line">    C <span class="token arrow operator">-.-&gt;</span> G</span>
<span class="line">    D <span class="token arrow operator">-.-&gt;</span> G</span>
<span class="line">    E <span class="token arrow operator">-.-&gt;</span> G</span>
<span class="line">    </span>
<span class="line">    <span class="token comment">%% 业务分发到微服务</span></span>
<span class="line">    D <span class="token arrow operator">--&gt;</span> H</span>
<span class="line">    D <span class="token arrow operator">--&gt;</span> I</span>
<span class="line">    D <span class="token arrow operator">--&gt;</span> J</span>
<span class="line">    D <span class="token arrow operator">--&gt;</span> K</span>
<span class="line">    </span>
<span class="line">    <span class="token comment">%% 微服务定义</span></span>
<span class="line">    H<span class="token text string">[stbiz_订单服务&lt;br&gt;Python/PHP]</span></span>
<span class="line">    I<span class="token text string">[stbiz_库存服务&lt;br&gt;Python/PHP]</span></span>
<span class="line">    J<span class="token text string">[stbiz_财务服务&lt;br&gt;Python/PHP]</span></span>
<span class="line">    K<span class="token text string">[stbiz_其他服务&lt;br&gt;Python/PHP]</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">%% 微服务返回结果</span></span>
<span class="line">    H <span class="token arrow operator">--&gt;</span> E</span>
<span class="line">    I <span class="token arrow operator">--&gt;</span> E</span>
<span class="line">    J <span class="token arrow operator">--&gt;</span> E</span>
<span class="line">    K <span class="token arrow operator">--&gt;</span> E</span>
<span class="line">    </span>
<span class="line">    <span class="token comment">%% 微服务间通信</span></span>
<span class="line">    H <span class="token arrow operator">&lt;--&gt;</span> I</span>
<span class="line">    I <span class="token arrow operator">&lt;--&gt;</span> J</span>
<span class="line">    J <span class="token arrow operator">&lt;--&gt;</span> K</span>
<span class="line">    K <span class="token arrow operator">&lt;--&gt;</span> H</span>
<span class="line">    </span>
<span class="line">    <span class="token comment">%% 样式定义</span></span>
<span class="line">    <span class="token keyword">classDef</span> baseLayer <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#e1f5fe<span class="token punctuation">,</span><span class="token property">stroke</span><span class="token operator">:</span>#01579b<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">classDef</span> appLayer <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#f3e5f5<span class="token punctuation">,</span><span class="token property">stroke</span><span class="token operator">:</span>#4a148c<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">classDef</span> logLayer <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#fff3e0<span class="token punctuation">,</span><span class="token property">stroke</span><span class="token operator">:</span>#e65100<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">class</span> C,D,E baseLayer</span>
<span class="line">    <span class="token keyword">class</span> H,I,J,K appLayer</span>
<span class="line">    <span class="token keyword">class</span> G logLayer</span>
<span class="line">    </span>
<span class="line">    <span class="token comment">%% 数据流注释</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 0 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#009688<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 1 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#009688<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 2 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#009688<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 3 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#009688<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 4 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#ff9800<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 5 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#ff9800<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 6 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#ff9800<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 7 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#ff9800<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 8 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#4caf50<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 9 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#4caf50<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 10 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#4caf50<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 11 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#4caf50<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>2px</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 12 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#9c27b0<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>1px<span class="token punctuation">,</span><span class="token property">stroke-dasharray</span><span class="token operator">:</span>5 5</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 13 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#9c27b0<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>1px<span class="token punctuation">,</span><span class="token property">stroke-dasharray</span><span class="token operator">:</span>5 5</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 14 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#9c27b0<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>1px<span class="token punctuation">,</span><span class="token property">stroke-dasharray</span><span class="token operator">:</span>5 5</span></span>
<span class="line">    <span class="token keyword">linkStyle</span> 15 <span class="token style"><span class="token property">stroke</span><span class="token operator">:</span>#9c27b0<span class="token punctuation">,</span><span class="token property">stroke-width</span><span class="token operator">:</span>1px<span class="token punctuation">,</span><span class="token property">stroke-dasharray</span><span class="token operator">:</span>5 5</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8)])])}const i=n(l,[["render",t]]),c=JSON.parse('{"path":"/devstd/erpsysarch.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1763198388000,"contributors":[{"name":"Hankin","username":"Hankin","email":"554553400@qq.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"ecd76561fb5ce12e1d6505e1d05832093870fa57","time":1763198388000,"email":"554553400@qq.com","author":"Hankin","message":"ADD mermaid by pnpm. ADD erpsysarch.md"}]},"filePathRelative":"devstd/erpsysarch.md"}');export{i as comp,c as data};
