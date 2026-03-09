import{_ as n,c as e,e as a,o as i}from"./app-2xUJLYSB.js";const l={};function r(t,s){return i(),e("div",null,[...s[0]||(s[0]=[a(`<h2 id="触发器" tabindex="-1"><a class="header-anchor" href="#触发器"><span>触发器</span></a></h2><ul><li>https://kestra.io/docs/workflow-components/triggers</li></ul><p>触发器会根据事件自动启动您的流程。</p><ol><li>未定义任何触发器，默认未手动触发。</li><li>可以将多个触发器附加到一个流。</li><li>触发器类型：计划日期、新文件到达、队列中的新消息，其他流执行的结束。</li></ol><h2 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h2><p>以下工作流会在每天上午 10 点以及 first_flow 完成执行时自动触发。这两个触发器彼此独立。</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">id: getting_started</span>
<span class="line">namespace: company.team</span>
<span class="line"></span>
<span class="line">tasks:</span>
<span class="line">  - id: hello_world</span>
<span class="line">    type: io.kestra.plugin.core.log.Log</span>
<span class="line">    message: Hello World!</span>
<span class="line"></span>
<span class="line">triggers:</span>
<span class="line">  - id: schedule_trigger</span>
<span class="line">    type: io.kestra.plugin.core.trigger.Schedule</span>
<span class="line">    cron: 0 10 * * *</span>
<span class="line"></span>
<span class="line">  - id: flow_trigger</span>
<span class="line">    type: io.kestra.plugin.core.trigger.Flow</span>
<span class="line">    conditions:</span>
<span class="line">      - type: io.kestra.plugin.core.condition.ExecutionFlow</span>
<span class="line">        namespace: company.team</span>
<span class="line">        flowId: first_flow</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="webhook触发器" tabindex="-1"><a class="header-anchor" href="#webhook触发器"><span>WebHook触发器</span></a></h2><ul><li>https://kestra.io/docs/workflow-components/triggers/webhook-trigger</li></ul><p>示例：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">id: trigger</span>
<span class="line">namespace: company.team</span>
<span class="line"></span>
<span class="line">tasks:</span>
<span class="line">  - id: hello</span>
<span class="line">    type: io.kestra.plugin.core.log.Log</span>
<span class="line">    message: &quot;Hello World! 🚀&quot;</span>
<span class="line"></span>
<span class="line">triggers:</span>
<span class="line">  - id: webhook</span>
<span class="line">    type: io.kestra.plugin.core.trigger.Webhook</span>
<span class="line">    key: 4wjtkzwVGBM9yKnjm3yv8r</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>URL地址：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">https://{kestra_domain}/api/v1/executions/webhook/{namespace}/{flowId}/4wjtkzwVGBM9yKnjm3yv8r</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div>`,13)])])}const d=n(l,[["render",r]]),p=JSON.parse('{"path":"/devops/kestra/triggers.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1751616128000,"contributors":[{"name":"Hankin","username":"Hankin","email":"whq78164@gmail.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"cd555a58414909a3498092ad3c0726cc124fa163","time":1751616128000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE kestra"}]},"filePathRelative":"devops/kestra/triggers.md"}');export{d as comp,p as data};
