## 介绍

llama.cpp 是一个轻量级、高性能的 LLM（大语言模型）推理框架，同时也提供了基础的部署能力。它的核心设计目标是在资源受限的设备（尤其是CPU）上，以最少的依赖和最高的效率运行大模型推理。

https://github.com/ggml-org/llama.cpp

核心定位与特点

1. 推理引擎：其核心是纯 C/C++ 实现的模型加载、前向计算（推理）引擎，不依赖 PyTorch、TensorFlow 等重型框架。

2. 部署友好：通过提供命令行工具、C API 和兼容 OpenAI 的 HTTP 服务器，它也能作为本地模型服务的部署基础。

3. 极致优化：针对 CPU（ARM NEON、x86 AVX）和 GPU（CUDA、Metal、Vulkan）进行底层指令集优化。

4. 格式统一：使用自研的 GGUF 模型格式，单个文件包含模型、分词器、模板等所有运行所需信息，便于分发和加载。

5. 跨平台：支持 Windows、Linux、macOS 等主流操作系统，并可编译运行于树莓派等嵌入式设备。

## 基础使用

```bash
# 单次提示文本补全
./llama-cli -m /path/to/model.gguf -p "你的提示词"
# 交互式对话模式（如果模型支持）
./llama-cli -m /path/to/model.gguf

# 启动一个兼容 OpenAI API 格式的 HTTP 服务
# 可通过 http://localhost:8080/v1/chat/completions等端点进行交互。
./llama-server -m /path/to/model.gguf --port 8080 --api-key your-api-key

# --reasoning-budget -1 默认为无限制思考过程。--reasoning-budget 0 禁用思考过程。
./llama-server -m Qwen3.5-0.8B-Q5_K_M.gguf --port 8080 --host 0.0.0.0 --api-key your-api-key --reasoning-budget 0
```

## 集成systemd系统服务

| 参数 | 含义与作用 | 当前设置值 |
| :--- | :--- | :--- |
| `-m` | 指定要加载的模型文件路径。纯CPU推理推荐使用量化版本，如：Q5_K_M | `/home/yourname/aimodels/Qwen3.5-0.8B-Q5_K_M.gguf` |
| `--host` | 设置服务器监听的网络地址。`0.0.0.0`表示允许所有网络访问。 | `0.0.0.0` |
| `--port` | 设置服务器监听的端口号。 | `8086` |
| `--reasoning-budget` | 设置推测解码的预算令牌数，用于加速推理。`0`表示禁用此功能。 | `0` |
| `-np` | 设置并行批处理大小，可提升多请求下的GPU利用率。 | `4` |
| `-c` | 设置模型的上下文长度（可处理的令牌总数）。 | `4096` |
| `--cache-ram` | 设置用于KV缓存的系统内存大小（单位：MB）。 | `8192` |
| `-t` | 设置用于模型计算的总线程数。 | `6` |
| `--threads-http` | 设置专门处理HTTP请求的线程数。 | `4` |
| `--timeout` | 设置单个请求的处理超时时间（单位：秒）。 | `300` |
| `--api-key` | 设置用于接口认证的API密钥。 | `your-api-key` |

```conf
[Unit]
Description=qwen Service
After=network.target
Wants=network.target

[Service]
Type=simple
User=yourname
WorkingDirectory=/home/yourname/apps/llama-b8244
ExecStart=/home/yourname/apps/llama-b8244/llama-server -m /home/yourname/aimodels/Qwen3.5-0.8B-Q5_K_M.gguf \
--host 0.0.0.0 --port 8086 --reasoning-budget 0 \
-np 4 \
-c 4096 \
--cache-ram 8192 \
-t 6 \
--threads-http 4 \
--timeout 300 \
--api-key your-api-key
Restart=on-failure
RestartSec=30
StandardOutput=file:/home/yourname/aimodels/run.qwen.log
StandardError=file:/home/yourname/aimodels/run.qwen.error.log

[Install]
WantedBy=multi-user.target
```

## 编程集成

```python
from llama_cpp import Llama

# 1. 初始化模型
llm = Llama(
    model_path="./models/llama-3-8b-instruct-q4_0.gguf",
    n_ctx=2048,          # 上下文长度
    n_threads=8,         # CPU线程
    n_gpu_layers=35,     # 卸载到GPU的层数（如有GPU）
    verbose=False
)

# 2. 文本补全
output = llm(
    "Q: Explain quantum computing briefly.\nA:",
    max_tokens=128,
    temperature=0.7,
    stop=["Q:", "\n"]
)
print(output['choices'][0]['text'])

# 3. 聊天对话（使用模型内置模板）
response = llm.create_chat_completion(
    messages=[{"role": "user", "content": "你好，介绍一下你自己。"}],
    temperature=0.7,
    max_tokens=256
)
print(response['choices'][0]['message']['content'])
```

Go语言：

```bash
# 初始化Go模块并添加依赖
go mod init your-project
go get github.com/go-skynet/go-llama.cpp
```

```go
package main

import (
    "fmt"
    llama "github.com/go-skynet/go-llama.cpp"
)

func main() {
    // 1. 加载模型
    model, err := llama.LoadModel("models/gemma-2b.gguf", llama.Params{
        ContextSize: 2048,
        Threads:     4,
        // GPU加速：根据需要设置
        // GPU: true,
        // GPULayers: 35,
    })
    if err != nil {
        panic(err)
    }
    defer model.Close()

    // 2. 执行推理
    prompt := "Translate 'Hello, world!' to French."
    result, err := model.Predict(prompt, llama.PredictOptions{
        Tokens: 100,
        Temperature: 0.7,
        TopP: 0.95,
    })
    if err != nil {
        panic(err)
    }
    fmt.Println(result)
}
```
