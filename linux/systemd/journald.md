## Systemd Journal 系统日志

日志配置：

`vim /etc/systemd/journald.conf`

```conf
[Journal]
SystemMaxUse=1G
```

重启系统日志服务，使得配置立即生效：

```bash
systemctl restart systemd-journald
```

## 常见命令

```
# 查看服务的日志
journalctl -u cdnguard.service

# 查看日志已占用的空间
journalctl --disk-usage

# 设置日志最大占用空间: 500M, 2G
journalctl --vacuum-size=500M

# 设置日志最大保存时间: 10d, 1years
journalctl --vacuum-time=30d
```