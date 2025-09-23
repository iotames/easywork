---------------FOR MYSQL----------------------------

-- (column_list)是要添加索引的字段。可以是(`id`,`order_id`) 或 (`order_id`)

-- 添加普通非唯一索引
CREATE INDEX `index_name` ON `table_name` (column_list);

-- 添加唯一索引
CREATE UNIQUE INDEX `index_name` ON `table_name` (column_list);

-- 添加FULLTEXT(全文索引)
ALTER TABLE `table_name` ADD FULLTEXT ( `column`)

-- 删除索引
drop index index_name on table_name ;
alter table table_name drop index index_name ;


-- 给工号添加唯一索引
ALTER TABLE `user` ADD UNIQUE INDEX idx_employee_num (employee_num);

-- 联合索引，常见于关系表中。
-- 联合索引是指在一个索引中包含多个列，这样可以提高查询效率，尤其是在涉及多个列的查询时。
ALTER TABLE user ADD UNIQUE INDEX idx_user_email (user_id, email);

-- 建表时添加
CREATE TABLE your_table (
    field1 INT,
    field2 VARCHAR(50),
    CONSTRAINT idx_field1_field2 UNIQUE (field1, field2)
);


-- 没有指定索引名，使用系统自动生成的名称。不推荐
ALTER TABLE `article` ADD INDEX (`id`,`order_id`);

---------------FOR POSTGRESQL----------------------------

-- 添加唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS "UQE_request_id" ON qiniu_cdnauth_requests USING btree (request_id);

-- 添加普通索引
CREATE INDEX IF NOT EXISTS "IDX_client_ip" ON qiniu_cdnauth_requests USING btree (client_ip);
