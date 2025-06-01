Docker Compose的容器挂载和Docker Volumes

## 配置示例

```
version: '3.1'
services:
  web:
    image: odoo:17.0
    depends_on:
      - db
    ports:
      - "8069:8069"
    volumes:
      - odoo-web-data:/var/lib/odoo
    environment:
      - PASSWORD_FILE=/app/config/db_password
    secrets:
      - source: postgresql_password
        target: /app/config/db_password
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/postgresql_password
      - PGDATA=/var/lib/postgresql/data/pgdata
    volumes:
      - odoo-db-data:/var/lib/postgresql/data/pgdata
    secrets:
      - postgresql_password

volumes:
  odoo-web-data:
  odoo-db-data:

secrets:
  postgresql_password:
    file: odoo_pg_pass
```

上面配置中，定义了2个Docker卷（Docker Volumes）：

```
volumes:
  odoo-web-data:
  odoo-db-data:
```

Docker 卷的主要作用是：

- 持久化数据：将容器内的数据存储到宿主机或其他外部存储中，确保数据不会因容器的删除而丢失。
- 共享数据：多个容器可以共享同一个卷，方便数据交换。
- 性能优化：卷通常比绑定挂载（Bind Mounts）性能更好，适合存储大量数据。


## 卷的命名和匿名卷

- 命名卷：如 odoo-web-data 和 odoo-db-data，是显式命名的卷，便于管理和重用。
- 匿名卷：如果只指定容器内的路径（如 - /var/lib/odoo），Docker 会创建一个匿名卷。匿名卷的名称由 Docker 自动生成，不易管理。


## 存储位置

默认情况下，Docker 卷存储在 Docker 管理的宿主机目录中，而不是由用户直接指定。

- Linux: `/var/lib/docker/volumes/`
- Windows: `C:\ProgramData\Docker\volumes\`

例: `/var/lib/docker/volumes/odoo-web-data/_data/`，其中 `_data` 是卷的实际数据存储目录

### 查看 Docker 卷的宿主机路径

```
# 查看所有卷
docker volume ls

# 查看某个卷的详细信息
docker volume inspect <volume_name>
```

### 自定义 Docker 卷的宿主机目录

1. 使用绑定挂载（Bind Mount）: 绑定挂载直接将宿主机的某个目录挂载到容器中，而不是使用 Docker 管理的卷。
2. 使用本地卷驱动（Local Volume Driver）: 通过 driver_opts 指定卷的宿主机目录

```
volumes:
  odoo-web-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /host/path/to/odoo-web-data
```


## 备份和恢复

可以使用 docker run 命令备份卷数据：

```
docker run --rm -v odoo-db-data:/source -v $(pwd):/backup busybox tar cvf /backup/odoo-db-data.tar /source
```

## 卷的生命周期

- 创建卷：当运行 docker-compose up 时，如果卷不存在，Docker 会自动创建它。
- 删除卷：默认情况下，运行 docker-compose down 不会删除卷。如果需要删除卷，可以使用 docker-compose down -v。
- 查看卷：可以使用 `docker volume ls` 查看所有卷，或 `docker volume inspect <volume_name>` 查看卷的详细信息。


## 卷的驱动选项

```
volumes:
  odoo-web-data:
    driver: local
    driver_opts:
      type: nfs
      o: addr=192.168.1.100,rw
      device: ":/path/to/nfs/share"
```

这会将 odoo-web-data 卷配置为使用 NFS 驱动。

