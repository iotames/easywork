
## 使用nvm对nodejs和npm进行版本切换

nvm(Node Version Manager)一个非常流行的工具，用于在Linux、macOS和Windows上管理多个Node.js版本。

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


### FOR Linux

```
# 选择以下命令之一安装：
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# 重新加载SHELL配置
source ~/.bashrc
```


## 各种报错

 1. `Error: EPERM: operation not permitted`: 权限不够，需要使用管理员权限运行。或者把NodeJS放弃使用NVM的方式。

```
# 放弃使用NVM
# 1. 清除缓存。
# 2. 重命名 NVM_HOME 目录。使环境变量失效。
# 3. 移动NodeJS的安装目录。
# 4. 添加环境变量。
# 5. 重新安装。
npx clear-npx-cache
npm cache clean --force
set PATH=%PATH%;C:\Program Files\Node\v22.16.0

# 安装并启动
npx n8n

# 如需固定路径，改用全局安装
# npm install -g n8n

# 使用npx启动n8n. 因为n8n命令不在环境变量中，无法直接识别。
# npx n8n start
```