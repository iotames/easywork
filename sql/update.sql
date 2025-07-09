-- 更新部门的 parentId 字段，将其指向 originParentId 对应的部门。
UPDATE public.departments A
SET "parentId" = B.id,
    "updatedAt" = CURRENT_TIMESTAMP
FROM public.departments B
WHERE A."parentId" IS NULL 
  AND A."originParentId" IS NOT NULL 
  AND B."originId" = A."originParentId";

-- 如果该部门没有子部门，则将其标记为叶子节点。isLeaf 字段为 TRUE。
UPDATE public.departments A
SET "isLeaf" = TRUE,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM public.departments C
    WHERE C."parentId" = A.id
);
