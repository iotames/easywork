import{_ as i,c,e as n,a,b as e,d,w as r,r as t,o as p}from"./app-5yuJsK7O.js";const o={};function u(m,s){const l=t("RouteLink");return p(),c("div",null,[s[2]||(s[2]=n(`<h2 id="docker配置" tabindex="-1"><a class="header-anchor" href="#docker配置"><span>Docker配置</span></a></h2><ul><li>配置文件：<code>/etc/docker/daemon.json</code></li><li>私有镜像仓库地址配置：<code>{ &quot;insecure-registries&quot;: [&quot;172.16.160.33:9000&quot;] }</code></li><li>docker镜像和容器等工作文件所在目录：<code>/var/lib/docker/</code></li><li>更改数据目录（也可以使用软连接指向 <code>/var/lib/docker</code>）：<code>{ &quot;data-root&quot;: &quot;/data/docker&quot; }</code></li></ul><p>重载进程或docker使配置立即生效：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">systemctl daemon-reload</span>
<span class="line">systemctl restart docker.service</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="环境变量" tabindex="-1"><a class="header-anchor" href="#环境变量"><span>环境变量</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> --env-file ./env.list your_image_name</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&#39;3&#39;</span></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">your_service</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> your_image_name</span>
<span class="line">    <span class="token key atrule">env_file</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ./env.list</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="日志配置" tabindex="-1"><a class="header-anchor" href="#日志配置"><span>日志配置</span></a></h2><p>容器默认使用 json-file 日志驱动，其日志文件（如 37cf0f6b...-json.log）无自动轮转策略，很可能导致磁盘爆炸。</p><ul><li>如果已有容器内，已经有庞大的日志文件，可先删除。重启后会新建日志文件。然后限定日志大小。</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">du</span> <span class="token parameter variable">-sh</span> /var/lib/docker/containers/*/*-json.log</span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-rf</span> /var/lib/docker/containers/37cf0f6b2bd911feba7a99be9f8082e968e3573830459ca17d529ef1ed687757/37cf0f6b2bd911feba7a99be9f8082e968e3573830459ca17d529ef1ed687757-json.log</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>针对所有容器：修改配置文件 <code>/etc/docker/daemon.json</code></li></ul><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"><span class="token comment">// /etc/docker/daemon.json</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;log-driver&quot;</span><span class="token operator">:</span> <span class="token string">&quot;json-file&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;log-opts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;max-size&quot;</span><span class="token operator">:</span> <span class="token string">&quot;100m&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;max-file&quot;</span><span class="token operator">:</span> <span class="token string">&quot;3&quot;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重启容器服务，使配置生效：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">systemctl daemon-reload</span>
<span class="line">systemctl restart docker</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>针对单个运行容器</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\\</span></span>
<span class="line">  --log-driver<span class="token operator">=</span>json-file <span class="token punctuation">\\</span></span>
<span class="line">  --log-opt max-size<span class="token operator">=</span>100m <span class="token punctuation">\\</span></span>
<span class="line">  --log-opt max-file<span class="token operator">=</span><span class="token number">3</span> <span class="token punctuation">\\</span></span>
<span class="line">  gitlab/gitlab-ee:latest</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="镜像仓库" tabindex="-1"><a class="header-anchor" href="#镜像仓库"><span>镜像仓库</span></a></h2>`,18)),a("ul",null,[a("li",null,[s[1]||(s[1]=e("registry.md: ",-1)),d(l,{to:"/docker/registry.html"},{default:r(()=>[...s[0]||(s[0]=[e("Docker镜像仓库的使用",-1)])]),_:1})])]),s[3]||(s[3]=n(`<h2 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令"><span>常用命令</span></a></h2><h3 id="系统服务命令" tabindex="-1"><a class="header-anchor" href="#系统服务命令"><span>系统服务命令</span></a></h3><ul><li>重载 <code>systemctl daemon-reload</code></li><li>重启 <code>systemctl restart docker</code></li><li>开机启动 <code>systemctl enable docker</code></li><li>停止服务 <code>systemctl stop docker</code></li></ul><h3 id="docker管理命令" tabindex="-1"><a class="header-anchor" href="#docker管理命令"><span>Docker管理命令</span></a></h3><ul><li>Docker系统管理</li></ul><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查看网络列表</span>
<span class="line">docker network ls</span>
<span class="line"># 查看数据卷列表</span>
<span class="line">docker volume ls</span>
<span class="line"></span>
<span class="line"># 查看Docker磁盘使用情况</span>
<span class="line">docker system df</span>
<span class="line"></span>
<span class="line"># 删除所有（本地）没有被容器使用的volume. 常用</span>
<span class="line">docker volume prune</span>
<span class="line"></span>
<span class="line"># 命令可以用于清理磁盘，删除关闭的容器、无用的数据卷和网络，以及dangling镜像(即无tag的镜像)。</span>
<span class="line">docker system prune</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>镜像管理</li></ul><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查看本地所有镜像：</span>
<span class="line">docker images</span>
<span class="line"></span>
<span class="line"># 拉取下载远程镜像到本地</span>
<span class="line">docker pull mysql:5.7</span>
<span class="line">docker pull nginx</span>
<span class="line"></span>
<span class="line"># 根据ID查看镜像详情</span>
<span class="line">docker inspect imageId</span>
<span class="line"></span>
<span class="line"># 根据关键词，从远程仓库查找镜像</span>
<span class="line">docker search keywords</span>
<span class="line"></span>
<span class="line"># 镜像删除。可以用镜像标签或镜像ID。</span>
<span class="line"># 当image有多个tag标签时，此命令只删除指定tag镜像标签，不会删除其他镜像tag。而当只有一个tag标签时，使用docker rmi 会彻底删除该镜像，包括该镜像的所有的AUFS层文件。</span>
<span class="line">docker rmi centos:prod</span>
<span class="line"></span>
<span class="line"># 删除所有镜像：</span>
<span class="line">docker rmi $(docker images -q -a)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>容器实例管理</li></ul><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 显示状态为运行（Up）的容器</span>
<span class="line">docker ps</span>
<span class="line"># 显示所有容器,包括运行中（Up）的和退出的(Exited)</span>
<span class="line">docker ps -a</span>
<span class="line"></span>
<span class="line"># 创建并启动一个容器</span>
<span class="line">docker run</span>
<span class="line"># 停止容器运行</span>
<span class="line">docker stop</span>
<span class="line"># 启动已停止的容器</span>
<span class="line">docker start</span>
<span class="line"># 重启容器</span>
<span class="line">docker restart</span>
<span class="line"># 删除已停止的容器</span>
<span class="line">docker rm</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10))])}const b=i(o,[["render",u]]),k=JSON.parse('{"path":"/docker/","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1761490915000,"contributors":[{"name":"hankin","username":"hankin","email":"whq78164@qq.com","commits":1,"url":"https://github.com/hankin"},{"name":"Hankin","username":"Hankin","email":"hankin@catmes.com","commits":7,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"ebf410507759169eab5907f28d107ec2e541d628","time":1761490915000,"email":"hankin@catmes.com","author":"Hankin","message":"UPDATE docker"},{"hash":"27e443d4ad6b344386f997733b1fccb5f5717621","time":1761153240000,"email":"hankin@catmes.com","author":"Hankin","message":"REMOVE legacy jekyll dir"},{"hash":"d5fa5dc72419cc5f0709bab1770bf705b4587345","time":1761145596000,"email":"hankin@catmes.com","author":"Hankin","message":"ADD ruby. UPDATE set for jekyll"},{"hash":"efee5832348a448d41c83c49df42727545990f6b","time":1751895209000,"email":"hankin@catmes.com","author":"Hankin","message":"UPDATE docker-compose.yml for kestra"},{"hash":"8ec912ce177b5a14656c3f517b3738dc0ddbeff1","time":1751522674000,"email":"whq78164@gmail.com","author":"Hankin","message":"UPDATE log config"},{"hash":"9050ff3d6218227a004a1d381d9dcb0fd7980e71","time":1748797129000,"email":"hankin@catmes.com","author":"Hankin","message":"UPDATE nodejs: nvm, n8n. docker: proxy registry volumes"},{"hash":"962828e915fbc9197b9cb4f6f8a65cc8efbf16ac","time":1748783402000,"email":"hankin@catmes.com","author":"Hankin","message":"UPDATE docker"},{"hash":"b1088144853b3582849339de1691bc8427006d67","time":1745855061000,"email":"whq78164@qq.com","author":"hankin","message":"first commit"}]},"filePathRelative":"docker/README.md"}');export{b as comp,k as data};
