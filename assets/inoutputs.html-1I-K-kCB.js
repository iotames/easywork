import{_ as n,c as a,e,o as l}from"./app-C7XnOHte.js";const p={};function i(t,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="资源" tabindex="-1"><a class="header-anchor" href="#资源"><span>资源</span></a></h2><ul><li>项目主页：https://kestra.io/docs/tutorial/fundamentals</li><li>轻量灵活的命令行JSON处理器：https://jqlang.org/</li></ul><h2 id="工作流" tabindex="-1"><a class="header-anchor" href="#工作流"><span>工作流</span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">id</span><span class="token punctuation">:</span> getting_started</span>
<span class="line"><span class="token key atrule">namespace</span><span class="token punctuation">:</span> company.team</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">description</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">  # Getting Started</span>
<span class="line">  Let&#39;s \`write\` some **markdown** - [first flow](https://t.ly/Vemr0) 🚀</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">owner</span><span class="token punctuation">:</span> rick.astley</span>
<span class="line">  <span class="token key atrule">project</span><span class="token punctuation">:</span> never<span class="token punctuation">-</span>gonna<span class="token punctuation">-</span>give<span class="token punctuation">-</span>you<span class="token punctuation">-</span>up</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> hello_world</span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> io.kestra.plugin.core.log.Log</span>
<span class="line">    <span class="token key atrule">message</span><span class="token punctuation">:</span> Hello World<span class="token tag">!</span></span>
<span class="line">    <span class="token key atrule">description</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">      ## About this task</span>
<span class="line">      This task will print &quot;Hello World!&quot; to the logs.</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>id 表示流的名称。相同id的工作流，可存在于不同的namespace中。id 和 namespace 的组合用作流的唯一标识符 。</li><li>namespace 可用于分离开发和生产环境。</li><li>tasks 是将按定义的顺序执行的任务列表。推荐使用小写英文和下划线命名。</li></ul><ol><li>空间：创建流后，您将无法更改其命名空间。</li><li>标签：使用键值对对流进行分组</li></ol><h2 id="获取工作流的输入" tabindex="-1"><a class="header-anchor" href="#获取工作流的输入"><span>获取工作流的输入</span></a></h2><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">id</span><span class="token punctuation">:</span> getting_started</span>
<span class="line"><span class="token key atrule">namespace</span><span class="token punctuation">:</span> company.team</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">inputs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> api_url</span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> STRING</span>
<span class="line">    <span class="token key atrule">defaults</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//dummyjson.com/products</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> api</span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> io.kestra.plugin.core.http.Request</span>
<span class="line">    <span class="token key atrule">uri</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ inputs.api_url }}&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="获取任务的输出" tabindex="-1"><a class="header-anchor" href="#获取任务的输出"><span>获取任务的输出</span></a></h2><p>引用某个 <code>task_id(task-id)</code> 任务的输出:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">{{ outputs.task_id.output_property }}</span>
<span class="line"></span>
<span class="line"># 任务 ID 包含一个或多个连字符（- 符号），请将任务 ID 括在方括号中</span>
<span class="line">{{ outputs[&#39;task-id&#39;].output_property }}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例：</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">id</span><span class="token punctuation">:</span> getting_started</span>
<span class="line"><span class="token key atrule">namespace</span><span class="token punctuation">:</span> company.team</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">inputs</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> api_url</span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> STRING</span>
<span class="line">    <span class="token key atrule">defaults</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//dummyjson.com/products</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">tasks</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> api</span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> io.kestra.plugin.core.http.Request</span>
<span class="line">    <span class="token key atrule">uri</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ inputs.api_url }}&quot;</span></span>
<span class="line"></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> python</span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> io.kestra.plugin.scripts.python.Script</span>
<span class="line">    <span class="token key atrule">taskRunner</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">type</span><span class="token punctuation">:</span> io.kestra.plugin.core.runner.Process</span>
<span class="line">    <span class="token key atrule">beforeCommands</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> pip install polars</span>
<span class="line">    <span class="token key atrule">outputFiles</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token string">&quot;products.csv&quot;</span></span>
<span class="line">    <span class="token key atrule">script</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">      import polars as pl</span>
<span class="line">      data = {{ outputs.api.body | jq(&#39;.products&#39;) | first }}</span>
<span class="line">      df = pl.from_dicts(data)</span>
<span class="line">      df.glimpse()</span>
<span class="line">      df.select([&quot;brand&quot;, &quot;price&quot;]).write_csv(&quot;products.csv&quot;)</span></span>
<span class="line"></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> sqlQuery</span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> io.kestra.plugin.jdbc.duckdb.Query</span>
<span class="line">    <span class="token key atrule">inputFiles</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">in.csv</span><span class="token punctuation">:</span> <span class="token string">&quot;{{ outputs.python.outputFiles[&#39;products.csv&#39;] }}&quot;</span></span>
<span class="line">    <span class="token key atrule">sql</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string"></span>
<span class="line">      SELECT brand, round(avg(price), 2) as avg_price</span>
<span class="line">      FROM read_csv_auto(&#39;{{ workingDir }}/in.csv&#39;, header=True)</span>
<span class="line">      GROUP BY brand</span>
<span class="line">      ORDER BY avg_price DESC;</span></span>
<span class="line">    <span class="token key atrule">store</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>使用 <code>{{ outputs.task_id.body }}</code> 语法，提取上游 <code>API</code> 任务的结果数据</li><li>使用 <a href="https://jqlang.org/" target="_blank" rel="noopener noreferrer">jq</a> 语法 <code>{{ outputs.task_id.body | jq(&#39;.products&#39;) | first }}</code>，提取 <code>products</code> 数组中的第一个元素</li><li>在执行实例的 <code>输出(Outputs)</code> 选项卡，对输出结果进行调试。</li><li>使用 <code>io.kestra.plugin.jdbc.duckdb.Query</code> 任务，对上游的 <code>CSV文件</code> 执行 SQL 查询，将结果作为可下载构件保存（配置：<code>store： true</code>）。</li></ol>`,14)])])}const u=n(p,[["render",i]]),o=JSON.parse('{"path":"/devops/kestra/inoutputs.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1751616128000,"contributors":[{"name":"Hankin","username":"Hankin","email":"whq78164@gmail.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"cd555a58414909a3498092ad3c0726cc124fa163","time":1751616128000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE kestra"}]},"filePathRelative":"devops/kestra/inoutputs.md"}');export{u as comp,o as data};
