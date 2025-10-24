---------------FOR POSTGRESQL----------------------------
-- 查看当前时间
SELECT current_timestamp;

-- 查看数据库大小
SELECT pg_size_pretty(pg_database_size('qiniudb')) AS database_size;

-- 查看表大小
SELECT
    pg_size_pretty(pg_relation_size('qiniu_cdnauth_requests')) AS "表数据大小",
    pg_size_pretty(pg_indexes_size('qiniu_cdnauth_requests')) AS "索引大小",
    pg_size_pretty(pg_total_relation_size('qiniu_cdnauth_requests')) AS "总大小(含TOAST和索引)",
    pg_size_pretty(pg_total_relation_size('qiniu_cdnauth_requests') - pg_relation_size('qiniu_cdnauth_requests') - pg_indexes_size('qiniu_cdnauth_requests')) AS "估算的TOAST及相关开销";

-- 指定schema的总大小
SELECT
    pg_size_pretty(SUM(pg_total_relation_size(schemaname || '.' || tablename))) AS total_size
FROM pg_tables WHERE schemaname = 'myschema'; 


-- 查看是否关联TOAST表。查询返回0，则此表没关联的TOAST表（可能是因为表中没有超大字段，或所有数据都能内联存储）。
-- 25443
SELECT reltoastrelid FROM pg_class WHERE relname = 'ods_cwr_end_url_request_snapshot_nd'

-- 查看ods_cwr_end_url_request_snapshot_nd表所关联的TOAST表的表名，及其占用的空间大小
SELECT 
    relname AS toast_table_name, -- pg_toast_25438
    pg_size_pretty(pg_total_relation_size(oid)) AS toast_table_size
FROM pg_class 
WHERE oid = (SELECT reltoastrelid FROM pg_class WHERE relname = 'ods_cwr_end_url_request_snapshot_nd');


-- 查看对应TOAST表的chunk_id（标识属于哪个原始值）、chunk_seq（块的顺序）和chunk_data（实际的压缩数据）等字段
SELECT 
    chunk_id,
    COUNT(*) AS number_of_chunks,
    pg_size_pretty(SUM(octet_length(chunk_data))::bigint) AS total_original_data_size
FROM pg_toast.pg_toast_25438  -- 上一步查询到的值：pg_toast_25438
GROUP BY chunk_id
ORDER BY number_of_chunks DESC
LIMIT 10;
