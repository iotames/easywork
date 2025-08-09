## 视图文件

1. 通过xml或csv文件初始化数据，只在模块安装时写入到数据库。后期修改文件升级模块，不再更新数据库数据（Odoo17）。

解决方案：去数据库设置对应数据的 `noupdate = false`

```sql
update ir_model_data i set noupdate = false
where
        i.model = 'product.category'
        and i."module" = 'santic_base_data'
        and i.noupdate = true
        and i."name" in ('product_category_trims',
'product_category_zipper',
'product_category_slider',
'product_category_packing_tape')

update ir_model_data i set noupdate = false
where
        i.model = 'santic.accessory.attribute'
        and i."module" = 'santic_base_data_init'
        and i.noupdate = true
        and i."name" in ('product_category_trims',
'accessory_attribute_velcro_attribute')
```

2. 视图代码文件更新未生效，可手动删除数据库的视图数据：设置 - 激活开发者模式 - 技术 - 用户界面 - 视图