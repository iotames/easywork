## Windows

- `set PATH` 设置临时环境变量(变量名和变量值用`等号`连接)
- `setx PATH` 设置永久环境变量(变量名和变量值用`空格`隔开)

```
set PATH=%PATH%;D:\Program Files\

setx PATH %PATH%;D:\Program Files\
```

## Linux

1. 读取环境变量

```
# 显示当前系统定义的所有环境变量
export

# 显示当前PATH环境变量的值
export $PATH
```

2. 设置临时环境变量

```
export PATH=$PATH:/home/go/bin
```

3. 用户环境变量: `~/.bashrc`, `~/.profile(.bash_profile)`
4. 系统环境变量: `/etc/bashrc`, `/etc/profile(bash_profile)`, `/etc/environment`

 - `~/.profile`: 只在用户登录时读取一次
 - `~/.bashrc`: 在每次打开Shell时读取

----------

> Windows命令行设置永久环境变量 https://blog.csdn.net/wqs880527/article/details/106641031/
> Linux 环境变量配置全攻略，超详干货！ https://zhuanlan.zhihu.com/p/436250121
