## SQL更新说明

此处存放SQL脚本文件。生产环境不允许直接修改数据库。

项目 `代码` 完成版本升级后，如数据库结构无法自动升级，要通过SQL语句脚本，实现 `数据` 方面的升级和BUG修复。

注：为避免代码合并产生冲突。新版本发布前，sql文件用各自的模块命名。如：`santic_plm.sql`, `santic_crm.sql`, `santic_mrp.sql`
等打新版本标签前，再合并所有模块的SQL脚本。

## 目的

1. 版本升级：版本升级后，确保数据库结构与代码同步匹配。运行不报错，不丢数据。


## 数据表结构升级

1. `v0.3.0_from_v0.2.0.sql`: 从 `v0.2.0` 升级到 `v0.3.0` 版本。包含版本迭代期间，需要处理的SQL语句。
2. 执行条件：生产环境发布新代码版本后执行。

