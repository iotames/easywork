## 开发原则

`开发原则，优先级从上往下，依次排列。`

### 小步快跑原则

-  缩短功能合并周期，方便团队成员，及时共享开发进度。方便调试，更早发现问题。
- 【个人功能开发分支】长期单打独斗，合并到主线，容易出现代码冲突。

### 开发分支最新原则

【dev公共分支】进度保持最新，也包括紧急BUG修复的代码。其他分支的更改，都及时同步到开发分支上。


### 单向合并原则

更新频繁（频繁git push或则频繁被Merge）的分支，向更新不频繁的稳定分支合并。

如下所示：

1. 【个人功能开发分支】合并到（Merge into）【dev公共分支】
2. 【dev公共分支】合并到（Merge into）【test测试分支】
3. 【test测试分支】合并到（Merge into）【release预发布分支】
4. 【release预发布分支】合并到（Merge into）【master生产分支】

例：【release预发布分支】短期内发布了 `v1.1.1` ~ `v1.1.5` 5个小版本，但生产分支只使用 `v1.1.5`

`特例`：

- 解决分支合冲突：需要把【dev公共分支】反向合并到【个人功能开发分支】。
- 紧急更新流程：虽然 `违反【单向合并原则】`，但满足 `【开发分支最新原则】`。


## Git开发工作流

- myname: 团队成员【个人功能开发分支】
- dev: 团队公共分支
- 开发周期建议：1天1次commit提交和push推送。1周至少1次分支合并。

### 个人独立分支开发

1. 同步最新的【dev公共分支】到本地。【重要】
2. 基于最新的【dev公共分支】，创建【个人功能开发分支】。在此基础上开发。
3. 【个人功能开发分支】开发完成，推送到远程库。
4. 线上提交【个人功能开发分支】into【dev公共分支】的合并请求。如有冲突，见 `解决分支合并冲突` 部分。
5. 如果【个人功能开发分支】已被合并到【dev公共分支】，必须删除。【重要】

命令行示例：

```
# 拉取最新的dev分支到本地
git pull origin dev

# 在现有的dev分支上，创建自己本地的开发分支。并切换过去。
git checkout -b myname

# 本地开发，在自己本地仓库的开发分支中，保存开发进度。
git add .
git commit -m "UPDATE SOMETHING"

# 推送自己的分支到远程仓库，并提交分支合并请求
git push origin myname

# 切换到本地dev分支。使用git checkout dev 或 git switch dev
git checkout dev

# 删除自己的本地分支
git branch -d myname
```

注意：

1. 【个人工作分支】合并到公共分支，有小功能完成，`没明显BUG，就可以合并`。比如一个表单页面。
2. 每次创建【个人工作分支】，都是基于最新的【dev公共分支】。
3. 为保证第2点，每次线上仓库合并成功后，当前的【个人工作分支】必须删掉。


### 解决分支合并冲突

```
# 1. 更新本地dev公共分支
git checkout dev
git pull origin dev

# 2. 切换到个人功能分支（可从远程重新拉取，origin代表远程仓库）
# 如本地的个人功能分支，已被删除，则基于远程再创建
git checkout -b feature/xxx origin/feature/xxx
# 如本地的个人功能分支未删除，就直接切换过去
git checkout feature/xxx

# 3. 合并最新dev分支（产生冲突）
# 合并方向：
git merge dev

# 4. 解决冲突
git status
# 手动编辑冲突文件（保留需要的代码，删除冲突标记<<<<<<<, =======, >>>>>>>）
git add .
git commit -m "Merge dev into feature/xxx and resolve conflicts"

# 5. 推送到远程
# 如果推送被拒绝（因分支历史变更），使用：git push --force-with-lease origin feature/xxx
git push origin feature/xxx

```

### 团队公共分支合并

```
# 拉取远程主分支和成员的个人分支
git pull origin dev
git pull origin myname

# 保证现有分支为公共分支。查看分支和切换分支命令如下：
# git branch
# git checkout dev 或者 git switch dev
git branch
git switch dev

# 合并个人分支到团队的公共分支中
git merge myname

# 测试公共是否正常，有代码冲突就解决冲突，然后推送到远程库
git push origin dev

# 删除成员的个人分支
git branch -d myname
```

### 紧急更新流程

在满足【开发分支最新原则】的基础上，可以不满足【单向合并原则】，创建的特例的【紧急更新分支】。

- 【紧急更新分支】，可以换成其他名字。
- 【master生产分支】也可以换成【release预发布分支】或【test测试分支】。

1. 【紧急更新分支】基于【master生产分支】创建。
2. 更新后，合并到【master生产分支】，并同步合并到【dev公共分支】。


![gitflow](https://gitee.com/catmes/easywork/raw/master/git/gitflow.png "gitflow")

### 个人功能分支操作

```
# 删除名为myname的远程分支
git push origin --delete myname

# 先切换到其他分支，然后删除本地myname分支
git switch dev
git branch -d myname
```

## 查看

```
# 查看提交状态
git status

# 查看本地分支
git branch

# 查看本地和远程的所有分支
git branch -a
```

## 新建和切换分支

- https://git-scm.com/docs/git-branch/zh_HANS-CN
- https://git-scm.com/docs/git-switch/zh_HANS-CN


新建分支：

```
# 基于本地当前分支，创建新分支feature1，并切换过去
git checkout -b feature1

# 基于origin远程库，在本地创建同名分支，并切换过去
git checkout -b feature1 origin/feature1 

# 拉取远程17.0分支到本地
git fetch origin 17.0:17.0
# 切换到17.0分支
git checkout 17.0

```


切换分支：

```
# 切换到本地分支feature1
git checkout feature1

# 创建全新的空白分支 git version < 2.23
git checkout --orphan <new_branch_name>

# 创建全新的空白分支 git version >= 2.23
git switch --orphan <new_branch_name>
```

## 克隆仓库

```
# 克隆包含仓库的全部提交历史
git clone https://github.com/odoo/odoo.git

# 克隆17.0分支
git clone -b 17.0 https://github.com/odoo/odoo.git odoo17

# 克隆仓库包含最近3次提交历史
git clone --depth 3 -b 17.0 --single-branch https://github.com/odoo/odoo.git odoo17
```

参数说明:

- `--depth 3` : 只克隆最近提交的3条记录到本地。
- `-b 17.0 --single-branch` : 只拉取分支 `17.0`


## 拉取仓库

`git pull <远程主机名> <远程分支名>:<本地分支名>`

```
git pull origin master:master

# 简写
git pull
```

## 推送仓库

```
git push
git push origin master:master
```

[git switch和git checkout](https://blog.csdn.net/weixin_47695827/article/details/141824669)


## 远程库增删改查

```
git remote add <远程库名> <远程库地址>
git remote remove <远程库名>
git remote rename <原远程库名> <新远程库名>
git remote set-url <远程库名> <远程库地址>

# 查看所有远程库信息
git remote -v
```

> git 创建空分支 https://blog.csdn.net/linyichao1314/article/details/136956650
> Git 实用技巧2——新建空白分支 | 重命名分支 | 回退到历史 commit https://blog.csdn.net/m0_49270962/article/details/137759940

