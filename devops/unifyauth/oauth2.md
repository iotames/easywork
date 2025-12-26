| 步骤 | 说明  | 请求方法 | 路由 |路由参数|备注|
| ----- | --------- | ----------- | ------- | ------- | ------- |
| 1 | 跳转到Oauth2服务端的指定地址，为了获取code参数 | GET |  /redirect  |?url=http://xxxxx |通过此链接跳转到其他网站|
| 2  | 获取Oauth2服务端传回的code参数  | GET  |  /oauth2/client/callback  | ?code=xxx|后端获取GET参数code的值|
| 3 | POST获取access_token | GET | /oauth2/client/callback | | 紧接着第2步骤后继续操作。后台使用POST方式获取access_token|
| 4 | 请求用户信息 | GET | /oauth2/client/callback | | 紧接着第3步骤后继续操作|
| 5 | 用户登录 | GET | /oauth2/client/callback | | 紧接着第4步骤后继续操作|

1. 统一认证中心-认证协议管理：http://192.168.0.100:20600/info/authserver/config
2. 统一认证中心-认证应用管理：http://192.168.0.100:20600/info/authserver/base



## 1. 跳转到Oauth2服务端

`目的`：通过本链接，跳转到其他网站地址。

客户端访问的地址示例：

```
# GET请求。为了获取url参数。然后跳转到Oauth2服务端
http://erp.yoursite.com/redirect?url=http%3A%2F%2F192.168.0.100%3A20600%2Fpapi%2Fsso%2Foauth2.0%2Fauthorize%3Fclient_id%3Dc7ebac2e-dbd1-4496-8159-c0b426ce9e3b%26redirect_uri%3Dhttp%3A%2F%2Ferp.yoursite.com%2Foauth2%2Fclient%2Fcallback%26response_type%3Dcode
```

`完成效果`：跳转到Oauth2服务端的地址。
```
http://192.168.0.100:20600/papi/sso/oauth2.0/authorize?client_id=c7ebac2e-dbd1-4496-8159-c0b426ce9e3b&redirect_uri=http://erp.yoursite.com/oauth2/client/callback&response_type=code
```

- 请求用户授权接口地址(GET请求)：`http://192.168.0.100:20600/papi/sso/oauth2.0/authorize`

GET参数如下所示：

1. client_id: Oauth2服务端上的应用标识。值为：`c7ebac2e-dbd1-4496-8159-c0b426ce9e3b`。如有变更，登录后台查看：http://192.168.0.100:20600/info/ig_common/base?id=1162469058209398785
2. redirect_uri: 填写下一个步骤，为了获取code参数。值为：`http://erp.yoursite.com/oauth2/client/callback`
3. response_type: 只能填写 `code`


## 2. 获取code参数

`目的`: 接收从其他网站跳转过来时携带的GET参数code

```
# GET请求
http://erp.yoursite.com/oauth2/client/callback?code=ST-2-3waB7JCdPdAweaCW1ciBxwm5WJ8beta11
```

`完成效果`：在后台获取code参数的值，待下一个步骤使用。


## 3. 在后端获取access_token和Oauth2的用户信息

### 3.1 获取access_token令牌

- 获取access_token的接口地址（POST请求） 

- 给Oauth2服务端发送POST请求。地址：`http://192.168.0.100:20600/papi/sso/oauth2.0/accessToken`。参数如下：

1. grant_type: 只能填写 `authorization_code`
2. client_id: Oauth2服务端上的应用标识。值为：`c7ebac2e-dbd1-4496-8159-c0b426ce9e3b`。如有变更，登录后台查看：http://192.168.0.100:20600/info/ig_common/base?id=1162469058209398785
3. client_secret：`wQfGGTtSZYYl9rzEpN2cCzyg`
4. code: 上一个步骤获取的code值
5. redirect_uri: 值为：`http://erp.yoursite.com/oauth2/client/callback`

返回示例：
```json
{
    "msg":"SUCCESS",
    "access_token":"TGT-17-ltrkyX7uoV1UyJvtZVQ3OsLwMKLuiiBghgEi8d5jeQejC0Xl---taqwusjwbChnVGvgETW029070",
    "code":"0",
    "expire":7200,
    "status":200
}
```


### 3.2 获取Oauth2用户信息


- 获取用户信息接口地址（GET/POST） http://192.168.0.100:20600/papi/sso/oauth2.0/profile

```
# GET请求
http://weapp.yunteams.cn/papi/sso/oauth2.0/profile?access_token=TGT-17-ltrkyX7uoV1UyJvtZVQ3OsLwMKLuiiBghgEi8d5jeQejC0Xl---taqwusjwbChnVGvgETW029070
```

返回信息
```json
{
	"msg": "SUCCESS",
	"code": "0",
	"attributes": {
"job_num": "WS001",
		"mobile": "13511112223",
		"username": "田小濛人员001"
	},
	"id": "txmry001",
	"status": 200
}        
```

## 4. 在后端获取本地的用户信息并进行登录操作

略


## 5. 功能适配增强

支持对接多个Oauth2.0服务端。

新增Oauth2.0服务端列表管理。每个Oauth服务端的配置字段如下所示：

2.1 code：服务端代码。必填。例：weaver-test

2.2 apptype：对接的Oauth2.0服务商类型。必填。例：weaveroa

2.3 title：标题备注。非必填。例：泛微OA测试环境

2.4 redirecturl: 跳转URL。选填。如果有填值，就把这个值拿去跳转。如未填写，则按apptype的规则（if $apptype == "weaveroa"），由系统拼接参数去跳转。

2.5 clientcode: Oauth2的客户端标识。例：64xxxxxx-ad46-419f-88cc-9cc2d8xxxxxx

2.6 clientsecret： Oauth2客户端密钥，可以向Oauth2的服务端获取token。例：WwdqxxxxxxxxxVgGYcmXxxxx

2.7 callbackurl: 跳转回Oauth2客户端的url。用来接收从Oauth2服务端跳转回来传递的code参数。选填。不填默认为：http://erp.yoursite.com/oauth2/client/callback

2.8 tokenurl: 从Oauth2服务端获取token的URL。例：http://192.168.0.100:20600/papi/sso/oauth2.0/accessToken

2.9 userinfourl: 从Oauth2服务端获取用户信息的URL。例：http://192.168.0.100:20600/papi/sso/oauth2.0/profile

2.9 response_type：选填。默认值为：code


最终效果访问链接：

http://192.168.0.100:20600/papi/sso/oauth2.0/authorize?client_id=c7ebac2e-dbd1-4496-8159-c0b426ce9e3b&redirect_uri=http://erp.yoursite.com/oauth2/client/callback&response_type=code