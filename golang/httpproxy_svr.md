## Http代理服务器第三方代码库

- https://github.com/valyala/fasthttp：`Start 22.9K` 运行效率高。
- https://github.com/elazarl/goproxy：`Start 6.5k` 功能强大，支持MITM

## 使用Go语言搭建HTTP代理服务器

代理服务器的工作方式如下：

1. 客户端向代理服务器发送请求，表明自己需要请求的网站内容
2. 代理服务器接收到来自客户端的请求之后，通过解析，获取到需要访问的web服务
3. 代理服务器将客户端的请求信息全部转发给web服务器
4. web服务器返回响应消息给代理服务器
5. 代理服务器将返回的消息转发给对应的客户端

简易实现的代理服务器不支持HTTPS，要支持，请移步前面的 `第三方代码库`。

```go
package main

import (
    "bufio"
    "bytes"
    "fmt"
    "io"
    "net"
    "strings"
    "time"
)

const MAX_BUFF_SIZE = 255

func main() {
    // 端口号可以自己指定
    l, err := net.Listen("tcp", "127.0.0.1:8080")
    if err != nil {
        panic(err)
    }
    for {
        // 接收客户端的请求
        conn, err := l.Accept()
        if err != nil {
            continue
        }
        // 一旦建立连接，那么进行处理
        go handleConn(conn)
    }
}

func handleConn(conn net.Conn) {
    var request = make([]byte, MAX_BUFF_SIZE)

    // 从conn中读取请求数据
    n, err := conn.Read(request)
    if err != nil {
        fmt.Println("read request error: ", err)
        return
    }

    reader := bytes.NewReader(request[:n])
    r := bufio.NewReader(reader)

    // 读取第一行请求数据，中间包含需要访问的服务器内容
    s, err := r.ReadString('\n')
    if err != nil {
        fmt.Println("read string error: ", err)
        return
    }

    uri := strings.Split(s, " ")[1]

    // 找到 hostname, 比如  httpbin.org 而不是 http://httpbin.org/
    if strings.Contains(uri, "http://") {
        uri = uri[7:]
    }

    // 获取到服务端的主机
    pos := strings.Index(uri, "/")
    var hostname = uri
    if pos > -1 {
        hostname = uri[:pos]
    }
    // fmt.Println("hostname: ", hostname)

    // 获取到主机，以及端口号
    colon := strings.Index(hostname, ":")
    var host, port string
    if colon > -1 {
        host = hostname[:colon]
        port = hostname[colon+1:]
    } else {
        // 如果没有指定端口号，默认使用80端口
        host = hostname
        port = "80"
    }
    fmt.Printf("host: %s, port: %s\n", host, port)

    // 建立到想要请求的服务端的连接
    c, err := net.DialTimeout("tcp", net.JoinHostPort(host, port), 30*time.Second)
    if err != nil {
        fmt.Println(err)
        return
    }

    // 将需要请求的数据转发一份
    _, err = c.Write(request)
    if err != nil {
        fmt.Println("write request error: ", err)
        return
    }

    // 将从服务端读取到的内容全部转发给客户端
    var buff [512]byte
    for {
        n, err := c.Read(buff[:])
        if err != nil {
            if err == io.EOF {
                break
            }
            return
        }
        _, err = conn.Write(buff[:n])
        if err != nil {
            fmt.Println("write to client error: ", err)
            return
        }
    }

}
```

