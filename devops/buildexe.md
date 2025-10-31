## Windows应用打包

### rcedit

[rcedit](https://github.com/electron/rcedit) 一个用于修改Windows程序元数据的命令行工具。如图标、文件描述符、版权信息等。

- 通用性： 由于其底层直接调用 Windows API，它是一个通用的 PE 资源编辑器，适用于任何 Windows 可执行文件（.exe/.dll）

```yaml
- name: Download and use rcedit
  run: |
    # 下载预编译的 rcedit
    curl -L https://github.com/electron/rcedit/releases/download/v2.0.0/rcedit-x64.exe -o rcedit.exe
    # 使用 rcedit 为 EXE 设置图标和版本信息
    ./rcedit.exe "your-application.exe" --set-icon "app.ico"
    ./rcedit.exe "your-application.exe" --set-file-version "1.0.0.0"
    ./rcedit.exe "your-application.exe" --set-product-version "1.0.0.0"
    ./rcedit.exe "your-application.exe" --set-version-string "LegalCopyright" "© 2025 Your Company"
```

### goversioninfo

[goversioninfo](https://github.com/josephspurrier/goversioninfo) Go语言用于生成带元数据的Windows程序。包括图标，版本信息等。


```bash
# 生成图标和版本信息
go install github.com/josephspurrier/goversioninfo/cmd/goversioninfo@latest
goversioninfo versioninfo.json

# 编译
go build -v -o app.exe -trimpath -ldflags "-s -w -linkmode internal -buildid= -X 'main.AppVersion=v0.0.1' -X 'main.GoVersion=`go version`'" .
```

## workflows

在GitHub仓库中创建 `.github/workflows` 目录，并添加 `.yml` 文件，可免费使用平台的工作流系统。

- [workflows.md](workflows/README.md)
- [GitHub Actions](https://github.com/features/actions)