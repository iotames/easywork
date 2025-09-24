## HTTP请求头IP和TCP源IP

打破砂锅问到底：

```
下面两个HTTP请求头的含义是什么？有何区别？
"X-Forwarded-For": ["119.91.107.106, 153.99.246.174"]
"X-Real-Ip": ["153.99.246.174"]
```

```
按照HTTP协议，请求头都是可伪造的。如果我想获取HTTP请求的真实IP(因为X-Real-Ip请求头还是有伪造的可能)。要怎么做？
也就是说，如果网络请求，经过中间层层转发，我只能获取最后一层的服务器IP做为真实IP。如果没经过转发，那就是最初发起请求的客户端IP了。能理解吗？
```

```
如果使用Go语言的net/http标准库构建了Web服务器，如何获取“最后一层真实IP”？
如果使用Go语言的net/http标准库构建了Web服务器，但是接收到的网络请求，是先经过本机的另一个NGINX服务做了反向代理，然后再转发到这台Go语言的Web服务器。那么获取到的IP是哪个？
```

```
如果HTTP请求头存在X-Real-Ip，且与真实的TCP源IP不一致，是否可以判定是网络攻击？
```

## 笔记

NGINX配置：

```nginx
# $remote_addr就是客户端真实IP
log_format main '$remote_addr [$time_local] "$request"';

location / {
    proxy_pass http://127.0.0.1:8080;
    # 将客户端真实IP（Nginx看到的远程IP）写入X-Real-IP头。
    # 因为存在NGINX反向代理，使得http://127.0.0.1:8080应用服务端，获取的TCP源IP是NGINX的IP，也就是127.0.0.1。
    proxy_set_header X-Real-IP $remote_addr;
    # 记录完整的转发链（客户端IP, 中间代理IP）
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

Go语言代码：

```golang
package main

import (
	"net"
	"net/http"
	"strings"
)

func main() {
	http.HandleFunc("/get-real-ip", func(w http.ResponseWriter, r *http.Request) {
		// 1. 获取 TCP 连接的源地址（格式：IP:端口）
		remoteAddr := r.RemoteAddr

		// 2. 分割 IP 和端口（处理可能的错误，如地址格式异常）
		ip, _, err := net.SplitHostPort(remoteAddr)
		if err != nil {
			// 极端情况：如果地址格式不符合 "IP:端口"（如 Unix 域套接字），直接使用原始地址作为 IP
			ip = remoteAddr
		}

		// 3. 返回结果。如果是NGINX转发过来的请求，那TCP连接的源IP只能是NGINX的IP
		w.Write([]byte("最后一层真实IP: " + ip))

        // 从Nginx转发的X-Real-IP头中获取客户端真实IP
        clientIP := r.Header.Get("X-Real-IP")
        if clientIP == "" {
            // 降级处理：如果没有X-Real-IP，使用最后一级IP（Nginx的IP）
            ip, _, _ := net.SplitHostPort(r.RemoteAddr)
            clientIP = ip
        }
        w.Write([]byte("客户端真实IP（来自Nginx转发）: " + clientIP))


	})

	// 启动服务器，监听 8080 端口
	http.ListenAndServe(":8080", nil)
}
```