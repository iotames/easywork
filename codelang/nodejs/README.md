## nodejs和npm版本切换

### FOR Windows

nvm-windows 是 Windows 官方支持的 Node 版本管理工具，功能类似于 macOS/Linux 的 nvm。

- https://github.com/coreybutler/nvm-windows
- 下载免安装版本：https://github.com/coreybutler/nvm-windows/releases/download/1.2.2/nvm-noinstall.zip

1. 卸载现有 Node.js（如果已安装）,包括 npm 相关目录（如 C:\Users\<你的用户名>\AppData\Roaming\npm）。

2. 下载 nvm-noinstall.zip 并解压缩到一个目录。如：`C:\Users\<username>\AppData\Roaming\nvm`

3. 添加一个名为 `NVM_HOME` 的新环境变量。为上一步的nvm所在目录。如果使用默认值，则为 C:\Users\<username>\AppData\Roaming\nvm

4. 添加一个 `NVM_SYMLINK` 环境变量。这是一个快捷方式路径，目前是不存在的，由nvm自己传教和维护。

5. 把前面的 `NVM_HOME` 和 `NVM_SYMLINK` 添加到 `PATH` 环境变量中。

6. 在 NVM_HOME 目录下，创建一个名为 `settings.txt` 的文件，内容如下：

```
root: D:\App\nvm-noinstall
path: D:\App\activenodejs
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
arch: 64
useragent: null
```

查看 https://nodejs.org/en/download/releases 获取要安装的 Node.js 版本号。


1. nvm install 16.20.2
2. nvm list
3. nvm use 16.20.2
