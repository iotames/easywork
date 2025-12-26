import{_ as n,c as a,e,o as l}from"./app-CbLqF3yI.js";const p={};function i(t,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="命名空间" tabindex="-1"><a class="header-anchor" href="#命名空间"><span>命名空间</span></a></h2><ul><li>工作流组件-命名空间：https://kestra.io/docs/workflow-components/namespace</li></ul><p>可以使用嵌入式代码编辑器和 <code>命名空间文件</code> 在命名空间级别组织您的代码，并可以选择从 <code>Git</code> 同步这些文件</p><h2 id="命名空间文件" tabindex="-1"><a class="header-anchor" href="#命名空间文件"><span>命名空间文件</span></a></h2><ol><li><p>概念 - 命名空间文件：https://kestra.io/docs/concepts/namespace-files</p></li><li><p>版本控制与 CI/CD - 版本控制与 Git：https://kestra.io/docs/version-control-cicd/git</p></li></ol><p>您可以将您的 Git 仓库与特定的命名空间同步，以协调 dbt、Terraform 或 Ansible，或任何包含代码和配置文件的其他项目。</p><p>一旦您将任何文件添加到命名空间中，您可以使用来自同一命名空间的 <code>EVERY</code> 任务或触发器中的 <code>read()</code> 函数在流程中引用它。</p><p>命名空间文件，存储在命名空间目录的 <code>_files</code> 子目录中，允许您在工作流中使用 <code>read()</code> 函数读取文件内容。</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">.</span>
<span class="line">└── main</span>
<span class="line">    ├── debug</span>
<span class="line">    │   └── _files</span>
<span class="line">    │       └── debug1.txt</span>
<span class="line">    └── odoo</span>
<span class="line">        ├── dev</span>
<span class="line">        │   └── _files</span>
<span class="line">        │       └── odoo_dev1.txt</span>
<span class="line">        └── _files</span>
<span class="line">            ├── hello.txt</span>
<span class="line">            └── odoorun.yml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">id</span><span class="token punctuation">:</span> files</span>
<span class="line"><span class="token key atrule">namespace</span><span class="token punctuation">:</span> company.team</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> log</span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> io.kestra.plugin.core.log.Log</span>
<span class="line">    <span class="token key atrule">message</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ read(&#39;example.txt&#39;) }}&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code class="language-python"><span class="line"><span class="token keyword">import</span> requests</span>
<span class="line">api_key <span class="token operator">=</span> <span class="token string">&#39;{{ secret(&quot;WEATHER_DATA_API_KEY&quot;) }}&#39;</span></span>
<span class="line">url <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&quot;https://api.openweathermap.org/data/2.5/weather?q=Paris&amp;APPID=</span><span class="token interpolation"><span class="token punctuation">{</span>api_key<span class="token punctuation">}</span></span><span class="token string">&quot;</span></span></span>
<span class="line">weather_data <span class="token operator">=</span> requests<span class="token punctuation">.</span>get<span class="token punctuation">(</span>url<span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span>weather_data<span class="token punctuation">.</span>json<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">id</span><span class="token punctuation">:</span> weather_data</span>
<span class="line"><span class="token key atrule">namespace</span><span class="token punctuation">:</span> company.team</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> get_weather</span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> io.kestra.plugin.scripts.python.Commands</span>
<span class="line">    <span class="token key atrule">namespaceFiles</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">      <span class="token key atrule">include</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> scripts/weather.py</span>
<span class="line">    <span class="token key atrule">taskRunner</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">type</span><span class="token punctuation">:</span> io.kestra.plugin.scripts.runner.docker.Docker</span>
<span class="line">    <span class="token key atrule">containerImage</span><span class="token punctuation">:</span> ghcr.io/kestra<span class="token punctuation">-</span>io/pydata<span class="token punctuation">:</span>latest</span>
<span class="line">    <span class="token key atrule">commands</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> python scripts/weather.py</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">id</span><span class="token punctuation">:</span> namespace_files_example</span>
<span class="line"><span class="token key atrule">namespace</span><span class="token punctuation">:</span> dev.test</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line"></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> namespace</span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> io.kestra.plugin.scripts.python.Commands</span>
<span class="line">    <span class="token key atrule">namespaceFiles</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">      <span class="token key atrule">namespaces</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token string">&quot;dev.test&quot;</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token string">&quot;company&quot;</span></span>
<span class="line">    <span class="token key atrule">commands</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> python test.py</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> namespace2</span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> io.kestra.plugin.scripts.python.Script</span>
<span class="line">    <span class="token key atrule">namespaceFiles</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">    <span class="token key atrule">script</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ read(&#39;test.py&#39;) }}&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="todo" tabindex="-1"><a class="header-anchor" href="#todo"><span>TODO</span></a></h2>`,15)])])}const o=n(p,[["render",i]]),u=JSON.parse('{"path":"/devops/kestra/namespace.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1751947110000,"contributors":[{"name":"Hankin","username":"Hankin","email":"hankin@catmes.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"81aada5ab868be7617abbd1670d5289348c90fb2","time":1751947110000,"email":"hankin@catmes.com","author":"Hankin","message":"ADD namespace for kestra"}]},"filePathRelative":"devops/kestra/namespace.md"}');export{o as comp,u as data};
