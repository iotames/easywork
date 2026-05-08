import{k as e,p as t,u as n}from"./runtime-core.esm-bundler-BZOXYHv_.js";import{f as r}from"./app-CHCnSsit.js";var i=JSON.parse(`{"path":"/shopify/","title":"Shopify","lang":"zh-CN","frontmatter":{"title":"Shopify"},"git":{"updatedTime":1778207428000,"contributors":[{"name":"Hankin","username":"Hankin","email":"554553400@qq.com","commits":2,"url":"https://github.com/Hankin"},{"name":"吴汉青","username":"","email":"554553400@qq.com","commits":1}],"changelog":[{"hash":"107b792cab3e88ae180e9bda46a48e8232749340","time":1778207428000,"email":"554553400@qq.com","author":"吴汉青","message":"ADD process 流程设计"},{"hash":"214f020a0ddd3004caa5600d2001ba702bf8ecd7","time":1776152495000,"email":"554553400@qq.com","author":"Hankin","message":"UPDATE file menu for README.md"},{"hash":"4fd021cbd367c21f81de9d3c5c9a716e6fbf7852","time":1776075947000,"email":"554553400@qq.com","author":"Hankin","message":"ADD shopify"}]},"filePathRelative":"shopify/README.md"}`),a={name:`README.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h2 id="介绍" tabindex="-1"><a class="header-anchor" href="#介绍"><span>介绍</span></a></h2><p><code>Shopify</code> 是全球领先的统一商务操作系统，为各种规模的商家提供从开店、营销、支付到物流的一站式基础设施。</p><p>以核心 <code>巨石系统</code>（集中处理商品、订单、支付等关键事务）为主体，外围搭配可插拔的微服务（如搜索、图片处理）和第三方App生态，底层依靠云原生基础设施（Kubernetes、MySQL分片、Redis缓存、CDN加速）来支撑全球高并发流量的混合架构。</p><h2 id="开发" tabindex="-1"><a class="header-anchor" href="#开发"><span>开发</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> @shopify/cli @shopify/theme</span>
<span class="line"></span>
<span class="line">shopify auth login</span>
<span class="line"></span>
<span class="line"><span class="token comment"># da3523-61 是shopify的店铺名，如下所示：</span></span>
<span class="line"><span class="token comment"># https://admin.shopify.com/store/da3523-61/themes</span></span>
<span class="line"><span class="token comment"># https://admin.shopify.com/store/da3523-61/themes/165803753745</span></span>
<span class="line">shopify theme pull <span class="token parameter variable">--store</span><span class="token operator">=</span>da3523-61.myshopify.com</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 执行本地调试。</span></span>
<span class="line"><span class="token comment"># 执行命令后，按 t键。开启本地链接：http://127.0.0.1:9292</span></span>
<span class="line"><span class="token comment"># shopify theme dev --store da3523-61.myshopify.com</span></span>
<span class="line">shopify theme dev</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 对代码进行静态分析</span></span>
<span class="line">shopify theme check</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将本地文件推送到一个 未发布 的主题，用于最终预览</span></span>
<span class="line"><span class="token comment"># 推送为未发布主题，安全地进行最终验证</span></span>
<span class="line"><span class="token comment"># shopify theme push --unpublished --theme=&quot;My Theme Backup&quot;</span></span>
<span class="line"><span class="token comment"># 在 Shopify 后台的 “在线商店 &gt; 模板” 中，找到你刚才推送的主题，手动点击“发布 (Publish)”按钮将其设为线上正式主题。你也可以使用命令行直接发布，但手动操作更可控。</span></span>
<span class="line">shopify theme push</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 指定的主题设为店铺的 线上主站 (Live) 主题。</span></span>
<span class="line">shopify theme publish</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Git提交代码</span></span>
<span class="line"><span class="token comment"># git add .</span></span>
<span class="line"><span class="token comment"># git commit -m &quot;feat: 添加xxx自定义页面&quot;</span></span>
<span class="line"><span class="token comment"># git push origin main</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>环境管理 (Environments)：为了在不同店铺（如 dev, staging, production）之间切换，可以配置环境变量文件，使用 shopify theme dev --environment=staging 等命令指定环境。</p></li><li><p>CI/CD 集成：可将上述 CLI 命令集成到你的 CI/CD 工作流（如 GitHub Actions）中。例如，当代码被推送到 main 分支时，自动触发 shopify theme push 进行部署，实现更专业的自动化发布流程。</p></li></ul>`,6)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};