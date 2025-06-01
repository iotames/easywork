## npm和npx


```
# npx 的设计中，--registry 等配置参数属于 npx 自身的全局参数，必须紧跟在 npx 命令之后，在目标命令之前指定。
npx --registry=https://registry.npmmirror.com create-react-app my-app

# npm install 的 --registry 是 npm 命令的配置参数，需放在子命令（install）之后
npm install -g create-react-app --registry=https://registry.npmmirror.com
```

- npx 的参数是 前置修饰符（影响 npx 自身行为）。
- npm install 的参数是 后置修饰符（影响 install 子命令的行为）


## nodejs和npm版本切换

### FOR Windows

nvm-windows 是 Windows 官方支持的 Node 版本管理工具，功能类似于 macOS/Linux 的 nvm。

- https://github.com/coreybutler/nvm-windows
- 推荐手动安装，下载免安装版本：https://github.com/coreybutler/nvm-windows/releases/download/1.2.2/nvm-noinstall.zip

1. 卸载现有 Node.js（如果已安装）,包括 npm 相关目录（如 `C:\Users\<你的用户名>\AppData\Roaming\npm`）。
2. 下载 `nvm-noinstall.zip` 并解压缩到一个目录。如：`C:\Users\<username>\AppData\Roaming\nvm`
3. 添加一个名为 `NVM_HOME` 的新环境变量。为上一步的 `nvm` 所在目录。默认值为： `C:\Users\<username>\AppData\Roaming\nvm`
4. 添加一个 `NVM_SYMLINK` 环境变量，代表当前版本的 `NodeJS`。这是快捷方式路径，当前是不存在的，后由 `nvm` 自己创建和维护。例：`D:\App\activenodejs`
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

- 查看官方的发布页，获取要安装的 Node.js 版本号： [https://nodejs.org/en/download/releases](https://nodejs.org/en/download/releases)
- 可以手动下载nodejs的发行包。例：[node-v22.16.0-win-x64](https://nodejs.org/download/release/v22.16.0/node-v22.16.0-win-x64.zip) 重命名为 `v22.16.0`，然后放入 `NVM_HOME` 目录。
- 除了手动安装，也可以在NVM_HOME目录内，使用超级管理员执行命令：`install.cmd`

使用命令如下：

1. `nvm list available`: 查看网上可用的 Node.js 版本列表。也可以自己去官方网站查看：https://nodejs.org/en/download/releases
2. `nvm install 22.16.0`
3. `nvm use 22.16.0`
4. `nvm list`: 在 `NVM_HOME` 目录的所有NodeJS版本，会被扫描出来。如： `v22.16.0` 文件夹 -> `22.16.0`

