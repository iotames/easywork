## vim配置文件

1. 全局设置 `/etc/vimrc` or `/etc/vim/vimrc` 
2. 个性化设置 `~/.vimrc`

## vim设置语法

1. 基本使用: 配置文件，一行一条`set指令`。例: `set mouse-=a`, `set backspace=2` 

2. 可使用 `if endif` 语句. 必须使用换行和缩进.否则报错。

错误: ~~if has('mouse') set mouse-=a endif~~
正确:
```
if has('mouse')
  set mouse-=a
endif
```

## 常用指令

- `set nu` 显示行号
- `set nonu` 不显示行号
- `set mouse-=a` 解决编辑模式下，鼠标右键不可用，导致无法粘贴的问题
- `set encoding=utf-8` 设置编码为utf-8,解决中文字符乱码问题

## vim设置范例

```shell

" 解决鼠标右键不能使用问题
if has('mouse')
  set mouse-=a
endif

" 解决插入模式下delete/backspce键失效问题
set backspace=2

" 解决方向键无法使用的问题. 可能会导致退出vim后，编辑的文本内容仍保留在屏幕
" set term=builtin_ansi
" 也可以 echo "export TERM=xterm" >> ~/.bashrc 
set term=xterm

" 设置编码为utf-8,解决中文字符乱码问题
set encoding=utf-8

```


## 语法上色

- `syntax on` 语法高亮

```conf
"语法高亮
syntax on
"显示行号
set nu

"修改默认注释颜色
hi Comment ctermfg=DarkCyan

"允许退格键删除
set backspace=2
"启用鼠标
set mouse=a
set selection=exclusive
set selectmode=mouse,key

"侦测文件类型
filetype on
"载入文件类型插件
filetype plugin on
"为特定文件类型载入相关缩进文件
filetype indent on

"设置编码自动识别, 中文引号显示
set fileencodings=utf-8,gbk
set encoding=euc-cn
set ambiwidth=double

"设置高亮搜索
set hlsearch
"在搜索时，输入的词句的逐字符高亮
set incsearch

"按C语言格式缩进
set cindent
"设置Tab长度为4格
set tabstop=4
"设置自动缩进长度为4格
set shiftwidth=4
"继承前一行的缩进方式，特别适用于多行注释
set autoindent
"显示括号匹配
set showmatch
"括号匹配显示时间为1(单位是十分之一秒)
set matchtime=1

"增强模式中的命令行自动完成操作
set wildmenu
"不要生成swap文件，当buffer被丢弃的时候隐藏它
setlocal noswapfile
set bufhidden=hide
```

首先打开vim，输入命令 scriptnames 看看vim加载了哪些脚本。

`:scriptnames`

```
  1: /home/users/xxx/.vimrc
  2: /home/users/xxx/tools/share/vim/vim73/colors/darkblue.vim
  3: /home/users/xxx/tools/share/vim/vim73/syntax/syntax.vim
  4: /home/users/xxx/tools/share/vim/vim73/syntax/synload.vim
  5: /home/users/xxx/tools/share/vim/vim73/syntax/syncolor.vim
  6: /home/users/xxx/tools/share/vim/vim73/filetype.vim
  7: /home/users/xxx/tools/share/vim/vim73/plugin/getscriptPlugin.vim
  8: /home/users/xxx/tools/share/vim/vim73/plugin/gzip.vim
  9: /home/users/xxx/tools/share/vim/vim73/plugin/matchparen.vim
 10: /home/users/xxx/tools/share/vim/vim73/plugin/netrwPlugin.vim
 11: /home/users/xxx/tools/share/vim/vim73/plugin/rrhelper.vim
 12: /home/users/xxx/tools/share/vim/vim73/plugin/spellfile.vim
 13: /home/users/xxx/tools/share/vim/vim73/plugin/tarPlugin.vim
 14: /home/users/xxx/tools/share/vim/vim73/plugin/tohtml.vim
 15: /home/users/xxx/tools/share/vim/vim73/plugin/vimballPlugin.vim
 16: /home/users/xxx/tools/share/vim/vim73/plugin/zipPlugin.vim
```

可见所有和语法及颜色相关的脚本都已经加载了，应该不是它们的问题。

再看 `.vimrc` 配置文件

```conf
  1 set nocompatible        " Vim settings, not Vi settings.  must be first
  2 set autoindent          " Auto align when insert new line, for instance, when using o or O to insert new line.
  3 set ruler               " Show ruler at the bottom-right of vim window
  4 set showcmd
  5 set backspace=indent,eol,start          " Enable delete for backspace under insert mode"
  6 colorscheme darkblue
  7 set number              " Show line number
  8 syntax on
  9 if &term =~ "xterm"
 10   if has("terminfo")
 11     set t_Co=8
 12     set t_Sf=^[[3%p1%dm
 13     set t_Sb=^[[4%p1%dm
 14   else
 15     set t_Co=8
 16     set t_Sf=^[[3%dm
 17     set t_Sb=^[[4%dm
 18   endif
 19 endif
```

从第9行开始，如果用的是xterm，那就就进行下面的颜色设置，那么如果系统用的不是xterm呢？于是赶紧查看，在shell终端输入如下命令

```bash
echo $TERM
vt100+
```

果然不是xterm，怪不得没有颜色。

解决办法：打开shell配置文件，.bash_profile或.bashrc加入下面一行

```bash
TERM=xterm
export TERM
```
然后手动执行 `source .bashrc` 使生效


----------

> 解决vim没有颜色的办法 https://www.cnblogs.com/softwaretesting/archive/2012/01/10/2317820.html
> http://www.360doc.com/content/14/0109/14/9462341_343858750.shtml
> vim配置文件，解决没有颜色问题 https://www.cnblogs.com/pswzone/archive/2013/05/26/3099662.html
> vim教程 https://www.w3cschool.cn/vim/47zk1ht5.html
> Centos7下安装vim8和python3 https://blog.csdn.net/HaloTrriger/article/details/105679354
> vim方向键无效的解决方案 https://blog.csdn.net/Mr_OOO/article/details/103793026
