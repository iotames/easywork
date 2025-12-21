import{_ as s,c as a,e as n,o as i}from"./app-BoLZbGHZ.js";const l={};function d(c,e){return i(),a("div",null,[...e[0]||(e[0]=[n(`<h2 id="查看设备标识" tabindex="-1"><a class="header-anchor" href="#查看设备标识"><span>查看设备标识</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 查看已挂载的磁盘和分区</span>
<span class="line">df -h</span>
<span class="line"></span>
<span class="line"># 查看包含未载的磁盘在内的所有磁盘</span>
<span class="line">fdisk -l</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>fdisk -l</code> 显示的未挂载的设备标识可能为： <code>/dev/sda</code>, <code>dev/sdb</code>, <code>/dev/vdb</code></p><p>假设未挂载的设备为：<code>/dev/vdb</code></p><h2 id="创建新分区" tabindex="-1"><a class="header-anchor" href="#创建新分区"><span>创建新分区</span></a></h2><h3 id="方式一-fdisk" tabindex="-1"><a class="header-anchor" href="#方式一-fdisk"><span>方式一（fdisk）：</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 依次输入： n回车 p回车 1回车 回车 wq回车</span>
<span class="line"># 假设该设备分区后，分区名为/dev/vdb1</span>
<span class="line">fdisk /dev/sdb</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方式二-parted" tabindex="-1"><a class="header-anchor" href="#方式二-parted"><span>方式二（parted）：</span></a></h3><ul><li><code>-s</code>： --script不提示用户，非交互模式</li><li><code>mklabel</code>： 创建新的label-type类型的空磁盘分区表msdos或gpt</li></ul><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 设置分区格式为GPT</span>
<span class="line">parted -s /dev/vdb mklabel gpt</span>
<span class="line"></span>
<span class="line"># 创建新分区</span>
<span class="line">parted -s /dev/vdb c mkpart primary 0% 100%</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="格式化新分区" tabindex="-1"><a class="header-anchor" href="#格式化新分区"><span>格式化新分区</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 格式化新分区为ext4</span>
<span class="line">mkfs.ext4 /dev/vdb1</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="挂载新分区" tabindex="-1"><a class="header-anchor" href="#挂载新分区"><span>挂载新分区</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 创建新目录</span>
<span class="line">mkdir /mnt/mount1</span>
<span class="line"></span>
<span class="line"># 手动挂载到新目录</span>
<span class="line"># mount /dev/vdb1 /mnt/mount1</span>
<span class="line"></span>
<span class="line"># 写入开机自动挂载</span>
<span class="line">echo &quot;/dev/vdb1  /mnt/mount1  ext4  defaults,noatime  0  0&quot; &gt;&gt; /etc/fstab</span>
<span class="line"># 使开机自动挂载的修改立即生效</span>
<span class="line">mount -a</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="其他" tabindex="-1"><a class="header-anchor" href="#其他"><span>其他</span></a></h2><ul><li>查看磁盘分区的 <code>UUID</code>: 即 <code>/etc/fstab</code> 里面那个 <code>UUID</code>，不小心误删fstab文件可以此恢复。</li></ul><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line"># 下面两个命令都可以查看</span>
<span class="line">ls -l /dev/disk/by-uuid/</span>
<span class="line">blkid /dev/vdb1</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17)])])}const r=s(l,[["render",d]]),p=JSON.parse('{"path":"/linux/disk.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1752418311000,"contributors":[{"name":"Hankin","username":"Hankin","email":"hankin@catmes.com","commits":2,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"e8519aa41da5fe2f3877981a6c3e47115b07b22c","time":1752418311000,"email":"hankin@catmes.com","author":"Hankin","message":"ADD linux/systemd.md. UPDATE promtail"},{"hash":"44691c4194245510361e1c3a94aec06d8a39f492","time":1748443504000,"email":"hankin@catmes.com","author":"Hankin","message":"ADD disk.md for devops"}]},"filePathRelative":"linux/disk.md"}');export{r as comp,p as data};
