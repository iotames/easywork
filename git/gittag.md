## 简介

Git 中的 tag 命令用于给特定的提交添加标签。常用于标记版本发布点，或在项目中对特定的提交做出重要标记。通过标签，开发人员能够轻松地追踪版本或发布状态。

## 命令

```bash
git add .
git commit -m "in order to build my packagist"
git push
git tag v1.0.0
git push origin --tags
```

基本语法:

```bash
git tag [选项] [标签名称] [提交哈希]
```

示例：

```bash
# 在当前提交上创建名为 v1.0 的标签
git tag v1.0

# 为哈希为 abc123 的提交创建名为 v1.0 的标签。
git tag v1.0 abc123

# 创建附注标签。附注标签包含更多的元数据信息，如标签作者、日期、信息等。
# -a 用于创建附注标签。
# -m 指定附注标签的注释信息。
git tag -a v1.1 -m "版本1.1发布，修复了bug"

# 强制修改已有标签: 将 v1.0 标签指向新的提交 abc123
git tag -f v1.0 abc123
```

- 查看: `git tag`
- 打标签(默认为最新commit, 可指定): `git tag v1.0.1`, `git tag v2.0.1 37c8036`
- 带说明的标签: `git tag -a v1.0.1 -m "标签说明"`
- 删除标签: `git tag -d v1.0.1`
- 删除远程标签: `git push origin :refs/tags/v1.0.1`
- 推送标签到远程: `git push origin v1.0.1` or `git push origin --tags`



