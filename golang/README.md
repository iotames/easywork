## 相关资源

- 官方下载：https://go.dev/dl/
- 国内阿里镜像：https://mirrors.aliyun.com/golang/

## 安装

### FOR LINUX

```
# 下载go环境压缩包，链接可自行替换为最新版本
wget -c https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
# 若国内网络差，下载不来，可以使用阿里镜像源:
# https://mirrors.aliyun.com/golang/go1.21.0.linux-amd64.tar.gz

# 解压缩到/usr/local目录
tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
# 添加go可执行文件所在的目录到环境变量。
# 可在系统初始化文件 /etc/profile 的最末行添加代码: export PATH=$PATH:/usr/local/go/bin
vim /etc/profile
# 手动执行初始化文件，使得环境变量更改生效
source /etc/profile
# 验证go是否安装成功。
go version
```

### FOR WINDOWS

1. 下载并安装文件: [https://go.dev/dl/go1.21.0.windows-amd64.msi](https://go.dev/dl/go1.21.0.windows-amd64.msi)
2. 打开cmd命令窗口验证go命令: `go version`


## 环境设置

查看所有go环境设置项的值: `go env`

输入如下命令，更改默认设置项以方便后续开发:

```
# 开启GO111MODULE，方便第三方包的导入
go env -w GO111MODULE=on
# 使用国内Go模块代理，加速第三方包导入速度
go env -w GOPROXY=https://goproxy.cn,direct
```

## 项目创建

1. 在新目录初始化本地项目(`myproject`)，生成 `go.mod` 文件: `go mod init myproject`

2. 新建 `main.go` 入口文件，通过 `import` 语法导入包，在 `func main()` 入口函数中编写代码

3. 更新依赖，生成 `go.sum` 文件: `go mod tidy`

4. 调试运行: `go run .`

5. 编译成二进制可执行文件(`myproject.exe`): `go build .`