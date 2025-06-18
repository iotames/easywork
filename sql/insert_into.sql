-- INSERT INTO ... SELECT ... FROM
-- 从一个表复制数据，然后把数据插入到一个已存在的表中。

INSERT INTO Websites (name, country)
SELECT app_name, country FROM apps;

-- INSERT INTO ... SELECT ... FROM ... ON CONFLICT ... DO UPDATE SET
-- INSERT INTO ... SELECT ... FROM ... ON CONFLICT ... DO NOTHING

-- 冲突时更新字段
INSERT INTO employees (id, name, salary)
SELECT id, name, 50000 FROM candidates  -- 通过 SELECT 插入
ON CONFLICT (id) 
DO UPDATE SET 
    salary = EXCLUDED.salary;       -- 使用 EXCLUDED 引用新值

-- 冲突时忽略
INSERT INTO departments (dept_id, dept_name)
VALUES (101, 'HR')
ON CONFLICT (dept_id) 
DO NOTHING;                             -- 冲突时不操作


-- 从来源表SELECT出数据，插入到用户部门关系表。并指出如果数据已存在（通过ON CONFLICT语句指定），则执行更新操作。
INSERT INTO usercenter."departmentsUsers" (
    "departmentId", 
    "userId", 
    "isMain", 
    "isOwner", 
    "createdAt", 
    "updatedAt"
)
SELECT 
    d.id AS "departmentId",
    u.id AS "userId",
    true AS "isMain",
    (sm.s_lead_flag = 1) AS "isOwner", 
    CURRENT_TIMESTAMP AS "createdAt",
    CURRENT_TIMESTAMP AS "updatedAt"
FROM (
    SELECT 
        s_manager_id + 10000 AS new_user_id,
        s_department_id + 10000 AS new_department_id
    FROM ods.s_manager WHERE s_activate_flag = 1
) ods_data
JOIN usercenter.users u ON u.id = ods_data.new_user_id  -- 通过转换后的用户ID关联
JOIN usercenter.departments d ON d.id = ods_data.new_department_id  -- 通过转换后的部门ID关联
---- WHERE ods_data.s_activate_flag = 1
ON CONFLICT ("departmentId", "userId") 
DO UPDATE SET 
    "isMain" = EXCLUDED."isMain",
    "isOwner" = EXCLUDED."isOwner",
    "updatedAt" = EXCLUDED."updatedAt"
;
