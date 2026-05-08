import{k as e,p as t,u as n}from"./runtime-core.esm-bundler-BZOXYHv_.js";import{f as r}from"./app-CHCnSsit.js";var i=JSON.parse(`{"path":"/git/gitflow.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1776151639000,"contributors":[{"name":"Hankin","username":"Hankin","email":"whq78164@gmail.com","commits":6,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"cc6b003d80c4920bfcdf35cb114af91ed52b0af6","time":1776151639000,"email":"554553400@qq.com","author":"Hankin","message":"UPDATE gitflow.png TO ./gitflow.png FOR vuepress"},{"hash":"2d17a548cd5b6532dca581738f7f8f92cc82eca8","time":1776151412000,"email":"554553400@qq.com","author":"Hankin","message":"UPDATE vuepress"},{"hash":"14640e42c23f6018afc524966226ecc918b33dd5","time":1775715334000,"email":"554553400@qq.com","author":"Hankin","message":"UPDATE git/gitflow.md"},{"hash":"2689717f0c157f0914706bdbd55f67b834581b2d","time":1746356629000,"email":"hankin@catmes.com","author":"Hankin","message":"ADD CMD: git fetch origin 17.0:17.0"},{"hash":"11827c0a27afe10f987e1399dbc4495960954052","time":1745983924000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE gitflow"},{"hash":"9ae12b1cdd758c0e9e928fa191634fed60f97af5","time":1745981302000,"email":"whq78164@gmail.com","author":"Hankin","message":"ADD gitflow"}]},"filePathRelative":"git/gitflow.md"}`),a={name:`gitflow.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h2 id="开发原则" tabindex="-1"><a class="header-anchor" href="#开发原则"><span>开发原则</span></a></h2><p><code>开发原则，优先级从上往下，依次排列。</code></p><h3 id="小步快跑原则" tabindex="-1"><a class="header-anchor" href="#小步快跑原则"><span>小步快跑原则</span></a></h3><ul><li>缩短功能合并周期，方便团队成员，及时共享开发进度。方便调试，更早发现问题。</li><li>【个人功能开发分支】长期单打独斗，合并到主线，容易出现代码冲突。</li></ul><h3 id="开发分支最新原则" tabindex="-1"><a class="header-anchor" href="#开发分支最新原则"><span>开发分支最新原则</span></a></h3><p>【dev公共分支】进度保持最新，也包括紧急BUG修复的代码。其他分支的更改，都及时同步到开发分支上。</p><h3 id="单向合并原则" tabindex="-1"><a class="header-anchor" href="#单向合并原则"><span>单向合并原则</span></a></h3><p>更新频繁（频繁git push或则频繁被Merge）的分支，向更新不频繁的稳定分支合并。</p><p>如下所示：</p><ol><li>【个人功能开发分支】合并到（Merge into）【dev公共分支】</li><li>【dev公共分支】合并到（Merge into）【test测试分支】</li><li>【test测试分支】合并到（Merge into）【release预发布分支】</li><li>【release预发布分支】合并到（Merge into）【master生产分支】</li></ol><p>例：【release预发布分支】短期内发布了 <code>v1.1.1</code> ~ <code>v1.1.5</code> 5个小版本，但生产分支只使用 <code>v1.1.5</code></p><p><code>特例</code>：</p><ul><li>解决分支合冲突：需要把【dev公共分支】反向合并到【个人功能开发分支】。</li><li>紧急更新流程：虽然 <code>违反【单向合并原则】</code>，但满足 <code>【开发分支最新原则】</code>。</li></ul><h2 id="git开发工作流" tabindex="-1"><a class="header-anchor" href="#git开发工作流"><span>Git开发工作流</span></a></h2><ul><li>myname: 团队成员【个人功能开发分支】</li><li>dev: 团队公共分支</li><li>开发周期建议：1天1次commit提交和push推送。1周至少1次分支合并。</li></ul><h3 id="个人独立分支开发" tabindex="-1"><a class="header-anchor" href="#个人独立分支开发"><span>个人独立分支开发</span></a></h3><ol><li>同步最新的【dev公共分支】到本地。【重要】</li><li>基于最新的【dev公共分支】，创建【个人功能开发分支】。在此基础上开发。</li><li>【个人功能开发分支】开发完成，推送到远程库。</li><li>线上提交【个人功能开发分支】into【dev公共分支】的合并请求。如有冲突，见 <code>解决分支合并冲突</code> 部分。</li><li>如果【个人功能开发分支】已被合并到【dev公共分支】，必须删除。【重要】</li></ol><p>命令行示例：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 拉取最新的dev分支到本地</span></span>
<span class="line"><span class="token function">git</span> pull origin dev</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在现有的dev分支上，创建自己本地的开发分支。并切换过去。</span></span>
<span class="line"><span class="token function">git</span> checkout <span class="token parameter variable">-b</span> myname</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 本地开发，在自己本地仓库的开发分支中，保存开发进度。</span></span>
<span class="line"><span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span></span>
<span class="line"><span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;UPDATE SOMETHING&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 推送自己的分支到远程仓库，并提交分支合并请求</span></span>
<span class="line"><span class="token function">git</span> push origin myname</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 切换到本地dev分支。使用git checkout dev 或 git switch dev</span></span>
<span class="line"><span class="token function">git</span> checkout dev</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 删除自己的本地分支</span></span>
<span class="line"><span class="token function">git</span> branch <span class="token parameter variable">-d</span> myname</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：</p><ol><li>【个人工作分支】合并到公共分支，有小功能完成，<code>没明显BUG，就可以合并</code>。比如一个表单页面。</li><li>每次创建【个人工作分支】，都是基于最新的【dev公共分支】。</li><li>为保证第2点，每次线上仓库合并成功后，当前的【个人工作分支】必须删掉。</li></ol><h3 id="解决分支合并冲突" tabindex="-1"><a class="header-anchor" href="#解决分支合并冲突"><span>解决分支合并冲突</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 更新本地dev公共分支</span></span>
<span class="line"><span class="token function">git</span> checkout dev</span>
<span class="line"><span class="token function">git</span> pull origin dev</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 切换到个人功能分支（可从远程重新拉取，origin代表远程仓库）</span></span>
<span class="line"><span class="token comment"># 如本地的个人功能分支，已被删除，则基于远程再创建</span></span>
<span class="line"><span class="token function">git</span> checkout <span class="token parameter variable">-b</span> feature/xxx origin/feature/xxx</span>
<span class="line"><span class="token comment"># 如本地的个人功能分支未删除，就直接切换过去</span></span>
<span class="line"><span class="token function">git</span> checkout feature/xxx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 合并最新dev分支（产生冲突）</span></span>
<span class="line"><span class="token comment"># 合并方向：</span></span>
<span class="line"><span class="token function">git</span> merge dev</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 解决冲突</span></span>
<span class="line"><span class="token function">git</span> status</span>
<span class="line"><span class="token comment"># 手动编辑冲突文件（保留需要的代码，删除冲突标记&lt;&lt;&lt;&lt;&lt;&lt;&lt;, =======, &gt;&gt;&gt;&gt;&gt;&gt;&gt;）</span></span>
<span class="line"><span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span></span>
<span class="line"><span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;Merge dev into feature/xxx and resolve conflicts&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 推送到远程</span></span>
<span class="line"><span class="token comment"># 如果推送被拒绝（因分支历史变更），使用：git push --force-with-lease origin feature/xxx</span></span>
<span class="line"><span class="token function">git</span> push origin feature/xxx</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="团队公共分支合并" tabindex="-1"><a class="header-anchor" href="#团队公共分支合并"><span>团队公共分支合并</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 拉取远程主分支和成员的个人分支</span></span>
<span class="line"><span class="token function">git</span> pull origin dev</span>
<span class="line"><span class="token function">git</span> pull origin myname</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 保证现有分支为公共分支。查看分支和切换分支命令如下：</span></span>
<span class="line"><span class="token comment"># git branch</span></span>
<span class="line"><span class="token comment"># git checkout dev 或者 git switch dev</span></span>
<span class="line"><span class="token function">git</span> branch</span>
<span class="line"><span class="token function">git</span> switch dev</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 合并个人分支到团队的公共分支中</span></span>
<span class="line"><span class="token function">git</span> merge myname</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 测试公共是否正常，有代码冲突就解决冲突，然后推送到远程库</span></span>
<span class="line"><span class="token function">git</span> push origin dev</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 删除成员的个人分支</span></span>
<span class="line"><span class="token function">git</span> branch <span class="token parameter variable">-d</span> myname</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="紧急更新流程" tabindex="-1"><a class="header-anchor" href="#紧急更新流程"><span>紧急更新流程</span></a></h3><p>在满足【开发分支最新原则】的基础上，可以不满足【单向合并原则】，创建的特例的【紧急更新分支】。</p><ul><li>【紧急更新分支】，可以换成其他名字。</li><li>【master生产分支】也可以换成【release预发布分支】或【test测试分支】。</li></ul><ol><li>【紧急更新分支】基于【master生产分支】创建。</li><li>更新后，合并到【master生产分支】，并同步合并到【dev公共分支】。</li></ol><p><img src="https://gitee.com/catmes/easywork/raw/master/git/gitflow.png" alt="gitflow" title="gitflow"></p><h3 id="个人功能分支操作" tabindex="-1"><a class="header-anchor" href="#个人功能分支操作"><span>个人功能分支操作</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 删除名为myname的远程分支</span></span>
<span class="line"><span class="token function">git</span> push origin <span class="token parameter variable">--delete</span> myname</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 先切换到其他分支，然后删除本地myname分支</span></span>
<span class="line"><span class="token function">git</span> switch dev</span>
<span class="line"><span class="token function">git</span> branch <span class="token parameter variable">-d</span> myname</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="查看" tabindex="-1"><a class="header-anchor" href="#查看"><span>查看</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 查看提交状态</span></span>
<span class="line"><span class="token function">git</span> status</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看本地分支</span></span>
<span class="line"><span class="token function">git</span> branch</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看本地和远程的所有分支</span></span>
<span class="line"><span class="token function">git</span> branch <span class="token parameter variable">-a</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="分支" tabindex="-1"><a class="header-anchor" href="#分支"><span>分支</span></a></h2><ul><li>https://git-scm.com/docs/git-branch/zh_HANS-CN</li><li>https://git-scm.com/docs/git-switch/zh_HANS-CN</li></ul><h3 id="新建分支" tabindex="-1"><a class="header-anchor" href="#新建分支"><span>新建分支</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 基于本地当前分支，创建新分支feature1，并切换过去</span></span>
<span class="line"><span class="token function">git</span> checkout <span class="token parameter variable">-b</span> feature1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 基于origin远程库，在本地创建同名分支，并切换过去</span></span>
<span class="line"><span class="token function">git</span> checkout <span class="token parameter variable">-b</span> feature1 origin/feature1 </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 拉取远程17.0分支到本地</span></span>
<span class="line"><span class="token function">git</span> fetch origin <span class="token number">17.0</span>:17.0</span>
<span class="line"><span class="token comment"># 切换到17.0分支</span></span>
<span class="line"><span class="token function">git</span> checkout <span class="token number">17.0</span></span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="切换分支" tabindex="-1"><a class="header-anchor" href="#切换分支"><span>切换分支</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 切换到本地分支feature1</span></span>
<span class="line"><span class="token function">git</span> checkout feature1</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建全新的空白分支 git version &lt; 2.23</span></span>
<span class="line"><span class="token function">git</span> checkout <span class="token parameter variable">--orphan</span> <span class="token operator">&lt;</span>new_branch_name<span class="token operator">&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建全新的空白分支 git version &gt;= 2.23</span></span>
<span class="line"><span class="token function">git</span> switch <span class="token parameter variable">--orphan</span> <span class="token operator">&lt;</span>new_branch_name<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="清理分支" tabindex="-1"><a class="header-anchor" href="#清理分支"><span>清理分支</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># git branch -D &lt;branch_name&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 1. 查看远程跟踪分支</span></span>
<span class="line"><span class="token function">git</span> branch <span class="token parameter variable">-r</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 清理陈旧的远程跟踪分支</span></span>
<span class="line"><span class="token function">git</span> remote prune origin</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 删除所有不在本地的远程跟踪分支</span></span>
<span class="line"><span class="token function">git</span> fetch <span class="token parameter variable">--prune</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="克隆仓库" tabindex="-1"><a class="header-anchor" href="#克隆仓库"><span>克隆仓库</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 克隆包含仓库的全部提交历史</span></span>
<span class="line"><span class="token function">git</span> clone https://github.com/odoo/odoo.git</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 克隆17.0分支</span></span>
<span class="line"><span class="token function">git</span> clone <span class="token parameter variable">-b</span> <span class="token number">17.0</span> https://github.com/odoo/odoo.git odoo17</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 克隆仓库包含最近3次提交历史</span></span>
<span class="line"><span class="token function">git</span> clone <span class="token parameter variable">--depth</span> <span class="token number">3</span> <span class="token parameter variable">-b</span> <span class="token number">17.0</span> --single-branch https://github.com/odoo/odoo.git odoo17</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>参数说明:</p><ul><li><code>--depth 3</code> : 只克隆最近提交的3条记录到本地。</li><li><code>-b 17.0 --single-branch</code> : 只拉取分支 <code>17.0</code></li></ul><h2 id="拉取仓库" tabindex="-1"><a class="header-anchor" href="#拉取仓库"><span>拉取仓库</span></a></h2><p><code>git pull &lt;远程主机名&gt; &lt;远程分支名&gt;:&lt;本地分支名&gt;</code></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 完整命令：git pull origin master:master</span></span>
<span class="line"><span class="token function">git</span> pull origin master</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 修改全局配置，禁止 git pull 默认拉取所有分支。</span></span>
<span class="line"><span class="token function">git</span> config <span class="token parameter variable">--global</span> pull.only <span class="token boolean">true</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 简写命令</span></span>
<span class="line"><span class="token function">git</span> pull</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="推送仓库" tabindex="-1"><a class="header-anchor" href="#推送仓库"><span>推送仓库</span></a></h2><p><code>git push &lt;远程主机名&gt; &lt;本地分支名&gt;:&lt;远程分支名&gt;</code></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 完整命令</span></span>
<span class="line"><span class="token function">git</span> push origin master:master</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 简写命令</span></span>
<span class="line"><span class="token function">git</span> push</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 首次推送使用 git push -u origin 分支名</span></span>
<span class="line"><span class="token function">git</span> push <span class="token parameter variable">-u</span> origin master</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a href="https://blog.csdn.net/weixin_47695827/article/details/141824669" target="_blank" rel="noopener noreferrer">git switch和git checkout</a></p><h2 id="远程库增删改查" tabindex="-1"><a class="header-anchor" href="#远程库增删改查"><span>远程库增删改查</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">git</span> remote <span class="token function">add</span> <span class="token operator">&lt;</span>远程库名<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>远程库地址<span class="token operator">&gt;</span></span>
<span class="line"><span class="token function">git</span> remote remove <span class="token operator">&lt;</span>远程库名<span class="token operator">&gt;</span></span>
<span class="line"><span class="token function">git</span> remote <span class="token function">rename</span> <span class="token operator">&lt;</span>原远程库名<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>新远程库名<span class="token operator">&gt;</span></span>
<span class="line"><span class="token function">git</span> remote set-url <span class="token operator">&lt;</span>远程库名<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>远程库地址<span class="token operator">&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看所有远程库信息</span></span>
<span class="line"><span class="token function">git</span> remote <span class="token parameter variable">-v</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="示意图" tabindex="-1"><a class="header-anchor" href="#示意图"><span>示意图</span></a></h2><p><img src="/easywork/assets/gitflow-BpuxsLtb.png" alt="gitflow"></p><hr><blockquote><p>git 创建空分支 https://blog.csdn.net/linyichao1314/article/details/136956650 Git 实用技巧2——新建空白分支 | 重命名分支 | 回退到历史 commit https://blog.csdn.net/m0_49270962/article/details/137759940</p></blockquote>`,59)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};