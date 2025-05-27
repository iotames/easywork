## 启动Redis

### Windows

- https://github.com/redis-windows/redis-windows/releases
- https://github.com/redis-windows/redis-windows/releases/download/8.0.1/Redis-8.0.1-Windows-x64-cygwin-with-Service.zip

解压到后，双击 `start.bat` 文件运行。或者在cmd控制台，手动执行命令：`redis-server.exe redis.windows.conf`


### Linux

- 官方下载：https://redis.io/downloads/
- 从源码安装：https://redis.io/docs/latest/operate/oss_and_stack/install/build-stack/
- 从Docker启动：https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/docker/

```
# 从Docker启动redis
docker run -d --name redis -p 6379:6379 redis:<version>

# 从容器进入redies客户端调试
docker exec -it redis redis-cli

# 从本地的redis-cli连接到redis服务
# redis-cli -h <host> -p <port> -a <password>
redis-cli -h 127.0.0.1 -p 6379
```

----------------------

https://www.runoob.com/redis/redis-install.html