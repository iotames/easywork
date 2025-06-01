## 启动n8n

1. 源码启动
```bash
# 如果网速慢，可使用国内gitee镜像。git clone git@github.com:n8n-io/n8n.git
git@gitee.com:mirrors/n8n.git
cd n8n
# 安装n8n要使用管理员权限运行。npx n8n
npx --registry=https://registry.npmmirror.com n8n
```

2. Docker 启动 
```bash
docker volume create n8n_data
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
```


## 数据存储位置

默认情况下，Docker 卷存储在 Docker 管理的宿主机目录中，而不是由用户直接指定。

- Linux: `/var/lib/docker/volumes/`
- Windows: `C:\ProgramData\Docker\volumes\`

```
# 查看所有卷
docker volume ls

# 查看某个卷的详细信息
docker volume inspect <volume_name>
```
