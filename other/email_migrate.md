## 背景

公司要从腾讯企业邮迁移到微软邮箱。腾讯企业邮单邮箱空间没限制，微软邮箱标准版，单邮箱空间限制50G。

你帮我规划一下迁移方。包括腾讯企业邮和微软邮箱要做什么配置，迁移的时候，依赖的命令行的安装和使用。

## 微软官方迁移方案

使用超级管理员运行 PowerShell 命令窗口

### ExchangeOnline工具准备

```powershell
# 安装 ExchangeOnlineManagement 模块。
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

### 邮箱账号准备

1. 待迁移的邮箱：设置 - 客户端设置 - 收取选项： 如果是默认 收取 `最近30天` ，则改为： 收取 `全部` 的邮件。同时，推荐勾选 `收取“我的文件夹“`。
2. ExchangeOnline支持的CSV迁移文件：标题行字段为 `EmailAddress,UserName,Password`，代表 `迁移目标邮箱地址,源邮箱登录名,源邮箱密码`。示例：`target@xxx.onmicrosoft.com,yourname@tencent.com,xxxxxx`。

### 迁移命令

```powershell
# 1. 确保已创建迁移终结点（如果之前已创建可跳过）
New-MigrationEndpoint -IMAP -Name "TencentIMAPEndpoint" -RemoteServer "imap.exmail.qq.com" -Port 993 -Security Ssl

# 读取csv文件内容。注意：修改csv内容后，要重新执行读取命令。
# 建议先用少量用户测试，确认没问题后再放全部500人
$csvData = [System.IO.File]::ReadAllBytes("C:\path\to\your\migration.csv")

# 先创建用于分析的批处理
New-MigrationBatch -Analyze -SourceEndpoint "TencentIMAPEndpoint" -AutoStart -Name "TencentToM365_Analysis" -CsvData $csvData -AllowUnknownColumnsInCsv $true

# 查看用于分析的批处理的状态
Get-MigrationBatch -Identity "TencentToM365_Analysis"

# 查看每个用户的预估数据量（项目数和大小）.注意，这个命令有BUG：会把 BatchId 不等于 TencentToM365_Analysis 的 Identity 的信息也显示在结果中。故同样的Identity可能会多次重复展示。
# EstimatedTotalTransferSize 是格式化字符串（如 "28.45 GB (30,551,458,399 bytes)"），不能直接比大小，需要 .ToBytes() 转换。
Get-MigrationUser -BatchId "TencentToM365_Analysis" | Get-MigrationUserStatistics | Format-Table Identity, TotalItemsInSourceMailboxCount, EstimatedTotalTransferSize

# 创建迁移任务-设置迁移任务名称
$batchName = "TencentToM365_Full_" + (Get-Date -Format "yyyyMMdd_HHmm")
# 创建迁移任务-执行迁移
New-MigrationBatch -Name $batchName -SourceEndpoint "TencentIMAPEndpoint" -CSVData $csvData -AutoStart -AllowUnknownColumnsInCsv $true
# 查看任务状态
Get-MigrationUser -BatchId $batchName

# 如果批处理迁移任务，未运行或已完成，可以删除。
# 轮询 Get-MigrationBatch 等待 Status 变为 Completed（或 Failed 后处理完错误）再删除。
Remove-MigrationBatch -Identity $batchName -Confirm:$false

# 查看所有迁移任务
Get-MigrationBatch

# 删除所有与 TencentToM365 相关的批处理
Get-MigrationBatch | Where-Object {$_.Identity -like "TencentToM365*"} | Remove-MigrationBatch -Confirm:$false
```

获取帮助：

```powershell
# 1. 查看基本帮助
Get-Help New-MigrationBatch
# 2. 查看详细帮助（含参数说明和示例）
Get-Help New-MigrationBatch -Detailed
# 查看完整帮助（含所有技术细节）
Get-Help New-MigrationBatch -Full
```

### 痛点：不知道哪些邮箱超50G

```powershell
# 待验证

# 获取所有用户的分析结果
$results = Get-MigrationUser -BatchId "TencentToM365_Analysis"

# 筛选出估算大小超过 45GB 的邮箱（留5GB余量）
# EstimatedTotalSize 是字节数，可直接数值比较
Get-MigrationUser -BatchId "TencentToM365_Analysis" |
    Where-Object { $_.EstimatedTotalSize -gt 45GB } |
    Format-Table Identity, EstimatedTotalCount, EstimatedTotalSize

```

- 分析批处理创建后，用 Get-MailboxAnalysisRequestStatistics -IncludeAnalysisResult -IncludeFolderDetails -ItemsStartTime "2025/08/01" 可按时间窗口查看每个文件夹的条目数和大小（月粒度）。
- 还能用 -IncludeMappingResult 生成 XML mapping，把旧邮件自动映射到归档邮箱，官方方案是 "Automated large mailbox migration from IMAP sources"。
- 两个前提需要写进文档：① IMAP 分析要求目标 EXO 邮箱已创建；② mapping 分发依赖主邮箱+云归档（Main/Auxiliary Archive），商业标准版默认没有云归档，需 E3/E5 或 Exchange Online Archiving 附加。所以标准版下


### Exchange管理中心

用管理员身份，登录微软官方的`Exchange管理中心` 查看迁移错误: https://admin.cloud.microsoft/exchange#/migrationbatch

--------------------------------

## 方法二：第三方迁移工具

```bash
imapsync --host1 imap.exmail.qq.com --user1 your_tencent@company.com --password1 '你的腾讯邮箱密码' \
         --host2 outlook.office365.com --user2 your_microsoft@company.com --password2 '你的微软邮箱密码' \
         --ssl1 --ssl2
```
