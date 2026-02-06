import{_ as n,c as e,e as a,o as i}from"./app-C_8_iCo-.js";const l={};function c(p,s){return i(),e("div",null,[...s[0]||(s[0]=[a(`<h2 id="vim配置文件" tabindex="-1"><a class="header-anchor" href="#vim配置文件"><span>vim配置文件</span></a></h2><ol><li>全局设置 <code>/etc/vimrc</code> or <code>/etc/vim/vimrc</code></li><li>个性化设置 <code>~/.vimrc</code></li></ol><h2 id="vim设置语法" tabindex="-1"><a class="header-anchor" href="#vim设置语法"><span>vim设置语法</span></a></h2><ol><li><p>基本使用: 配置文件，一行一条<code>set指令</code>。例: <code>set mouse-=a</code>, <code>set backspace=2</code></p></li><li><p>可使用 <code>if endif</code> 语句. 必须使用换行和缩进.否则报错。</p></li></ol><p>错误: <s>if has(&#39;mouse&#39;) set mouse-=a endif</s> 正确:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">if has(&#39;mouse&#39;)</span>
<span class="line">  set mouse-=a</span>
<span class="line">endif</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常用指令" tabindex="-1"><a class="header-anchor" href="#常用指令"><span>常用指令</span></a></h2><ul><li><code>set nu</code> 显示行号</li><li><code>set nonu</code> 不显示行号</li><li><code>set mouse-=a</code> 解决编辑模式下，鼠标右键不可用，导致无法粘贴的问题</li><li><code>set encoding=utf-8</code> 设置编码为utf-8,解决中文字符乱码问题</li></ul><h2 id="vim设置范例" tabindex="-1"><a class="header-anchor" href="#vim设置范例"><span>vim设置范例</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"></span>
<span class="line"><span class="token string">&quot; 解决鼠标右键不能使用问题</span>
<span class="line">if has(&#39;mouse&#39;)</span>
<span class="line">  set mouse-=a</span>
<span class="line">endif</span>
<span class="line"></span>
<span class="line">&quot;</span> 解决插入模式下delete/backspce键失效问题</span>
<span class="line"><span class="token builtin class-name">set</span> <span class="token assign-left variable">backspace</span><span class="token operator">=</span><span class="token number">2</span></span>
<span class="line"></span>
<span class="line"><span class="token string">&quot; 解决方向键无法使用的问题. 可能会导致退出vim后，编辑的文本内容仍保留在屏幕</span>
<span class="line">&quot;</span> <span class="token builtin class-name">set</span> <span class="token assign-left variable">term</span><span class="token operator">=</span>builtin_ansi</span>
<span class="line"><span class="token string">&quot; 也可以 echo &quot;</span><span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">TERM</span></span><span class="token operator">=</span>xterm<span class="token string">&quot; &gt;&gt; ~/.bashrc </span>
<span class="line">set term=xterm</span>
<span class="line"></span>
<span class="line">&quot;</span> 设置编码为utf-8,解决中文字符乱码问题</span>
<span class="line"><span class="token builtin class-name">set</span> <span class="token assign-left variable">encoding</span><span class="token operator">=</span>utf-8</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="语法上色" tabindex="-1"><a class="header-anchor" href="#语法上色"><span>语法上色</span></a></h2><ul><li><code>syntax on</code> 语法高亮</li></ul><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">&quot;语法高亮</span>
<span class="line">syntax on</span>
<span class="line">&quot;显示行号</span>
<span class="line">set nu</span>
<span class="line"></span>
<span class="line">&quot;修改默认注释颜色</span>
<span class="line">hi Comment ctermfg=DarkCyan</span>
<span class="line"></span>
<span class="line">&quot;允许退格键删除</span>
<span class="line">set backspace=2</span>
<span class="line">&quot;启用鼠标</span>
<span class="line">set mouse=a</span>
<span class="line">set selection=exclusive</span>
<span class="line">set selectmode=mouse,key</span>
<span class="line"></span>
<span class="line">&quot;侦测文件类型</span>
<span class="line">filetype on</span>
<span class="line">&quot;载入文件类型插件</span>
<span class="line">filetype plugin on</span>
<span class="line">&quot;为特定文件类型载入相关缩进文件</span>
<span class="line">filetype indent on</span>
<span class="line"></span>
<span class="line">&quot;设置编码自动识别, 中文引号显示</span>
<span class="line">set fileencodings=utf-8,gbk</span>
<span class="line">set encoding=euc-cn</span>
<span class="line">set ambiwidth=double</span>
<span class="line"></span>
<span class="line">&quot;设置高亮搜索</span>
<span class="line">set hlsearch</span>
<span class="line">&quot;在搜索时，输入的词句的逐字符高亮</span>
<span class="line">set incsearch</span>
<span class="line"></span>
<span class="line">&quot;按C语言格式缩进</span>
<span class="line">set cindent</span>
<span class="line">&quot;设置Tab长度为4格</span>
<span class="line">set tabstop=4</span>
<span class="line">&quot;设置自动缩进长度为4格</span>
<span class="line">set shiftwidth=4</span>
<span class="line">&quot;继承前一行的缩进方式，特别适用于多行注释</span>
<span class="line">set autoindent</span>
<span class="line">&quot;显示括号匹配</span>
<span class="line">set showmatch</span>
<span class="line">&quot;括号匹配显示时间为1(单位是十分之一秒)</span>
<span class="line">set matchtime=1</span>
<span class="line"></span>
<span class="line">&quot;增强模式中的命令行自动完成操作</span>
<span class="line">set wildmenu</span>
<span class="line">&quot;不要生成swap文件，当buffer被丢弃的时候隐藏它</span>
<span class="line">setlocal noswapfile</span>
<span class="line">set bufhidden=hide</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先打开vim，输入命令 scriptnames 看看vim加载了哪些脚本。</p><p><code>:scriptnames</code></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">  1: /home/users/xxx/.vimrc</span>
<span class="line">  2: /home/users/xxx/tools/share/vim/vim73/colors/darkblue.vim</span>
<span class="line">  3: /home/users/xxx/tools/share/vim/vim73/syntax/syntax.vim</span>
<span class="line">  4: /home/users/xxx/tools/share/vim/vim73/syntax/synload.vim</span>
<span class="line">  5: /home/users/xxx/tools/share/vim/vim73/syntax/syncolor.vim</span>
<span class="line">  6: /home/users/xxx/tools/share/vim/vim73/filetype.vim</span>
<span class="line">  7: /home/users/xxx/tools/share/vim/vim73/plugin/getscriptPlugin.vim</span>
<span class="line">  8: /home/users/xxx/tools/share/vim/vim73/plugin/gzip.vim</span>
<span class="line">  9: /home/users/xxx/tools/share/vim/vim73/plugin/matchparen.vim</span>
<span class="line"> 10: /home/users/xxx/tools/share/vim/vim73/plugin/netrwPlugin.vim</span>
<span class="line"> 11: /home/users/xxx/tools/share/vim/vim73/plugin/rrhelper.vim</span>
<span class="line"> 12: /home/users/xxx/tools/share/vim/vim73/plugin/spellfile.vim</span>
<span class="line"> 13: /home/users/xxx/tools/share/vim/vim73/plugin/tarPlugin.vim</span>
<span class="line"> 14: /home/users/xxx/tools/share/vim/vim73/plugin/tohtml.vim</span>
<span class="line"> 15: /home/users/xxx/tools/share/vim/vim73/plugin/vimballPlugin.vim</span>
<span class="line"> 16: /home/users/xxx/tools/share/vim/vim73/plugin/zipPlugin.vim</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可见所有和语法及颜色相关的脚本都已经加载了，应该不是它们的问题。</p><p>再看 <code>.vimrc</code> 配置文件</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code class="language-conf"><span class="line">  1 set nocompatible        &quot; Vim settings, not Vi settings.  must be first</span>
<span class="line">  2 set autoindent          &quot; Auto align when insert new line, for instance, when using o or O to insert new line.</span>
<span class="line">  3 set ruler               &quot; Show ruler at the bottom-right of vim window</span>
<span class="line">  4 set showcmd</span>
<span class="line">  5 set backspace=indent,eol,start          &quot; Enable delete for backspace under insert mode&quot;</span>
<span class="line">  6 colorscheme darkblue</span>
<span class="line">  7 set number              &quot; Show line number</span>
<span class="line">  8 syntax on</span>
<span class="line">  9 if &amp;term =~ &quot;xterm&quot;</span>
<span class="line"> 10   if has(&quot;terminfo&quot;)</span>
<span class="line"> 11     set t_Co=8</span>
<span class="line"> 12     set t_Sf=^[[3%p1%dm</span>
<span class="line"> 13     set t_Sb=^[[4%p1%dm</span>
<span class="line"> 14   else</span>
<span class="line"> 15     set t_Co=8</span>
<span class="line"> 16     set t_Sf=^[[3%dm</span>
<span class="line"> 17     set t_Sb=^[[4%dm</span>
<span class="line"> 18   endif</span>
<span class="line"> 19 endif</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从第9行开始，如果用的是xterm，那就就进行下面的颜色设置，那么如果系统用的不是xterm呢？于是赶紧查看，在shell终端输入如下命令</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">echo</span> <span class="token environment constant">$TERM</span></span>
<span class="line">vt100+</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>果然不是xterm，怪不得没有颜色。</p><p>解决办法：打开shell配置文件，.bash_profile或.bashrc加入下面一行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token assign-left variable"><span class="token environment constant">TERM</span></span><span class="token operator">=</span>xterm</span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token environment constant">TERM</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>然后手动执行 <code>source .bashrc</code> 使生效</p><hr><blockquote><p>解决vim没有颜色的办法 https://www.cnblogs.com/softwaretesting/archive/2012/01/10/2317820.html http://www.360doc.com/content/14/0109/14/9462341_343858750.shtml vim配置文件，解决没有颜色问题 https://www.cnblogs.com/pswzone/archive/2013/05/26/3099662.html vim教程 https://www.w3cschool.cn/vim/47zk1ht5.html Centos7下安装vim8和python3 https://blog.csdn.net/HaloTrriger/article/details/105679354 vim方向键无效的解决方案 https://blog.csdn.net/Mr_OOO/article/details/103793026</p></blockquote>`,27)])])}const t=n(l,[["render",c]]),r=JSON.parse('{"path":"/linux/vimconf.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1770369857000,"contributors":[{"name":"Hankin","username":"Hankin","email":"554553400@qq.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"fbad74e693d831e8161f92f36ebd287ea0c22aa8","time":1770369857000,"email":"554553400@qq.com","author":"Hankin","message":"ADD vimconf"}]},"filePathRelative":"linux/vimconf.md"}');export{t as comp,r as data};
