## 查看设备标识

```
# 查看已挂载的磁盘和分区
df -h

# 查看包含未载的磁盘在内的所有磁盘
fdisk -l
```

`fdisk -l` 显示的未挂载的设备标识可能为： `/dev/sda`, `dev/sdb`, `/dev/vdb`

假设未挂载的设备为：`/dev/vdb`


## 创建新分区

### 方式一（fdisk）：

```
# 依次输入： n回车 p回车 1回车 回车 wq回车
# 假设该设备分区后，分区名为/dev/vdb1
fdisk /dev/sdb
```

### 方式二（parted）：

- `-s`： --script不提示用户，非交互模式
- `mklabel`： 创建新的label-type类型的空磁盘分区表msdos或gpt

```
# 设置分区格式为GPT
parted -s /dev/vdb mklabel gpt

# 创建新分区
parted -s /dev/vdb c mkpart primary 0% 100%
```

## 格式化新分区

```
# 格式化新分区为ext4
mkfs.ext4 /dev/vdb1
```


## 挂载新分区

```
# 创建新目录
mkdir /mnt/mount1

# 手动挂载到新目录
# mount /dev/vdb1 /mnt/mount1

# 写入开机自动挂载
echo "/dev/vdb1  /mnt/mount1  ext4  defaults,noatime  0  0" >> /etc/fstab
# 使开机自动挂载的修改立即生效
mount -a
```

## 其他

- 查看磁盘分区的 `UUID`: 即 `/etc/fstab` 里面那个 `UUID`，不小心误删fstab文件可以此恢复。

```
# 下面两个命令都可以查看
ls -l /dev/disk/by-uuid/
blkid /dev/vdb1
```