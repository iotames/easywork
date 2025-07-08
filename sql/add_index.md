## 查看表索引

```mysql
    show index from `table_name`;
    SHOW keys FROM `table_name`;
```

Table 表的名称。
Non_unique 如果索引不能包括重复词，则为0。如果可以，则为1。
Key_name 索引的名称。
Seq_in_index 索引中的列序列号，从1开始。
Column_name 列名称。
Collation 列以什么方式存储在索引中。在MySQL中，有值‘A'（升序）或NULL（无分类）。
Cardinality 索引中唯一值的数目的估计值。通过运行ANALYZE TABLE或myisamchk -a可以更新。基数根据被存储为整数的统计数据来计数，所以即使对于小型表，该值也没有必要是精确的。基数越大，当进行联合时，MySQL使用该索引的机 会就越大。
Sub_part 如果列只是被部分地编入索引，则为被编入索引的字符的数目。如果整列被编入索引，则为NULL。
Packed 指示关键字如何被压缩。如果没有被压缩，则为NULL。
Null 如果列含有NULL，则含有YES。如果没有，则该列含有NO。
Index_type 用过的索引方法（BTREE, FULLTEXT, HASH, RTREE）。
Comment 更多评注。


## 创建索引

1. 添加PRIMARY KEY（主键索引）
```
    ALTER TABLE `table_name` ADD PRIMARY KEY ( `column` )
    alter table yx_marketing_details add index(id);
```

2. 添加UNIQUE(唯一索引) 
```
    ALTER TABLE `table_name` ADD UNIQUE `index_name` (`column`);
    CREATE UNIQUE INDEX `index_name` ON `table_name` (column_list);
```
3.  添加INDEX(普通索引) 
```
    ALTER TABLE `table_name` ADD INDEX `index_name` (column list);
    CREATE INDEX `index_name` ON `table_name` (column_list);
    ALTER TABLE `article` ADD INDEX (`id`,`order_id`);
```
4. 添加FULLTEXT(全文索引)
```
    ALTER TABLE `table_name` ADD FULLTEXT ( `column`) 
```
5. 添加多列索引 
```
    ALTER TABLE `table_name` ADD INDEX index_name ( `column1`, `column2`, `column3` )
```

## 删除索引
```
    drop index index_name on table_name ;
    alter table table_name drop index index_name ;
    alter table table_name drop primary key ;
```

## 修改索引

mysql没有真正意义的修改索引，只有先删除之后再创建新的索引，才可以达到修改的目的，
原因是mysql在创建索引时会对字段建立关系长度等，只有删除后创建新的索引，才能创建新的关系，保证索引的正确性；

    DROP INDEX login_name_index ON user; 
    ALTER TABLE user ADD UNIQUE login_name_index(login_name);
or
    CREATE INDEX login_name_index ON user(login_name);

## 重建索引

    REPAIR TABLE `table_name` QUICK;


## 建索引的几大原则

### 联合索引最左前缀匹配原则

where条件一定要有联合索引的`第一个字段`。是否走联合索引与where条件的`顺序无关`，只与字段有关。

1. 最左前缀匹配原则，非常重要的原则，mysql会一直向右匹配直到遇到`范围查询`(>、<、between、like)就停止匹配。比如a = 1 and b = 2 and c > 3 and d = 4 如果建立(a,b,c,d)顺序的索引，d是用不到索引的，如果建立(a,b,d,c)的索引则都可以用到，a,b,d的顺序可以任意调整。

2. =和in可以乱序，比如a = 1 and b = 2 and c = 3 建立(a,b,c)索引可以任意顺序，mysql的查询优化器会帮你优化成索引可以识别的形式。

3. 尽量选择区分度高的列作为索引，区分度的公式是count(distinct col)/count(*)，表示字段不重复的比例，比例越大我们扫描的记录数越少，唯一键的区分度是1，而一些状态、性别字段可能在大数据面前区分度就是0，那可能有人会问，这个比例有什么经验值吗？使用场景不同，这个值也很难确定，一般需要join的字段我们都要求是0.1以上，即平均1条扫描10条记录。

4. 索引列不能参与计算，保持列“干净”，比如from_unixtime(create_time) = ’2014-05-29’就不能使用到索引，原因很简单，b+树中存的都是数据表中的字段值，但进行检索时，需要把所有元素都应用函数才能比较，显然成本太大。所以语句应该写成create_time = unix_timestamp(’2014-05-29’)。

5. 尽量的扩展索引，不要新建索引。比如表中已经有a的索引，现在要加(a,b)的索引，那么只需要修改原来的索引即可。


### 尽量避免全表扫描

1. 尽量避免在 where 子句中对字段进行 `null` 值判断，否则将导致引擎放弃使用索引而进行全表扫描
2. 应尽量避免在 where 子句中使用 `!=` 或 `<>` 操作符，否则引擎将放弃使用索引而进行全表扫描
3. 应尽量避免在 where 子句中使用 `or` 来连接条件，否则将导致引擎放弃使用索引而进行全表扫描
4. in 和 not in 也要慎用，否则会导致全表扫描

```
select id from t where num is null可以在num上设置默认值0，确保表中num列没有null值，然后这样查询：select id from t where num=0
```

小技巧:  使用 `\G` 代替 `;` 结束一行SQL语句，可使得查询结果横排变`竖排`。

----------

> mysql中建立索引的一些原则 https://www.cnblogs.com/SZLLQ2000/p/9797199.html
> 一张图彻底搞懂MySQL的 explain https://segmentfault.com/a/1190000021458117?utm_source=tag-newest
> MySQL索引原理及慢查询优化 https://tech.meituan.com/2014/06/30/mysql-index.html
> 关于分布范围特别小的字段（比如只有 0,1 这种的）不适合建索引的说法的实践分析 https://mengkang.net/1133.html
> 从分析Count(ID)慢SQL原因到联合索引的引申扩展比较（图文真实步骤详细） https://blog.csdn.net/wolf_love666/article/details/87986846