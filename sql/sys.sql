---------------FOR POSTGRESQL----------------------------

-- 查看数据库大小
SELECT pg_size_pretty(pg_database_size('qiniudb')) AS database_size;

-- 查看表大小
SELECT pg_size_pretty(pg_total_relation_size('qiniu_cdnauth_requests')) AS total_size, current_timestamp;
