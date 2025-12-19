## gcc简介

GCC（英文全拼：GNU Compiler Collection），原名为 GNU C语言编译器，是 GNU 工具链的主要组成部分，是一套以 GPL 和 LGPL 许可证发布的程序语言编译器自由软件，由 Richard Stallman 于 1985 年开始开发。

它原本只能处理 C 语言，但如今不仅可以编译 C、C++ 和 Objective-C，还可以通过不同的前端模块支持各种语言，包括 Java、Fortran、Ada、Pascal、Go 和 D 语言等。

如果是 `C++` 代码，只需改用 `g++` 编译器即可，使用方法一致。


## 命令规则

GCC 的 `命令选项是无序的`。 但是，带参数的命令选项，必须成对放一起。如 `-o hello.o`

如以下3个命令是等价的:

```bash
gcc HelloWorld.c -c -o hello.o
gcc -c -o hello.o HelloWorld.c
gcc -c HelloWorld.c -o hello.o
```


## 阶段编译

GCC 编译源码为可执行文件，可分为四个阶段：

1. 预处理（Pre-Processing）：生成 `.i` 文件，参数 `-E`
2. 编译（Compiling）：生成 `.s` 文件，参数 `-S`
3. 汇编（Assembling）：生成 `.o` 文件，参数 `-c`
4. 链接（Linking）：生成可执行文件。如 `.exe` 文件


GCC 命令默认将源代码的四个编译阶段一气呵成，直接转为可执行二进制代码，且不保留每个阶段产生的中间文件。

如果源程代码仅有一个文件则完全没问题，而实际上为了实现模块化，源码一般被拆分为多个文件，所以实际上每个文件都不是一个完整的程序，无法被单独编译成可执行文件。

所以通常做法是将每个源代码文件汇编成 `.o` 文件（即仅执行三个编译阶段到`汇编阶段`），最后将这些 `.o` 文件 `链接` 成一个完整的可执行文件（例如 .exe 文件）

| 文件后缀 | 描述   |
| ----- | --------- |
| .c    | C语言的源代码文件 |
| .C/.cc/.cxx/.cpp  | C++源文件    |
| .h | C/C++ 头文件 |
| .i/.ii | C/C++ 预处理文件。包括将头文件加入，将宏展开等操作 |
| .s/.S | 汇编语言源文件|
| .o/.obj | 目标文件|
| .a/.lib | 静态链接库|
| .so/.dll | 动态链接库|


命令示例：

```bash
# 只执行预处理，输出 hello.i 源文件
gcc -E hello.c -o hello.i

# 只执行预处理和编译，输出 hello.s 汇编文件
gcc -S hello.c

# 只执行预处理、编译和汇编，输出 hello.o 目标文件
gcc -c hello.c

# 编译 hello.c，默认输出 a.out 或 a.exe
gcc hello.c

# 编译 hello.c 并指定输出文件为 hello
gcc hello.c -o hello

# 由 hello.i 预处理文件生成 hello.s 汇编文件
gcc -S hello.i -o hello.s

# 由 hello.i 或 hello.s 生成目标文件 hello.o
gcc -c hello.i -o hello.o
gcc -c hello.s -o hello.o

# 由 hello.o 目标文件链接成可执行文件 hello
gcc hello.o -o hello
```


## 链接

汇编程序生成的目标文件并不能立即就被执行。例如，某个源文件中的函数可能引用了另一个源文件中定义的某个符号（如变量或者函数调用等）；在程序中可能调用了某个库文件中的函数。

链接程序的主要工作就是将有关的目标文件彼此相连接，也即将在一个文件中引用的符号同该符号在另外一个文件中的定义连接起来，使得所有的这些目标文件成为一个能够被操作系统装入执行的统一整体，也就是可执行程序。

链接处理可分为两种：

- 静态链接：开发过程中需要 `.lib` 静态文件，运行过程不需要。自完备。可执行文件大。
- 动态链接：可执行文件小，软件耦合度小，运行时动态加载 `.dll` 动态链接文件。缺少动态文件，会报错。

用到的工具为 `ld` 或 `collect2`。

链接常用的 gcc 参数:

- `-LDIRECTORY`: 指定额外的函数库搜索路径 DIRECTORY
- `-L [dir]`: 编译的时候，指定库的搜索路径，告诉编译器在 dir 目录中查找库文件，例如指定搜索我们自定义库。
- `-l[library name]`: 指定编译时候使用的库，例如指定数学库 gcc hello.c -lm。

`-l` 参数紧接着就是库名。就拿数学库来说，他的库名是 `m`，他的库文件名是 `libm.so`。

不同操作系统的 `静态库` 和 `动态库` 文件后缀：
| 操作系统 | 链接库类型   | 文件后缀 | 
| ----- | --------- | -----  |
| Windows | 静态库 | `.lib` |
| Linux | 静态库 | `.a` (Archive) |
| MacOS | 静态库 | `.a` (Archive) |
| Windows | 动态库 | `.dll` (Dynamic Link Library) |
| Linux | 动态库 | `.so` (Shared Object) |
| MacOS | 动态库 | `.so` 或 `.dylib`|


### 静态链接库

静态库是 `.obj` 文件的一个集合，通常静态库以 `.a` 为后缀，名字格式一般为libxxx.a。静态库由程序 `ar` 生成。

生成步骤:

1. 生成目标文件: 使用 `gcc -c` 命令
2. 归档：使用 `ar` 命令

创建一个 `foo.c` 文件:

```c
#include <stdio.h>
 ​
 void foo(void)
 {
     printf("Here is a static library\n");
 }
```

创建 `hello.c` 文件，调用 `foo` 函数

```c
#include <stdio.h>
 ​
 void foo(void);
 ​
 int main(void)
 {
     printf("Hello, GetIoT\n");
     foo();
     return 0;
 }
```

静态链接库的制作和使用:

```bash
# 生成 foo.o 目标文件
gcc -c foo.c

# 从 *.o 目标文件（可以是多个）生成 libfoo.a 静态库
ar -rcs libfoo.a foo.o

# 使用静态库
gcc hello.c -static libfoo.a -o hello

# 也可以使用 -L 指定库的搜索路径，并使用 -l 指定库名
gcc hello.c -static -L. -lfoo -o hello
``` 

`ar` 归档(archive)命令:
- 参数 `r` ：在库中插入模块（替换）。当插入的模块名已经在库中存在，则替换同名的模块。如果若干模块中有一个模块在库中不存在，ar 显示一个错误消息，并不替换其他同名模块。默认的情况下，新的成员增加在库的结尾处，可以使用其他任选项来改变增加的位置。
- 参数 `c` ：创建一个库。不管库是否存在，都将创建。
- 参数 `s` ：创建目标文件索引，这在创建较大的库时能加快时间


### 动态链接库（共享库）

修改 foo.c 文件，内容如下：

```c
#include <stdio.h>
 ​
 void foo(void)
 {
     printf("Here is a shared library\n");
 }
```

制作动态链接库(共享库)。 使用 `-fPIC` 选项生成位置无关的代码

```bash
# 方法一：从C源文件直接生成动态链接库文件。
gcc foo.c -shared -fPIC -o libfoo.so

# 方法二：先从C源文件生成 .o 目标文件，再打包成链接库文件
gcc foo.c -fPIC -c -o foo.o
gcc -shared *.o -o libfoo.so
```

hello.c 代码无需修改:

```c
#include <stdio.h>
 ​
 void foo(void);
 ​
 int main(void)
 {
     printf("Hello, GetIoT\n");
     foo();
     return 0;
 }
```

编译 hello.c 并链接共享库 libfoo.so

```bash
gcc hello.c libfoo.so -o hello

# 也可以使用 -L 和 -l 选项指定库的路径和名称
gcc hello.c -L. -lfoo -o hello
```

编译成功后，直接运行可执行文件，会提示找不到 `libfoo.so` 动态链接库。
可以通过命令 `ldd` 来查看一下可执行文件的链接情况

```bash
$ ldd hello
         linux-vdso.so.1 (0x00007fff5276d000)
         libfoo.so => not found
         libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007fcc90fa7000)
         /lib64/ld-linux-x86-64.so.2 (0x00007fcc911bd000)
```

运行时使用动态链接库：

1. 设置 `LD_LIBRARY_PATH` 环境变量：`export LD_LIBRARY_PATH=$(pwd)`
2. 使用 `rpath` 将共享库位置嵌入到程序: ``` gcc hello.c -L. -lfoo -Wl,-rpath=`pwd` -o hello ```
3. 将共享库添加到系统路径: `cp libfoo.so /usr/lib/`

如果 hello 程序仍然运行失败，请尝试执行 `ldconfig` 命令更新共享库的缓存列表。

`rpath` 即 run path，是种可以将共享库位置嵌入程序中的方法，从而不用依赖于默认位置和环境变量。链接时使用 `-Wl,-rpath=/path/to/yours` 选项，`-Wl` 会发送以逗号分隔的选项到链接器，注意逗号分隔符后面没有空格。
这种方式要求共享库必须有一个固定的安装路径，欠缺灵活性


## 命令选项

GCC 的命令和选项多而复杂，所以不建议去逐个的记忆这些命令。

命令选项区分大小写，分为 `带参数` 和 `不带参数` 两种，带参数选项需要跟随参数，例如 `-o` 选项。

注意有些选项的参数要与选项贴合，例如 `-O3`，`-lm`。

命令和选项虽多但是大致分为六大类：

1. 高频使用选项
2. 警告信息控制选项
3. 优化
4. 输出文件
5. 预处理
6. 其他编译选项。


### 常用选项

- `-o output_filename`：指定输出文件的名字。默认 output_filename 是 `a.out` 或 `a.exe`。
- `-E`：仅作预处理，输出预处理后的 `.i` 文件。
- `-S`：编译到汇编语言，输出 `.s` 汇编语言文件。
- `-c`: 执行汇编阶段，生成 `.o` 二进制目标(object)文件
- `-static`：静态链接库。
- `-shared`：动态链接库。
- `-l[library name]`：指定编译时候使用的库，例如指定数学库 `gcc hello.c -lm`
- `-IDIRECTORY`: 指定额外的头文件搜索路径 DIRECTORY
- `-LDIRECTORY`: 指定额外的函数库搜索路径 DIRECTORY
- `-I [dir]`: 表示将 dir 目录添加到头文件搜索路径中，这样就可以直接使用 #include<header.h> 的形式进行包含。
- `-I-[dir]`: 表示将指定的目录从头文件搜索路径中移除，移除后将不在该路径搜索头文件。
- `-idirafter [dir]`: 在指定的头文件搜索路径里面查找失败，则到这里指定的目录中查找。
- `-L [dir]`: 制定编译的时候，指定库的搜索路径，告诉编译器在 dir 目录中查找库文件，例如指定搜索我们自定义库。
- `-std=standard`：指定 C 或 C++ 语言的标准，如 `-std=c99` 或 `-std=c++11`
- `-g`：产生带调试信息的可执行文件。GNU 调试器可使用。
- `-v`：查看编译详细过程
- `--version`：显示 GCC 详细版本信息。

```bash
gcc -E hello.c // 查看预处理结果，比如头文件是哪个
gcc -E -dM hello.c > 1.txt // 把所有的宏展开，存在 1.txt 里
gcc -Wp,-MD,abc.dep -c -o hello.o hello.c // 生成依赖文件 abc.dep，后面 Makefile 会用
echo 'main(){}'| gcc -E -v - // 它会列出头文件目录、库目录(LIBRARY_PATH)
```


### 优化控制选项

- `-O0`: 不进行优化处理。
- `-O`：优化编译后的代码。同 `-O1`
- `-O2`：比 `-O` 更严格的优化等级。

----------

> GCC命令与参数详解 https://blog.csdn.net/jf_52001760/article/details/131225005

> gcc命令详解 https://zhuanlan.zhihu.com/p/642631747

> 静态链接库、动态链接库和动态加载库 https://www.cnblogs.com/nufangrensheng/p/3578784.html
