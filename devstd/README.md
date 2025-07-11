## 说明

记录软件开发管理工作遇见的问题和解决方案。


## 基础数据

### 数据字典的概念

- 有效字段简单，不具备字段扩展性。通常仅使用 name, value, code, type 几个字段。
- 具备业务扩展性的数据，不放数据字典。

### 使用规范

1. 必须。数据字典的类型和数据，分2张数据表存储。数据类型表，数据值明细表。符合关注点分离原则，高内聚低耦合原则。
2. 推荐。数据字典的数据，新增字段，用来标记 `是否被使用`。已被引用的数据，不允许再被修改。
3. 推荐。数据字典的数据，新增字段，用来标记，`被哪些代码文件使用`。
4. 推荐。数据字典专人维护。定期同步数据库和代码文件。初始化数据字典时，从代码写入数据库。

- 分类：同一类型的数据，不要放在多个xml文件。1个xml文件，只放1种数据类型的数据字典。
- 使用：同一类型的数据，超过50条，不推荐使用数据字典。
- 使用：数据具备业务扩展性，字段属性较多，不放数据字典。如：面料成分。
- 存放：不确定的数据（基础材料，审批状态等）放在公共模块调用。


## 代码提交

1. 小功能或修复1个BUG做1次提交，同步到远程仓库。不推荐一次性做很多功能，然后保存为一次提交。这样有问题方便回滚。
2. 代码合并说明：可以若干个提交，合在一起，申请代码合并。

graph LR
提交MR --> 指定指派人（负责整个合并过程）--> 添加审核者（代码评审）--> 触发审批规则（需核准人批准）--> 合并


## 依赖问题

梳理好依赖关系，避免循环依赖。


## 数据表字段管理

1. 未考虑旧数据与新表结构的兼容。
2. 代码结构与数据表字段不匹配：字段类型有变动，没有新增字段，而是修改原有字段类型。但是引用此字段的队友并不知情，导致严重错误。

- [数据结构升级](datastruct.md)：SQL升级脚本使用说明: 为避免代码合并产生冲突。新版本发布前，sql文件用各自的模块命名，后面再合为一处。
- 开发：删除数据表字段，修改字段类型，必须在统一地方（做个CURD功能的数据列表，实现此需求），提交数据表字段的变动说明。


## 配置一致性

本地开发环境，线上开发联调环境，线上测试环境，线上UAT环境，线上生产环境满足以下要求：

1. 安装的模块保持一致。
2. 使用 -u 参数启动应用，保证安装的模块同步更新。如某个模块的更新变动，会影响到其他模块，可以及时发现。
3. 配置文件的关键配置项保持一直。
4. 个人分支代码，提交合并请求之前，先复制 `线上开发联调环境` 的数据库到本地，进行初步测试。
5. 连接 `测试环境` 或 `UAT环境` 的数据库的 `只读账户`，进行初步测试。测试通过后，再提交合并请求。

维护 `env.prod` 文件的 `ODOO_UPDATE_MODULES` 变量。模块按 `依赖先后顺序` 排列。

```
ODOO_UPDATE_MODULES=st_data_dict,st_base_data,st_purchase,st_plm,st_contacts,st_account,st_sales,st_mrp,st_logistics,st_quality
```

## 版本号和模块分类

1. 提交代码合并时，往上叠加版本号。方便用户测试和BUG反馈。

小修改，没动数据库表结构。版本号末位+1。改到数据表，倒数第二位+1，末位重置为0

2. 模块的分类，添加 `'application': True` 配置，并统一以 `Santic/` 开头，方便筛选。

`__manifest__.py`文件配置：
```__manifest__.py
{
'installable': True,
'application': True,
"version": "17.0.7.1",
"category": 'Santic/ERP'
}
```