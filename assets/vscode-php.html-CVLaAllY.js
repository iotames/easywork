import{_ as s,c as a,e,o as i}from"./app-vaxsyKMw.js";const l={};function p(c,n){return i(),a("div",null,[...n[0]||(n[0]=[e(`<h2 id="安装vscode" tabindex="-1"><a class="header-anchor" href="#安装vscode"><span>安装vscode</span></a></h2><p>https://code.visualstudio.com/Download</p><p>按快捷键 <code>Ctl+Shift+X</code>，在应用商店中搜索扩展: <code>Chinese (Simplified)</code>, 安装简体中文扩展。</p><h2 id="php下载和配置" tabindex="-1"><a class="header-anchor" href="#php下载和配置"><span>PHP下载和配置</span></a></h2><h3 id="php下载" tabindex="-1"><a class="header-anchor" href="#php下载"><span>PHP下载</span></a></h3><p>https://windows.php.net/downloads/releases/archives/</p><p>下载并解压对应平台的PHP压缩包，并添加解压后的目录到 <code>PATH环境变量</code> 这边下载的PHP版本是: <a href="https://windows.php.net/downloads/releases/archives/php-7.2.9-nts-Win32-VC15-x64.zip" target="_blank" rel="noopener noreferrer">php-7.2.9-nts-Win32-VC15-x64.zip</a></p><h3 id="php配置" tabindex="-1"><a class="header-anchor" href="#php配置"><span>PHP配置</span></a></h3><ol><li>复制 <code>php.ini-development.ini</code> 或 <code>php.ini-production</code> 为 <code>php.ini</code></li><li>在 <code>php.ini</code> 根据实际情况，设置扩展插件目录。如: <code>extension_dir = &quot;ext&quot;</code></li><li>关闭开启插件的注释。</li></ol><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code class="language-ini"><span class="line"><span class="token key attr-name">memory_limit</span> <span class="token punctuation">=</span> <span class="token value attr-value">512M</span></span>
<span class="line"><span class="token comment">; 最大执行时间，默认30秒。</span></span>
<span class="line"><span class="token comment">; PHP老项目首次启动，生成缓存可能耗时较高。</span></span>
<span class="line"><span class="token key attr-name">max_execution_time</span> <span class="token punctuation">=</span> <span class="token value attr-value">300</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">; Directory in which the loadable extensions (modules) reside.</span></span>
<span class="line"><span class="token comment">; http://php.net/extension-dir</span></span>
<span class="line"><span class="token comment">;extension_dir = &quot;./&quot;</span></span>
<span class="line"><span class="token comment">; On windows:</span></span>
<span class="line"><span class="token key attr-name">extension_dir</span> <span class="token punctuation">=</span> <span class="token value attr-value">&quot;<span class="token inner-value">ext</span>&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">; 取消注释，开启常用扩展</span></span>
<span class="line"><span class="token key attr-name">extension</span><span class="token punctuation">=</span><span class="token value attr-value">curl</span></span>
<span class="line"><span class="token key attr-name">extension</span><span class="token punctuation">=</span><span class="token value attr-value">openssl</span></span>
<span class="line"><span class="token key attr-name">extension</span><span class="token punctuation">=</span><span class="token value attr-value">mbstring</span></span>
<span class="line"><span class="token key attr-name">extension</span><span class="token punctuation">=</span><span class="token value attr-value">fileinfo</span></span>
<span class="line"><span class="token comment">; 某些PHP框架使用mysqli</span></span>
<span class="line"><span class="token key attr-name">extension</span><span class="token punctuation">=</span><span class="token value attr-value">mysqli</span></span>
<span class="line"><span class="token comment">; 某些框架例如symfony使用pdo</span></span>
<span class="line"><span class="token key attr-name">extension</span><span class="token punctuation">=</span><span class="token value attr-value">pdo_mysql</span></span>
<span class="line"><span class="token comment">;extension=pdo_pgsql</span></span>
<span class="line"><span class="token comment">;extension=pdo_sqlite</span></span>
<span class="line"><span class="token comment">;extension=pgsql</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>第三方依赖库下载: https://windows.php.net/downloads/php-sdk/deps/vc15/x64/</li></ul><h3 id="启动php-cgi" tabindex="-1"><a class="header-anchor" href="#启动php-cgi"><span>启动php-cgi：</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">php-cgi.exe <span class="token parameter variable">-b</span> <span class="token number">127.0</span>.0.1:9000 <span class="token parameter variable">-c</span> php.ini</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="vscode的php相关插件" tabindex="-1"><a class="header-anchor" href="#vscode的php相关插件"><span>vscode的PHP相关插件</span></a></h2><ul><li><code>PHP Intelephense</code>: 代码提示、追踪跳转插件</li><li><code>PHP Debug</code>: 代码调试插件，使用前面下的xdebug动态链接库来调试（可选）</li><li><code>PHP Server</code>: Web服务器插件，方便本地打卡PHP网页调试（可选）</li></ul><p>vscode的 <code>settings.json</code> 文件配置如下:</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;php.validate.executablePath&quot;</span><span class="token operator">:</span> <span class="token string">&quot;D:\\\\App\\\\php-7.2.9-nts-Win32-VC15-x64\\\\php.exe&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以下为可选:</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;php.debug.executablePath&quot;</span><span class="token operator">:</span> <span class="token string">&quot;D:\\\\App\\\\php-7.2.9-nts-Win32-VC15-x64\\\\php.exe&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;phpserver.phpConfigPath&quot;</span><span class="token operator">:</span> <span class="token string">&quot;D:\\\\App\\\\php-7.2.9-nts-Win32-VC15-x64\\\\php.ini&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;phpserver.phpPath&quot;</span><span class="token operator">:</span> <span class="token string">&quot;D:\\\\App\\\\php-7.2.9-nts-Win32-VC15-x64\\\\php.exe&quot;</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span>    </span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="启动web服务" tabindex="-1"><a class="header-anchor" href="#启动web服务"><span>启动Web服务</span></a></h2><ul><li><p>nginx for Windows: https://nginx.org/en/docs/windows.html</p></li><li><p>nginx 下载: https://nginx.org/en/download.html</p></li><li><p>配置文件: <code>conf/nginx.conf</code></p></li><li><p>启动NGINX： <code>start nginx.exe</code></p></li></ul><p>Nginx重载配置或退出：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">nginx.exe <span class="token parameter variable">-s</span> reload</span>
<span class="line">nginx.exe <span class="token parameter variable">-s</span> quit</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="xdebug插件-可选" tabindex="-1"><a class="header-anchor" href="#xdebug插件-可选"><span>Xdebug插件（可选）</span></a></h2><h3 id="xdebug下载" tabindex="-1"><a class="header-anchor" href="#xdebug下载"><span>xdebug下载</span></a></h3><p>进入 <code>xdebug</code> 官网的下载地址: https://xdebug.org/download/historical，下载 <code>对应PHP版本</code> 的动态链接库二进制文件。 这边下载的文件是: <a href="https://xdebug.org/files/php_xdebug-3.1.6-7.2-vc15-nts-x86_64.dll" target="_blank" rel="noopener noreferrer">php_xdebug-3.1.6-7.2-vc15-nts-x86_64.dll</a></p><h3 id="xdebug安装" tabindex="-1"><a class="header-anchor" href="#xdebug安装"><span>xdebug安装</span></a></h3><ol><li><p>进入PHP目录下的 <code>ext</code> 目录中，放入前面下载的动态链接库文件 <code>php_xdebug-3.1.6-7.2-vc15-nts-x86_64.dll</code></p></li><li><p>重命名PHP目录下的 <code>php.ini-development</code> 为 <code>php.ini</code>. 在末尾添加配置:</p></li></ol><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code class="language-ini"><span class="line"><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">xdebug</span><span class="token punctuation">]</span></span></span>
<span class="line"><span class="token key attr-name">zend_extension</span><span class="token punctuation">=</span><span class="token value attr-value">&quot;<span class="token inner-value">D:/App/php-7.2.9-nts-Win32-VC15-x64/ext/php_xdebug-3.1.6-7.2-vc15-nts-x86_64.dll</span>&quot;</span></span>
<span class="line"><span class="token key attr-name">xdebug.remote_enable</span> <span class="token punctuation">=</span> <span class="token value attr-value">1</span></span>
<span class="line"><span class="token key attr-name">xdebug.remote_autostart</span> <span class="token punctuation">=</span> <span class="token value attr-value">1</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="报错处理" tabindex="-1"><a class="header-anchor" href="#报错处理"><span>报错处理</span></a></h2><p><code>nginx</code> 在浏览器输出: <code>No input file specified.</code> 错误</p><ol><li>检查 <code>nginx</code> 的 <code>*.conf</code> 配置文件(如: <code>conf/nginx.conf</code>)的 <code>root</code>, <code>index</code>, 和 <code>fastcgi_param</code> 三个配置项</li></ol><p>将 <code>fastcgi_param SCRIPT_FILENAME /scripts$fastcgi_script_name;</code> 改为: <code>fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;</code> 或: <code>fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;</code></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">    server {</span>
<span class="line">        listen 8081;</span>
<span class="line">        listen [::]:8081;</span>
<span class="line">        server_name example.com;</span>
<span class="line">        root D:\\\\projects\\\\yourphpapp\\\\public;</span>
<span class="line"></span>
<span class="line">        index index.html index.php;</span>
<span class="line">    </span>
<span class="line">        charset utf-8;</span>
<span class="line">    </span>
<span class="line">        location / {</span>
<span class="line">            try_files $uri $uri/ /index.php?$query_string;</span>
<span class="line">        }</span>
<span class="line">        #error_page  404              /404.html;</span>
<span class="line"></span>
<span class="line">        # redirect server error pages to the static page /50x.html</span>
<span class="line">        #</span>
<span class="line">        error_page   500 502 503 504  /50x.html;</span>
<span class="line">        location = /50x.html {</span>
<span class="line">            root   html;</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000</span>
<span class="line">        #</span>
<span class="line">        location ~ \\.php$ {</span>
<span class="line">            fastcgi_pass   127.0.0.1:9000;</span>
<span class="line">            fastcgi_index  index.php;</span>
<span class="line">            # fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;</span>
<span class="line">            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;</span>
<span class="line">            # fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;</span>
<span class="line">            include        fastcgi_params;</span>
<span class="line">        }</span>
<span class="line">        location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)$</span>
<span class="line">        {</span>
<span class="line">            expires      30d;</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        location ~ .*\\.(js|css)?$</span>
<span class="line">        {</span>
<span class="line">            expires      12h;</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        location ~ /\\.(?!well-known).* {</span>
<span class="line">            deny all;</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li><code>php.ini</code> 配置：cgi.fix_pathinfo=0 改为 cgi.fix_pathinfo=1。某些老旧的PHP框架需要如此设置。</li></ol><div class="language-ini line-numbers-mode" data-highlighter="prismjs" data-ext="ini"><pre><code class="language-ini"><span class="line"><span class="token comment">; 默认配置cgi.fix_pathinfo=1</span></span>
<span class="line"><span class="token comment">; 可能导致著名的PHP路径穿越漏洞，推荐设置为0。</span></span>
<span class="line"><span class="token comment">; 某些旧的PHP框架依赖PATH_INFO来解析路由：</span></span>
<span class="line"><span class="token comment">; http://example.com/index.php/controller/method</span></span>
<span class="line"><span class="token key attr-name">cgi.fix_pathinfo</span><span class="token punctuation">=</span><span class="token value attr-value">0</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><blockquote><p>vscode开发php https://blog.csdn.net/qq_43000219/article/details/122758971 用 VScode 怎么运行 php 代码？ https://www.zhihu.com/question/572439528/answer/3123247807 php-openssl下载 https://blog.csdn.net/weixin_31290291/article/details/115510973 解决NGINX PHP ＂No input file specified＂http://blog.chinaunix.net/uid-20622737-id-3464343.html nginx for Windows https://nginx.org/en/docs/windows.html</p></blockquote>`,38)])])}const d=s(l,[["render",p]]),o=JSON.parse('{"path":"/php/vscode-php.html","title":"使用vscode配置PHP开发环境","lang":"zh-CN","frontmatter":{"lang":"zh-CN","title":"使用vscode配置PHP开发环境","description":"本文详细记录了Windows系统下使用VSCode搭建PHP开发环境的完整流程。内容包括PHP下载与环境变量配置、VSCode必备插件（Intelephense、Debug、Server）安装、Xdebug调试环境搭建，以及配合Nginx解决“No input file specified”等常见错误的实战配置。"},"git":{"updatedTime":1774075678000,"contributors":[{"name":"Hankin","username":"Hankin","email":"554553400@qq.com","commits":3,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"39e4776200947e61514fa013aa4a194ddeba1b69","time":1774075678000,"email":"554553400@qq.com","author":"Hankin","message":"ADD vLLM"},{"hash":"01651c618ff6d60b7e89ebd5e280911d152a7e11","time":1774062353000,"email":"554553400@qq.com","author":"Hankin","message":"UPDATE vscode-php IDE"},{"hash":"9645ce5b7c63f3b4fe1eb4c8cbc5de24b8936fc9","time":1773994162000,"email":"554553400@qq.com","author":"Hankin","message":"ADD PHP"}]},"filePathRelative":"php/vscode-php.md"}');export{d as comp,o as data};
