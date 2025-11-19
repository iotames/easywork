import{_ as n,c as l,e as s,o as a}from"./app-BXRWSkHW.js";const i={};function c(p,e){return a(),l("div",null,[...e[0]||(e[0]=[s(`<h2 id="环境变量注入配置文件的实现方案" tabindex="-1"><a class="header-anchor" href="#环境变量注入配置文件的实现方案"><span>环境变量注入配置文件的实现方案</span></a></h2><ol><li>​修改 pom.xml 配置</li></ol><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">&lt;build&gt;</span>
<span class="line">  &lt;resources&gt;</span>
<span class="line">    &lt;resource&gt;</span>
<span class="line">      &lt;directory&gt;src/main/resources&lt;/directory&gt;</span>
<span class="line">      &lt;filtering&gt;true&lt;/filtering&gt; &lt;!-- 开启变量替换 --&gt;</span>
<span class="line">      &lt;includes&gt;</span>
<span class="line">        &lt;include&gt;application*.yaml&lt;/include&gt; &lt;!-- 覆盖所有环境配置文件 --&gt;</span>
<span class="line">      &lt;/includes&gt;</span>
<span class="line">    &lt;/resource&gt;</span>
<span class="line">  &lt;/resources&gt;</span>
<span class="line">&lt;/build&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>切换配置文件</li></ol><p>覆盖规则：application-local.yaml &gt; application-dev.yaml &gt; application.yaml（后加载的配置优先级更高）</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">src/main/resources/</span>
<span class="line">  ├── application.yaml          # 主配置（定义激活的Profile）</span>
<span class="line">  ├── application-local.yaml    # 本地环境配置</span>
<span class="line">  ├── application-dev.yaml       # 开发环境配置</span>
<span class="line">  └── application-prod.yaml     # 生产环境配置</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2.1 指定配置文件</p><p>配置 <code>application.yaml</code>。添加 <code>spring.profiles.active</code> 指向 <code>local</code>：</p><div class="language-application.yaml line-numbers-mode" data-highlighter="prismjs" data-ext="application.yaml"><pre><code class="language-application.yaml"><span class="line">spring:</span>
<span class="line">  profiles:</span>
<span class="line">  # @profileActive@，表示由Maven动态替换</span>
<span class="line">    active: local</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>等效命令：<code>java -jar app.jar --spring.profiles.active=local</code> 说明：</p><ul><li><code>--spring.profiles.active=local</code> 是 ​​Spring Boot 的启动参数​​，作用于​​应用 <code>运行时</code> 阶段​​。它直接告诉 Spring Boot 激活名为 local 的 Profile，并加载对应的配置文件（如 application-local.yaml）</li><li><code>Maven Profiles</code> 是 <code>构建阶段</code> ​​的配置（如编译、打包），而<code> Spring Profiles</code> 是​ <code>​运行阶段​</code> ​的配置。两者无依赖关系。命令行参数启动时，Maven 早已完成构建，因此无需 pom.xml 中的 Profile 定义</li></ul><p>2.2 动态切换配置文件（可选）</p><p>配置 <code>application.yaml</code>。添加 <code>spring.profiles.active</code> 指向动态变量：</p><div class="language-application.yaml line-numbers-mode" data-highlighter="prismjs" data-ext="application.yaml"><pre><code class="language-application.yaml"><span class="line">spring:</span>
<span class="line">  profiles:</span>
<span class="line">  # @profileActive@，表示由Maven动态替换</span>
<span class="line">    active: @profileActive@</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果配置了<code>spring.profiles.active</code>: <code>@profileActive@</code>，则会开启由Maven动态替换配置文件的方式。要在 <code>pom.xml</code> 定义 <code>profiles</code>:</p><div class="language-pom.xml line-numbers-mode" data-highlighter="prismjs" data-ext="pom.xml"><pre><code class="language-pom.xml"><span class="line">&lt;profiles&gt;</span>
<span class="line">  &lt;profile&gt;</span>
<span class="line">    &lt;id&gt;local&lt;/id&gt;</span>
<span class="line">    &lt;properties&gt;</span>
<span class="line">      &lt;profileActive&gt;local&lt;/profileActive&gt; &lt;!-- 激活local配置 --&gt;</span>
<span class="line">    &lt;/properties&gt;</span>
<span class="line">    &lt;activation&gt;</span>
<span class="line">      &lt;activeByDefault&gt;true&lt;/activeByDefault&gt; &lt;!-- 默认启用 --&gt;</span>
<span class="line">    &lt;/activation&gt;</span>
<span class="line">  &lt;/profile&gt;</span>
<span class="line">  &lt;profile&gt;</span>
<span class="line">    &lt;id&gt;dev&lt;/id&gt;</span>
<span class="line">    &lt;properties&gt;</span>
<span class="line">      &lt;profileActive&gt;dev&lt;/profileActive&gt; &lt;!-- 激活dev配置 --&gt;</span>
<span class="line">    &lt;/properties&gt;</span>
<span class="line">  &lt;/profile&gt;</span>
<span class="line">&lt;/profiles&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>修改 application-local.yaml 语法</li></ol><div class="language-application-local.yaml line-numbers-mode" data-highlighter="prismjs" data-ext="application-local.yaml"><pre><code class="language-application-local.yaml"><span class="line">url: jdbc:mysql://\${DB_HOST}:\${DB_PORT:3306}/\${DB_NAME}?useSSL=false</span>
<span class="line">username: \${DB_USERNAME}</span>
<span class="line">password: \${DB_PASSWORD}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4"><li>用法</li></ol><ul><li>环境变量字符串不能添加引号，否则引号也会被导入xml文件中</li><li><code>-P dev</code> 会激活对应 Profile，将 @profileActive@ 替换为 dev，使 Spring Boot 加载 application-dev.yaml</li></ul><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 可以设置spring.profiles.active为local, 固定配置文件为application-local.yaml</span>
<span class="line">export DB_HOST=172.16.160.33</span>
<span class="line">export DB_PORT=3307</span>
<span class="line">mvn clean package -Dmaven.test.skip=true</span>
<span class="line"></span>
<span class="line"># 使用 dev 配置（@profileActive@的动态配置文件方式）</span>
<span class="line">mvn clean package -P dev -Dmaven.test.skip=true</span>
<span class="line"></span>
<span class="line"># 使用 prod 配置（@profileActive@的动态配置文件方式，同时注入环境变量）</span>
<span class="line">export DB_HOST=10.0.0.1</span>
<span class="line">mvn clean package -P prod -Dmaven.test.skip=true</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,21)])])}const d=n(i,[["render",c]]),r=JSON.parse('{"path":"/java/envformvn.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1750430058000,"contributors":[{"name":"Hankin","username":"Hankin","email":"hankin@catmes.com","commits":2,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"c3040525cdf57df2da3df370c8d03a4b6e318b24","time":1750430058000,"email":"hankin@catmes.com","author":"Hankin","message":"UPDATE JAVA"},{"hash":"5898faeda578d18d591dc12a842925a7f45311cc","time":1749831449000,"email":"hankin@catmes.com","author":"Hankin","message":"ADD java env"}]},"filePathRelative":"java/envformvn.md"}');export{d as comp,r as data};
