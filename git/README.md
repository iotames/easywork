## 说明

安装完Git客户端之后，可以先运行 `conf.sh`


## 配置文件

- 代码仓库的配置文件：`.git/config`


## 常见命令

### 指定仓库目录和工作目录

```bash
# 指定仓库目录
git --git-dir=/path/to/repository/.git pull

# 临时指定工作目录
git –work-tree=/path/to/directory pull

# 同时指定仓库目录和工作目录
git --git-dir=/path/to/repository/.git --work-tree=/path/to/directory pull
```

### 设置用户名和邮箱

因为在不同环境上提交代码，身份信息会变。导致用户身份，换来换去的。团队开发时尤其要注意。

1. Git团队协作时，第一件事，先设置固定的用户名和邮箱。
2. 在多台电脑上开发，就要设置多次。
3. 可以去掉 `--global` 参数选项，为指定仓库的独立设置。

```
git config --global user.name "John Smith"
git config --global user.email john@example.com

# 对最近一次commit进行修改
git commit --amend
```
