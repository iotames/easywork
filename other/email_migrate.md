## 背景

公司要从腾讯企业邮迁移到微软邮箱。

你帮我规划一下迁移方。包括腾讯企业邮和微软邮箱要做什么配置，迁移的时候，依赖的命令行的安装和使用。

## 微软官方迁移方案

### 迁移准备

使用超级管理员运行 PowerShell 命令窗口

```powershell
# 安装 ExchangeOnlineManagement 模块
Install-Module -Name ExchangeOnlineManagement -Force -AllowClobber

# 修改执行策略为 RemoteSigned 
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# 手动导入模块
Import-Module ExchangeOnlineManagement -Force

# 当 Connect-ExchangeOnline 命令执行后
# PowerShell 会弹出一个登录窗口。请使用你拥有 Exchange 管理员权限的 Microsoft 365 账号进行登录。
Connect-ExchangeOnline

# 登录成功后。提示：
# 是否登录到此设备上的所有应用和网站
# 点击 先点击否。如果后续出问题，那就点击是 。
# 我们正在向你的公司注册此设备。请稍等。。。。账号已添加到此设备。

# 验证是否登录成功。
# 显示3个邮箱列表
Get-Mailbox -ResultSize 3
```

### 准备迁移用的CSV文件

创建准备迁移用的CSV文件，格式为：
EmailAddress（目标邮箱地址）,UserName（源邮箱登录名）,Password（源邮箱密码）

如下所示：
```csv
EmailAddress,UserName,Password
target@xxx.onmicrosoft.com,yourname@tencent.com,xxxxxx
```


### 执行迁移命令

```powershell
# 创建迁移终结点
New-MigrationEndpoint -IMAP -Name "TencentIMAPEndpoint" -RemoteServer "imap.exmail.qq.com" -Port 993 -Security Ssl

# 读取csv文件内容。注意：修改csv内容后，要重新执行读取命令。
$csvData = [System.IO.File]::ReadAllBytes("C:\path\to\your\migration.csv")

# 创建迁移任务
New-MigrationBatch -Name "TencentToM365" -SourceEndpoint "TencentIMAPEndpoint" -CSVData $csvData -AutoStart



# 已完成的批处理迁移任务，可以删除。
Remove-MigrationBatch -Identity "TencentToM365" -Confirm:$false
```

其他操作

```powershell
# 查看所有迁移任务
Get-MigrationBatch

# 删除所有与 TencentToM365 相关的批处理
Get-MigrationBatch | Where-Object {$_.Identity -like "TencentToM365*"} | Remove-MigrationBatch -Confirm:$false

# 查看任务状态
Get-MigrationUser -BatchId "TencentToM365"
```

--------------------------------

## 方法二：第三方迁移工具

```bash
imapsync --host1 imap.exmail.qq.com --user1 your_tencent@company.com --password1 '你的腾讯邮箱密码' \
         --host2 outlook.office365.com --user2 your_microsoft@company.com --password2 '你的微软邮箱密码' \
         --ssl1 --ssl2
```