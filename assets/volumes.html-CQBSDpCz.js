import{_ as e,c as n,e as a,o as l}from"./app-CbLqF3yI.js";const i={};function d(c,s){return l(),n("div",null,[...s[0]||(s[0]=[a(`<p>Docker Compose的容器挂载和Docker Volumes</p><h2 id="配置示例" tabindex="-1"><a class="header-anchor" href="#配置示例"><span>配置示例</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">version: &#39;3.1&#39;</span>
<span class="line">services:</span>
<span class="line">  web:</span>
<span class="line">    image: odoo:17.0</span>
<span class="line">    depends_on:</span>
<span class="line">      - db</span>
<span class="line">    ports:</span>
<span class="line">      - &quot;8069:8069&quot;</span>
<span class="line">    volumes:</span>
<span class="line">      - odoo-web-data:/var/lib/odoo</span>
<span class="line">    environment:</span>
<span class="line">      - PASSWORD_FILE=/app/config/db_password</span>
<span class="line">    secrets:</span>
<span class="line">      - source: postgresql_password</span>
<span class="line">        target: /app/config/db_password</span>
<span class="line">  db:</span>
<span class="line">    image: postgres:15</span>
<span class="line">    environment:</span>
<span class="line">      - POSTGRES_PASSWORD_FILE=/run/secrets/postgresql_password</span>
<span class="line">      - PGDATA=/var/lib/postgresql/data/pgdata</span>
<span class="line">    volumes:</span>
<span class="line">      - odoo-db-data:/var/lib/postgresql/data/pgdata</span>
<span class="line">    secrets:</span>
<span class="line">      - postgresql_password</span>
<span class="line"></span>
<span class="line">volumes:</span>
<span class="line">  odoo-web-data:</span>
<span class="line">  odoo-db-data:</span>
<span class="line"></span>
<span class="line">secrets:</span>
<span class="line">  postgresql_password:</span>
<span class="line">    file: odoo_pg_pass</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面配置中，定义了2个Docker卷（Docker Volumes）：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">volumes:</span>
<span class="line">  odoo-web-data:</span>
<span class="line">  odoo-db-data:</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Docker 卷的主要作用是：</p><ul><li>持久化数据：将容器内的数据存储到宿主机或其他外部存储中，确保数据不会因容器的删除而丢失。</li><li>共享数据：多个容器可以共享同一个卷，方便数据交换。</li><li>性能优化：卷通常比绑定挂载（Bind Mounts）性能更好，适合存储大量数据。</li></ul><h2 id="卷的命名和匿名卷" tabindex="-1"><a class="header-anchor" href="#卷的命名和匿名卷"><span>卷的命名和匿名卷</span></a></h2><ul><li>命名卷：如 odoo-web-data 和 odoo-db-data，是显式命名的卷，便于管理和重用。</li><li>匿名卷：如果只指定容器内的路径（如 - /var/lib/odoo），Docker 会创建一个匿名卷。匿名卷的名称由 Docker 自动生成，不易管理。</li></ul><h2 id="存储位置" tabindex="-1"><a class="header-anchor" href="#存储位置"><span>存储位置</span></a></h2><p>默认情况下，Docker 卷存储在 Docker 管理的宿主机目录中，而不是由用户直接指定。</p><ul><li>Linux: <code>/var/lib/docker/volumes/</code></li><li>Windows: <code>C:\\ProgramData\\Docker\\volumes\\</code></li></ul><p>例: <code>/var/lib/docker/volumes/odoo-web-data/_data/</code>，其中 <code>_data</code> 是卷的实际数据存储目录</p><h3 id="查看-docker-卷的宿主机路径" tabindex="-1"><a class="header-anchor" href="#查看-docker-卷的宿主机路径"><span>查看 Docker 卷的宿主机路径</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查看所有卷</span>
<span class="line">docker volume ls</span>
<span class="line"></span>
<span class="line"># 查看某个卷的详细信息</span>
<span class="line">docker volume inspect &lt;volume_name&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="自定义-docker-卷的宿主机目录" tabindex="-1"><a class="header-anchor" href="#自定义-docker-卷的宿主机目录"><span>自定义 Docker 卷的宿主机目录</span></a></h3><ol><li>使用绑定挂载（Bind Mount）: 绑定挂载直接将宿主机的某个目录挂载到容器中，而不是使用 Docker 管理的卷。</li><li>使用本地卷驱动（Local Volume Driver）: 通过 driver_opts 指定卷的宿主机目录</li></ol><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">volumes:</span>
<span class="line">  odoo-web-data:</span>
<span class="line">    driver: local</span>
<span class="line">    driver_opts:</span>
<span class="line">      type: none</span>
<span class="line">      o: bind</span>
<span class="line">      device: /host/path/to/odoo-web-data</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="备份和恢复" tabindex="-1"><a class="header-anchor" href="#备份和恢复"><span>备份和恢复</span></a></h2><p>可以使用 docker run 命令备份卷数据：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">docker run --rm -v odoo-db-data:/source -v $(pwd):/backup busybox tar cvf /backup/odoo-db-data.tar /source</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="卷的生命周期" tabindex="-1"><a class="header-anchor" href="#卷的生命周期"><span>卷的生命周期</span></a></h2><ul><li>创建卷：当运行 docker-compose up 时，如果卷不存在，Docker 会自动创建它。</li><li>删除卷：默认情况下，运行 docker-compose down 不会删除卷。如果需要删除卷，可以使用 docker-compose down -v。</li><li>查看卷：可以使用 <code>docker volume ls</code> 查看所有卷，或 <code>docker volume inspect &lt;volume_name&gt;</code> 查看卷的详细信息。</li></ul><h2 id="卷的驱动选项" tabindex="-1"><a class="header-anchor" href="#卷的驱动选项"><span>卷的驱动选项</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">volumes:</span>
<span class="line">  odoo-web-data:</span>
<span class="line">    driver: local</span>
<span class="line">    driver_opts:</span>
<span class="line">      type: nfs</span>
<span class="line">      o: addr=192.168.1.100,rw</span>
<span class="line">      device: &quot;:/path/to/nfs/share&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这会将 odoo-web-data 卷配置为使用 NFS 驱动。</p>`,26)])])}const o=e(i,[["render",d]]),p=JSON.parse('{"path":"/docker/volumes.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1748797129000,"contributors":[{"name":"Hankin","username":"Hankin","email":"hankin@catmes.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"9050ff3d6218227a004a1d381d9dcb0fd7980e71","time":1748797129000,"email":"hankin@catmes.com","author":"Hankin","message":"UPDATE nodejs: nvm, n8n. docker: proxy registry volumes"}]},"filePathRelative":"docker/volumes.md"}');export{o as comp,p as data};
