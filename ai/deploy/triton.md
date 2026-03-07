## 简介

 Inference Server 是 NVIDIA 开源的高性能推理服务平台。它的核心设计目标是标准化、高性能地部署和生产化任何框架训练的 AI 模型。

核心特点：
1.  统一服务化：将 TensorFlow、PyTorch、ONNX、TensorRT 或像 vLLM 这样的自定义后端模型，统一封装成标准的 HTTP/gRPC API 服务。
2.  极致性能：内置并发模型执行、动态批处理、模型流水线，能最大化利用 GPU/CPU 资源，降低推理延迟。
3.  生产就绪：直接提供模型版本管理、健康检查、监控指标、并发模型加载等生产级功能。

- https://github.com/triton-inference-server/server
- https://developer.nvidia.com/dynamo-triton
- https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/index.html


## 环境准备与模型获取

下载推理框架：

```bash
# 1. 拉取 Triton CPU 官方镜像 (选择带Python后端的版本)
docker pull nvcr.io/nvidia/tritonserver:24.10-py3

# 也可以直接下载二进制文件，但要安装好依赖
# 从 GitHub Releases 下载对应版本（以 25.01 为例）
# wget https://github.com/triton-inference-server/server/releases/download/v25.01/tritonserver-25.01-linux-x86_64.tar.gz
# tar -xvf tritonserver-25.01-linux-x86_64.tar.gz
# cd tritonserver

# Ubuntu/Debian 系统，安装系统依赖
# sudo apt-get update
# sudo apt-get install -y libssl-dev libcurl4-openssl-dev libarchive-dev \
#                        libb64-dev libre2-dev libboost-all-dev \
#                        rapidjson-dev libopenblas-dev

# 准备 Python 环境（vLLM 依赖）
# 创建 Python 虚拟环境
# python3 -m venv /opt/triton/python_env
# source /opt/triton/python_env/bin/activate

# # 安装 vLLM 和 Triton Python 后端
# pip install vllm tritonclient[all]
```

下载模型

```bash
# 2. 创建模型仓库目录结构
mkdir -p /path/to/model_repository
cd /path/to/model_repository

# 3. 下载示例GGUF模型并创建模型目录
mkdir -p qwen_gguf/1
cd qwen_gguf/1
wget https://huggingface.co/unsloth/Qwen3.5-0.8B-GGUF/resolve/main/qwen3.5-0.8b.Q4_K_M.gguf -O model.gguf
```

## 核心配置文件：config.pbtxt

`config.pbtxt` 文件， 在 `/path/to/model_repository/qwen_gguf/` 目录 ，这是Triton模型部署的核心。

```protobuf
# 1. 模型名称：客户端调用时使用的标识符
name: "qwen_llamacpp"

# 2. 后端类型：必须指定为 "python"，以使用您编写的 model.py
backend: "python"

# 3. 最大批处理大小：设置为 0 表示禁用 Triton 的动态批处理。
# 原因：llama.cpp 在 model.py 内部已实现其自身的生成循环，由 Triton 在外部做动态批处理会复杂且低效。
max_batch_size: 0

# 4. 输入定义：必须与 model.py 中 `pb_utils.get_input_tensor_by_name` 使用的名称一致。
input [
  {
    name: "prompt"        # 输入张量名称
    data_type: TYPE_STRING # 数据类型为字符串
    dims: [ -1 ]          # 维度为 [-1] 表示可变长度的一维数组（即单个字符串）
  }
  # 您可以在此添加其他输入，例如生成参数（temperature, max_tokens）
  # {
  #   name: "max_tokens"
  #   data_type: TYPE_INT32
  #   dims: [1]
  # }
]

# 5. 输出定义：必须与 model.py 中构造的返回张量名称一致。
output [
  {
    name: "generated_text" # 输出张量名称
    data_type: TYPE_STRING
    dims: [ -1 ]
  }
]

# 6. 实例组配置：**CPU模型部署的核心配置**
instance_group [
  {
    count: 1               # 实例数量。对于CPU模型，可增加以利用多核，但会倍增内存占用。
    kind: KIND_CPU         # 指定在 CPU 上执行。这是必须的。
  }
]

# 7. 模型版本策略：默认为加载所有版本，保持即可。
version_policy: { all { } }

# 8. 优化配置（可选但重要）
optimization {
  # CPU 线程池配置，可影响内部并行度
  cpu_execution_accelerators [
    { name: "auto" }
  ]
}

# 9. 后端参数：**Python后端特有的关键配置**
parameters [
  {
    key: "EXECUTION_ENV"
    # 用于设置 Python 后端的运行时环境变量。
    # 例如，可指定共享库路径，确保能找到 llama-cpp-python 的底层 C 库。
    value: {string_value: "{\"LD_LIBRARY_PATH\": \"/usr/local/custom_lib:/opt/llama_cpp_libs\"}"}
  }
]
```

## Python后端模型脚本：model.py

```python
import triton_python_backend_utils as pb_utils
import numpy as np
from llama_cpp import Llama  # 使用llama-cpp-python库

class TritonPythonModel:
    def initialize(self, args):
        """模型初始化，加载GGUF文件"""
        model_path = os.path.join(args['model_repository'], args['model_version'], 'model.gguf')
        # 关键参数：n_ctx为上下文长度，n_threads为推理线程数，n_gpu_layers=0表示纯CPU
        self.llm = Llama(
            model_path=model_path,
            n_ctx=4096,
            n_threads=4,  # 根据CPU核心数调整
            n_gpu_layers=0,  # 纯CPU推理
            verbose=False
        )
        print(f"Model loaded from {model_path}")

    def execute(self, requests):
        """处理推理请求"""
        responses = []
        for request in requests:
            # 1. 获取输入
            prompt = pb_utils.get_input_tensor_by_name(request, "prompt").as_numpy()[0].decode('utf-8')
            
            # 2. 调用模型生成（关键：流式生成或单次生成）
            output = self.llm(
                prompt,
                max_tokens=256,
                temperature=0.7,
                stop=["</s>", "###"],
                echo=False
            )
            generated_text = output['choices'][0]['text']
            
            # 3. 构造返回张量
            output_tensor = pb_utils.Tensor(
                "generated_text",
                np.array([generated_text.encode('utf-8')], dtype=object)
            )
            responses.append(pb_utils.InferenceResponse(output_tensors=[output_tensor]))
        return responses

    def finalize(self):
        """清理资源"""
        if hasattr(self, 'llm'):
            del self.llm
```

也可以创建 `model.json` 文件，定义内置的 `vLLM` 引擎的具体参数(Triton 24.03+)。但对 `gguf` 格式的CPU模型，不推荐使用。

```json
{
  "model": "/opt/triton/models/qwen35_08b_gguf/1/Qwen3.5-0.8B-Q4_K_M.gguf",
  "tokenizer": "Qwen/Qwen3.5-0.8B",  // 或使用本地分词器目录
  "disable_log_requests": true,
  "trust_remote_code": true,
  "max_model_len": 8192,
  "gpu_memory_utilization": 0.9,  // 如果使用 GPU 则保留，纯 CPU 可移除或忽略
  "enforce_eager": true,
  "dtype": "float16"  // GGUF 已量化，此处指定加载的数据类型
}
```

## 创建Python环境包

```bash
# 在宿主机上创建Python虚拟环境并打包
cd /path/to/model_repository/qwen_gguf/1
python3 -m venv qwen_env
source qwen_env/bin/activate
pip install llama-cpp-python  # 核心依赖
pip install numpy tritonclient[all]  # Triton Python后端工具

# 打包环境（Triton Python后端要求）
tar -czf qwen_env.tar.gz qwen_env/
# 将此包复制到容器内指定路径，或通过卷挂载
```

## 启动Triton服务（生产级参数）

```bash
# 使用Docker启动，关键参数已标注
docker run -d --name triton_server \
  --shm-size=2g `# 共享内存，用于进程间通信，根据批处理大小调整` \
  --memory="8g" `# 限制容器内存` \
  --cpus="4.0" `# 限制CPU资源` \
  -p 8000:8000 `# HTTP端口` \
  -p 8001:8001 `# gRPC端口（性能更优）` \
  -p 8002:8002 `# 监控指标端口` \
  -v /path/to/model_repository:/models `# 挂载模型仓库` \
  -v /path/to/model_repository/qwen_gguf/1/qwen_env.tar.gz:/opt/tritonserver/backends/python/qwen_env.tar.gz `# 挂载Python环境` \
  nvcr.io/nvidia/tritonserver:24.10-py3 \
  tritonserver \
  --model-repository=/models \
  --model-control-mode=poll `# 轮询模式，支持模型热更新` \
  --http-thread-count=8 `# HTTP处理线程数，建议为CPU核心数1-2倍` \
  --allow-metrics=true `# 启用监控指标` \
  --metrics-port=8002 \
  --log-info=true \
  --log-verbose=0 `# 生产环境可关闭详细日志`


# # 二进制启动命令：
# ./bin/tritonserver \
#   --model-repository=/opt/triton/models \
#   --strict-model-config=false \
#   --log-verbose=1 \
#   --model-control-mode=explicit \
#   --load-model=qwen35_08b_gguf \
#   --backend-config=vllm,env="PYTHONPATH=/opt/triton/python_env/lib/python3.10/site-packages"  
```


## 服务验证与监控

```bash
# 1. 检查服务状态
curl -v localhost:8000/v2/health/ready

# 2. 查看已加载模型
curl localhost:8000/v2/models

# 3. 使用HTTP API进行推理
curl -X POST http://localhost:8000/v2/models/qwen_gguf/infer \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": [
      {
        "name": "prompt",
        "shape": [1],
        "datatype": "BYTES",
        "data": ["请用中文介绍人工智能"]
      }
    ],
    "outputs": [{"name": "generated_text"}]
  }'

# 4. 获取性能指标（用于Prometheus）
curl localhost:8002/metrics
```