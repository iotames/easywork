## Git Hooks 简介

Git 钩子是在特定操作（commit、push 等）时自动执行的自定义脚本。
- **核心规则**：`pre-*` 钩子返回**非零值**会阻塞操作；`post-*` 仅用于通知，无法阻塞。
- **物理存放**：客户端（`.git/hooks/`）和服务端（`裸仓库.git/hooks/`）目录均可放置任何脚本。
- **触发界限**：脚本是否执行**不取决于存放位置**，而取决于**触发命令的上下文**（如 `git commit` 触发客户端钩子，远程 `git push` 触发服务端 `receive` 系列钩子）。


## Webhook 实战（服务端 post-receive）

适用极简 `--bare` 服务端，替代 GitHub/GitLab 的 Webhook 界面。

**步骤**：进入服务端仓库 `hooks` 目录，创建 `post-receive` 并赋予执行权限。

**脚本内容**（带注释）：
```bash
#!/bin/sh

# =============================================
# 配置你的 Webhook 接收地址（直接 URL 带 token 验身）
# =============================================
WEBHOOK_URL="https://your-service.com/api?token=你的密钥"

# 【关键知识点】post-receive 钩子通过 标准输入（STDIN） 接收三个变量
# 这三个变量由 Git 自动传入，顺序固定，格式如下：
#
#   oldrev（旧版本号）  newrev（新版本号，即最新的CommitID）  refname（分支引用全名。例：refs/heads/master）
#
# 下面用 read 命令一次性读取并赋值给这三个变量
while read oldrev newrev refname
do
    # --------------------------------------------------------
    # 【关于 refname 变量】
    # 它是一个完整的引用路径，例如：refs/heads/master
    # 如果你只想针对特定分支触发，可以用下面的方法截取纯分支名
    # --------------------------------------------------------
    # 提取纯分支名（例如将 refs/heads/master 变成 master）
    branch=$(basename "$refname")

    repository=$(basename $(pwd))

    # 策略：仅针对 master 分支触发（可删除 if 改为全触发）
    if [ "$branch" = "master" ]; then
        # 发送 POST 请求
        curl -X POST \
             -H "Content-Type: application/json" \
             -d "{
                    \"repository\": \"$repository\", 
                    \"branch\": \"$branch\",
                    \"oldrev\": \"$oldrev\",
                    \"newrev\": \"$newrev\",
                    \"ref\": \"$refname\"
                 }" \
             "$WEBHOOK_URL"
        echo "Webhook Done for repository:$repository, branch:$branch, oldrev:$oldrev, newrev:$newrev, ref:$refname" >> /tmp/webhook.log
    fi
done
```


## 常用钩子类型

### 客户端钩子（本地命令触发）
| 钩子名称               | 触发时机                         | 能否中断 |
|------------------------|----------------------------------|----------|
| pre-commit             | 提交信息输入前                   | ✅ 是    |
| prepare-commit-msg     | 默认信息生成后、编辑器启动前     | ✅ 是    |
| commit-msg             | 用户输入提交信息后               | ✅ 是    |
| post-commit            | 提交完成后                       | ❌ 否    |
| pre-rebase             | git rebase 执行前                | ✅ 是    |
| post-checkout          | git checkout 或 clone 成功后     | ❌ 否    |
| post-merge             | git merge 成功后                 | ❌ 否    |
| pre-push               | git push 执行前                  | ✅ 是    |


### 服务端钩子（远程 push 接收时触发）
| 钩子名称               | 触发时机                         | 能否中断 |
|------------------------|----------------------------------|----------|
| pre-receive            | 处理推送最先运行，检查所有引用   | ✅ 是（拒绝全部） |
| update                 | 每个分支单独运行                 | ✅ 是（仅拒该分支） |
| post-receive           | 引用更新完成后                   | ❌ 否（Webhook 最佳位置） |
| post-update            | 旧版，功能同 post-receive        | ❌ 否    |
| push-to-checkout       | 推送更新了服务器当前检出分支时   | ✅ 是    |
