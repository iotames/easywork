#!/bin/sh

# Git团队协作时，第一件事，先设置固定的用户名和邮箱。
# Git仓库应用常用邮箱识别用户。在不同设备提交代码，身份信息如不固定，会导致代码提交用户身份识别错乱。在多台电脑上开发，要尤其注意。

git config --global user.email hankin@catmes.com
git config --global user.name "Hankin"
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
