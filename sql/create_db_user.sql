----------- 创建用户
create user username with password '123456';
---- 创建数据库
create database userdb owner username;
---- 授权数据库给用户
grant all privileges on database userdb to username;
---- 创建schema
create schema your_schema authorization username;

------------demo:--cureate--local--dev--db--for--odoo-------
create user odoo with password 'odoo';
create database odoo owner odoo;
grant all privileges on database odoo to odoo;
