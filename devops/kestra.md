## 安装启动

- 项目主页：https://github.com/kestra-io/kestra
- docker镜像：https://hub.docker.com/r/kestra/kestra/tags
- 官方文档：https://kestra.io/docs/getting-started/quickstart

去官方网站，查看最新的镜像版本。如：`v0.23.4`

```bash
# 拉取镜像
docker pull kestra/kestra:v0.23.4
```

官方启动方式：

```bash
docker run --pull=always --rm -it -p 8080:8080 --user=root \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/tmp kestra/kestra:latest server local
```

官方示例没有挂载数据卷，没有连接数据库。这边修改下使其更符合生产环境。


```bash
#!/bin/bash

# mkdir kestra && cd kestra

docker run -d --name kestra --restart unless-stopped \
  -p 8080:8080 \
  --user=root \
  -v $(pwd)/data:/app/data \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e kestra.configuration.storage.path=/app/data \
  -e kestra.configuration.datasource.url=jdbc:postgresql://172.16.160.9:5433/kestra \
  -e kestra.configuration.datasource.username=odoo \
  -e kestra.configuration.datasource.password=odoo \
  kestra/kestra:v0.23.4 \
  server local
```

## 流程配置


SSH登录服务器执行命令流程示例：

```yml
id: update_test_odoo
namespace: yourname.dev
tasks:
  - id: remote_opt
    type: io.kestra.plugin.fs.ssh.Command
    commands:
      - cd /home/yourname/erp.test/
      - ./update.sh
    host: 172.16.160.9
    username: yourname
    password: yourname123
```