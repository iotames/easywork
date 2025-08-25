## 跨平台对话框工具库

https://github.com/sqweek/dialog


## 文件选择器对话框

- `github.com/sqweek/dialog`: 一个简易好用的跨平台的系统 `对话框` API调用，可用于 选择文件（文件夹），消息提示，操作确认等。


```go
package main

import (
    "fmt"
    sqdialog "github.com/sqweek/dialog"
)

func main() {
    filename, err := sqdialog.File().Filter("Excel表格(*.xlsx)", "xlsx").Load()
    if err != nil {
        panic(err)
    }
    fmt.Println(filename)

    # 消息确认对话框
    # ok := dialog.Message("%s", "Do you want to continue?").Title("Are you sure?").YesNo()

    # 文件选择对话框
    # filename, err := dialog.File().Filter("Mp3 audio file", "mp3").Load()

    # 保存文件对话框
    # directory, err := dialog.Directory().Title("Load images").Browse()
}
```