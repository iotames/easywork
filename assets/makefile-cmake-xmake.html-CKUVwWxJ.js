import{_ as n,c as a,e,o as l}from"./app-Dpp9EncG.js";const p={};function i(t,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="makefile简介" tabindex="-1"><a class="header-anchor" href="#makefile简介"><span>Makefile简介</span></a></h2><p>为了简化多个源代码文件下，通过 <code>gcc</code> 工具编译复杂的C语言项目，出现了 <code>Makefile</code>。</p><p>只要把 <code>GCC</code> 的各种控制和编译选项编写到 <code>Makefile</code> 文件中，再使用 <code>make</code> 工具解析，然后调用 GCC 执行编译即可，实现编译（构建）自动化。</p><h2 id="makefile规则" tabindex="-1"><a class="header-anchor" href="#makefile规则"><span>Makefile规则</span></a></h2><p>整体规则:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">&lt;target&gt; : &lt;prerequisites&gt;</span>
<span class="line">[tab] &lt;commands&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>第一行冒号前面的部分叫做 “目标”（target），冒号后面的部分叫做 “前置条件”（prerequisites），第二行必须由一个 tab 键起始，后面跟着 “命令”（commands）。</p><p>“目标” 是必需的，不可省略。“前置条件” 和 “命令” 是可省略的，但是这两者至少需要存在一个（两者不能同时省略）。</p><p>示例：</p><ol><li>新建 <code>Makefile</code> 文件，注意第二行开始的空格，必须用 <code>TAB</code> 键。</li><li>新建 <code>temp.txt</code> 文件，内容随意</li><li>执行 <code>make hello.txt</code> 命令，创建 <code>hello.txt</code> 文件。</li></ol><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">hello.txt: temp.txt</span>
<span class="line">    cp temp.txt hello.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><code>Makefile</code> 规则文件：文件名为 <code>Makefile</code> 或 <code>makefile</code>， 不需要扩展名。</p><p>也可以使用 <code>-f</code> 指定 <code>Makefile</code> 文件名：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">make -f config.txt</span>
<span class="line">make --file=config.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="cmake介绍" tabindex="-1"><a class="header-anchor" href="#cmake介绍"><span>CMake介绍</span></a></h2><div class="language-mermaid line-numbers-mode" data-highlighter="prismjs" data-ext="mermaid"><pre><code class="language-mermaid"><span class="line"><span class="token keyword">graph</span> TD</span>
<span class="line">    CML<span class="token text string">[CMakeLists.txt]</span></span>
<span class="line">    READ<span class="token text string">[1. 读取文件]</span></span>
<span class="line">    GEN_CACHE<span class="token text string">[2. 生成临时文件]</span></span>
<span class="line">    CACHE<span class="token text string">[CMakeCache]</span></span>
<span class="line">    GEN_PROJ<span class="token text string">[3. 生成项目文件]</span></span>
<span class="line">    </span>
<span class="line">    MKFILE<span class="token text string">[Makefile]</span></span>
<span class="line">    XPROJ<span class="token text string">[MacOS项目.xcodeproj]</span></span>
<span class="line">    VSPROJ<span class="token text string">[VSProject.vcxproj]</span></span>
<span class="line">    NFILE<span class="token text string">[Build.ninja]</span></span>
<span class="line">    </span>
<span class="line">    MAKE<span class="token text string">[make]</span></span>
<span class="line">    NMAKE<span class="token text string">[nmake]</span></span>
<span class="line">    XCODE<span class="token text string">[xcode]</span></span>
<span class="line">    DEVENV<span class="token text string">[devenv]</span></span>
<span class="line">    NINJA<span class="token text string">[ninja]</span></span>
<span class="line">    </span>
<span class="line">    OUTPUT<span class="token text string">[可执行文件或库&lt;br/&gt;适用于 ARM、Linux、MacOS、Windows]</span></span>
<span class="line"></span>
<span class="line">    CML <span class="token arrow operator">--&gt;</span> READ</span>
<span class="line">    READ <span class="token arrow operator">--&gt;</span> GEN_CACHE</span>
<span class="line">    GEN_CACHE <span class="token arrow operator">--&gt;</span> CACHE</span>
<span class="line">    CACHE <span class="token arrow operator">--&gt;</span> GEN_PROJ</span>
<span class="line">    </span>
<span class="line">    GEN_PROJ <span class="token arrow operator">--&gt;</span> MKFILE</span>
<span class="line">    GEN_PROJ <span class="token arrow operator">--&gt;</span> XPROJ</span>
<span class="line">    GEN_PROJ <span class="token arrow operator">--&gt;</span> VSPROJ</span>
<span class="line">    GEN_PROJ <span class="token arrow operator">--&gt;</span> NFILE</span>
<span class="line">    </span>
<span class="line">    MKFILE <span class="token arrow operator">--&gt;</span> MAKE</span>
<span class="line">    MKFILE <span class="token arrow operator">--&gt;</span> NMAKE</span>
<span class="line">    XPROJ <span class="token arrow operator">--&gt;</span> XCODE</span>
<span class="line">    VSPROJ <span class="token arrow operator">--&gt;</span> DEVENV</span>
<span class="line">    NFILE <span class="token arrow operator">--&gt;</span> NINJA</span>
<span class="line">    </span>
<span class="line">    MAKE <span class="token arrow operator">--&gt;</span> OUTPUT</span>
<span class="line">    NMAKE <span class="token arrow operator">--&gt;</span> OUTPUT</span>
<span class="line">    XCODE <span class="token arrow operator">--&gt;</span> OUTPUT</span>
<span class="line">    DEVENV <span class="token arrow operator">--&gt;</span> OUTPUT</span>
<span class="line">    NINJA <span class="token arrow operator">--&gt;</span> OUTPUT</span>
<span class="line"></span>
<span class="line">    <span class="token keyword">style</span> CML <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#blue<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> CACHE <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#blue<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> MKFILE <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#blue<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> XPROJ <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#blue<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> VSPROJ <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#blue<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> NFILE <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#blue<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">style</span> READ <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#yellow<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> GEN_CACHE <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#yellow<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> GEN_PROJ <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#yellow<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> MAKE <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#yellow<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> NMAKE <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#yellow<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> XCODE <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#yellow<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> DEVENV <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#yellow<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> NINJA <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#yellow<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line">    <span class="token keyword">style</span> OUTPUT <span class="token style"><span class="token property">fill</span><span class="token operator">:</span>#yellow<span class="token punctuation">,</span><span class="token property">color</span><span class="token operator">:</span>#000</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol><li>创建 <code>CMakeLists.txt</code> 文件</li><li>生成 <code>MakeFile</code> 文件</li></ol><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">#要求最低的cmake版本号</span>
<span class="line">cmake_minimum_required (VERSION 3.5)</span>
<span class="line"></span>
<span class="line">#项目信息</span>
<span class="line">project (Hello)</span>
<span class="line"></span>
<span class="line">#递归查找src目录下所有的后缀为c的文件，并保存在SRCS变量中</span>
<span class="line">file(GLOB_RECURSE SRCS &quot;./src/*.c&quot;)</span>
<span class="line"></span>
<span class="line">#递归查找src目录下所有的后缀为h的文件，并保存在SRCS_H变量中(这是一种很不规范的写法，但是我这里为了省时，正常应该是使用设置头文件libraries的函数)</span>
<span class="line">file(GLOB_RECURSE SRCS_H &quot;./src/*.h&quot;) </span>
<span class="line"></span>
<span class="line">#设置输出路径为build路径</span>
<span class="line">set(CMAKE_RUNTIME_OUTPUT_DIRECTORY &quot;./build&quot;)</span>
<span class="line"></span>
<span class="line">#用src下的源文件生成一个叫Hello的可执行文件</span>
<span class="line">add_executable(Hello \${SRCS} \${SRC_H})</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># Windows下生成MinGW的MakeFile</span>
<span class="line">cmake CMakeLists.txt -G &quot;MinGW Makefiles&quot;</span>
<span class="line"></span>
<span class="line"># Linux下生成Gnu的MakeFile</span>
<span class="line">cmake CMakeLists.txt -G &quot;Unix Makefiles&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="xmake介绍" tabindex="-1"><a class="header-anchor" href="#xmake介绍"><span>xmake介绍</span></a></h2><p><a href="https://github.com/xmake-io/xmake" target="_blank" rel="noopener noreferrer">xmake</a>: 一个基于Lua的轻量级跨平台自动构建工具，现代化的 C/C++ 构建工具，强大的依赖包管理和集成</p><ul><li>官方文档：https://xmake.io/</li><li>项目地址：https://github.com/xmake-io/xmake</li></ul><h2 id="xmake与cmake的区别" tabindex="-1"><a class="header-anchor" href="#xmake与cmake的区别"><span>xmake与cmake的区别</span></a></h2><p>其实，两者并不是同一个层面的工具。 cmake的定位是跨平台胶水，xmake的定位是跨平台构建。 例如 vscode 跟 qtcreator ，还有 clion, kdeveloper 等等，非常多的 C++ IDE 都可以直接拿 <code>CMakeLists.txt</code> 作为 <code>项目文件</code>（project file）。它的重点并不在于构建，而在于「跨平台跨IDE的 <code>project file</code>」。</p><p>它作为跨平台，跨 IDE 的项目文件，实际上起到的是胶水作用：在不同平台调用属于不同平台的原生构建工具，在不同 IDE 中调用不同编译器，所以非常显见的，cmake在不同平台会有不同的行为，你跨平台的情况下，需要针对不同平台都调试过才好用。</p><p>cmake 的这个特性，使得各平台各IDE都愿意原生内置 cmake 支持。因为 cmake 只是个胶水，它同时依然允许了平台自身的包管理系统的存在，也允许了平台自身的编译系统存在（比如make, ninja，msvc 等等）。</p><p>而 xmake 则是「某个构建系统」。从构建系统的角度，xmake 无疑是比 cmake 更强大更好用的系统。但是，xmake 取代了构建系统本身，而并非像 cmake 这般仅作为跨平台胶水而存在。取代构建系统意味着 xmake 会具备更完善的功能以及更稳定一致的表现。所以它有很大概率是更好用的。</p><p>但这同时也决定了它可能会更少的被其它商业平台或者IDE内置支持，也很难获得 cmake 这般「C++构建系统事实标准」的地位。因为拥抱 xmake 意味着放弃自有构建系统，而引入 cmake 不会影响自有体系的存在。</p><hr><blockquote><p>Makefile规则详解 https://blog.csdn.net/jf_52001760/article/details/131277015 项目构建工具：CMake的核心用法 https://zhuanlan.zhihu.com/p/649439286 CMake教程 https://blog.csdn.net/weixin_43669941/article/details/112913301 cmake是什么，为什么现在都用cmake,cmake编译原理和跨平台示例 https://blog.csdn.net/jiedichina/article/details/126675963 关于C语言的分离式编译构建工具以及用VSCode写C的一些问题 https://blog.csdn.net/m0_74075298/article/details/134617955 xmake与cmake，哪个更好用 https://www.zhihu.com/question/57373378/answer/3287150393</p></blockquote>`,30)])])}const o=n(p,[["render",i]]),r=JSON.parse('{"path":"/clang/makefile-cmake-xmake.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1763191629000,"contributors":[{"name":"Hankin","username":"Hankin","email":"554553400@qq.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"1969c987a034eb21e134008386b513577dceb895","time":1763191629000,"email":"554553400@qq.com","author":"Hankin","message":"ADD vuepress/plugin-markdown-chart"}]},"filePathRelative":"clang/makefile-cmake-xmake.md"}');export{o as comp,r as data};
