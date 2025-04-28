#!/bin/sh

# Git团队协作时，第一件事，先设置固定的用户名和邮箱。
# 因为在不同环境上提交代码，身份信息会变。导致用户身份识别规范不起来。在多台电脑上开发，就要设置多次。

# git config --global user.name "Hankin"
# git config --global user.email hankin@catmes.com
git config --global color.ui true

# 提交时转换为LF，检出时不转换    For Linux
git config --global core.autocrlf input

# 拒绝提交包含混合换行符的文件 
git config --global core.safecrlf true   

# [推荐] 提交包含混合换行符的文件时给出警告
git config --global core.safecrlf warn

# 忽略文件权限检查
git config --global core.filemode false

# 查看全局设置
git config --global --list
