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