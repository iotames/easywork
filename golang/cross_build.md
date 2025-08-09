## Go语言跨平台编译（交叉编译）

Go语言通过临时设置 `环境变量` 作为编译参数，进行跨平台编译。

- 在Windows系统上编译Linux系统的可执行文件：

```bat
set GOOS=linux
set CGO_ENABLED=0
go build -v -x -ldflags "-s -w" .
```

- 在Linux系统上编译Windows系统的可执行文件：

```bash
export GOOS=windows
export CGO_ENABLED=0
go build -v -x -ldflags "-s -w" .
```

## 环境变量编译参数

```shell
if [[ $CROSS_COMPILE = 1 ]]; then
	BUILD_PREFIX="CGO_ENABLED=1 \
CGO_CFLAGS=-I/usr/local/x86_64_gcc/x86_64-pc-linux-gnu/include \
CGO_LDFLAGS=-L/usr/local/x86_64_gcc/x86_64-pc-linux-gnu/lib \
GOOS=linux \
GOARCH=amd64 \
CC=x86_64-pc-linux-gnu-gcc \
CXX=x86_64-pc-linux-gnu-g++ \
AR=x86_64-pc-linux-gnu-ar "
fi
```

- CGO_ENABLED：`CGO_ENABLED=1` 表示开启Cgo支持，用于利用C/C++资源。
- CGO_CFLAGS: 设置头文件路径。`-I${SRCDIR}/include` 将XXX库对应头文件所在的目录加入头文件检索路径。用来给c编译器提供开关，比如指定头文件的位置等。
- CGO_LDFLAGS：这只链接库路径。`-L${SRCDIR}/lib` 将编译后XXX静态库所在目录加为链接库检索路径。用来指定链接选项，比如链接库的位置，以及使用哪些链接库。
- CC：指定gcc编译命令工具。例：x86_64-pc-linux-gnu-gcc
- GOOS：指定操作系统。例：linux, windows, darwin
- GOARCH：指定系统架构。例：amd64, arm

---------------------

> Go 静态编译机制: https://blog.csdn.net/qq_43580193/article/details/120305231
> CGO_ENABLED、GOOS、GOARCH、CC相关参数详解: https://blog.csdn.net/qq_36657175/article/details/124024503
> Go语言高级编程-编译和链接参数: https://hypc-pub.github.io/advanced-go-programming-book/ch2-cgo/ch2-10-link.html