## 配置

官方文档：

- 命令配置：https://docs.openclaw.ai/cli/configure
- 文件配置：https://docs.openclaw.ai/gateway/configuration-reference
- 配置示例：https://docs.openclaw.ai/gateway/configuration-examples

网关常见配置(参考：https://docs.openclaw.ai/gateway/configuration-reference#gateway-field-details)：

- `gateway.mode`: 定义 Gateway 与客户端的连接关系。`local` 表示 Gateway 运行在本地，`remote` 表示 Gateway 运行在远程服务器上。外网访问不需要配置此项。
- `gateway.bind`: 网络绑定模式。默认 `loopback` 仅限本机访问。外部访问，可改为 `lan` or `tailnet` or `0.0.0.0`，分别表示 `局域网`，`Tailscale 网络`，`任何网络`。
- `gateway.controlUi.allowedOrigins`: 同源策略白名单。列出允许访问的客户端列表。若缺失，将报错 origin not allowed。示例值：`["http://192.168.1.100:18789"]` 或 `["*"]`
- `gateway.controlUi.allowInsecureAuth`: 允许非安全环境（非 HTTPS 或非 localhost 的环境）下进行身份认证。默认 `false`。
- `gateway.controlUi.dangerouslyDisableDeviceAuth`: 完全禁用设备身份验证（风险较高）。默认 `false`。


### 外部网络访问

方法有二：

1. 使用 Tailscale Serve​ 或 SSH 隧道​ 进行安全代理（略）。
2. 配置网络绑定和安全策略。

第一种方式要在安装Tailscale客户端，暂不介绍。主要讲第二个方案。

修改 `gateway.bind` , `gateway.controlUi.allowedOrigins`, `gateway.controlUi.allowInsecureAuth` 配置项。

```json
{
  "gateway": {
    "bind": "lan",
    "controlUi": {
      "allowedOrigins": ["*"],
      "allowInsecureAuth": true,
      "dangerouslyDisableDeviceAuth": true
    },
    "auth": {
      "mode": "token",
      "token": "your-secure-token"
    }    
  }
}
```
