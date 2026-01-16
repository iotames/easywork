## Makefile规则

整体规则:

```makefile
<target> : <prerequisites>
[tab] <commands>
```

第一行冒号前面的部分叫做 `目标`（target），冒号后面的部分叫做 `前置条件`（prerequisites）。前置条件可以由一个或多个文件组成，多个文件之间由空格分隔。
第二行必须由一个 `tab` 键起始，后面跟着 `命令`（commands）。
“目标” 是必需的，不可省略。“前置条件” 和 “命令” 是可省略的，但是这两者至少需要存在一个（两者不能同时省略）。


示例：

1. 新建 `Makefile` 文件，注意第二行开始的空格，必须用 `TAB` 键。
2. 新建 `temp.txt` 文件，内容随意
3. 执行 `make hello.txt` 命令，创建 `hello.txt` 文件。

```makefile
hello.txt: temp.txt
    cp temp.txt hello.txt
```

`Makefile` 规则文件：文件名为 `Makefile` 或 `makefile`， 不需要扩展名。

```bash
make -f config.txt
# 也可以使用 `-f` 指定 `Makefile` 文件名：
make --file=config.txt
```

## 命令行赋值

```makefile
# Linux/macOS
BUILD_TIME:=$(shell date +%Y-%m-%d_%H_%M)

# Windows PowerShell
BUILD_TIME:=$(shell powershell -Command "Get-Date -Format 'yyyy-MM-dd_HH_mm'")

# Windows CMD
BUILD_TIME:=$(shell cmd /c "echo %date:~0,4%-%date:~5,2%-%date:~8,2%_%time:~0,2%_%time:~3,2%")
```

## `:=` 赋予当前位置值

```
VIR_A := A
VIR_B := $(VIR_A) B
VIR_A := AA
```

## `=` 赋予最后展开值

```
VIR_A = A
VIR_B = $(VIR_A) B
VIR_A = AA
```

最后 `VIR_B` 的值是 `AA B`，而不是A B.

变量 `VIR_B` 的值是 `A B`


## `?=` 如果没有，则赋值

`?=`: 如果该变量没有被赋值，则赋予 `?=` 后的值。否则就依原有值，不改变。例：

```
VIR ?= new_value
# VIR == new_value
VIR := old_value
VIR ?= new_value
# VIR == old_value
```

## `+=` 累加

`+=` 和常用理解一样，表示将等号后面的值，添加到前面的变量上

----------

> Makefile中:=, =, ?=和+=的含义 https://blog.csdn.net/b876144622/article/details/80372161