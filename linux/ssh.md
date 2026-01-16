## SSH私钥登录

### 配置SSH服务端

```bash
# 生成密钥对：私钥id_rsa和公钥id_rsa.pub
ssh-keygen -C forLiLei

# 安装公钥
cd ~/.ssh
cat id_rsa.pub >> authorized_keys

# 修改权限
chmod 600 ~/.ssh/authorized_keys

# 重启ssh服务
service sshd reload
```

### 配置SSH客户端

vim `~/.ssh/config`

```conf
TCPKeepAlive=yes
# Client每隔 60 秒发送一次请求给 Server，然后 Server响应，从而保持连接
ServerAliveInterval 60
# Client发出请求后，服务器端没有响应得次数达到3，就自动断开连接，正常情况下，Server 不会不响应
ServerAliveCountMax 3

#############本地电脑################

Host alpine
HostName 127.0.0.1
Port 2222
User root
; ProxyCommand connect -S 127.0.0.1:7890 %h %p
IdentityFile ~/.ssh/alpine.pri
```

- SSH登录的私钥权限不能过大(可授予400 or 600权限)：`chmod 600 ~/.ssh/alpine.pri`

### 服务端配置（可选）

修改SSH守护进程配置文件： `/etc/ssh/sshd_config`

```conf
# 禁用密码登录，慎重！
PasswordAuthentication no
RSAAuthentication        yes
PubkeyAuthentication     yes
PermitRootLogin          yes
ChallengeResponseAuthentication no
```
