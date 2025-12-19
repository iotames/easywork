## `=` 赋予最后展开值

```
VIR_A = A
VIR_B = $(VIR_A) B
VIR_A = AA
```

最后 `VIR_B` 的值是 `AA B`，而不是A B.


## `:=` 赋予当前位置值

```
VIR_A := A
VIR_B := $(VIR_A) B
VIR_A := AA
```

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