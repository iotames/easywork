## 简介

vLLM是一个高性能的大语言模型推理和服务框架。它通过PagedAttention技术和连续批处理等创新，显著提升了推理吞吐量和内存效率。由伯克利 LMSYS 团队打造，社区维护。

- GitHub仓库：https://github.com/vllm-project/vllm
- 官方文档：https://docs.vllm.ai/
- https://github.com/NVIDIA/TensorRT-LLM
- Docker: https://hub.docker.com/r/vllm/vllm-openai/


## 环境要求

- **操作系统**：Linux（推荐Ubuntu 20.04+），Windows可通过WSL2运行
- **Python**：3.9-3.12（推荐3.10）
- **CUDA**：11.8+（推荐12.1+）
- **GPU**：NVIDIA GPU，显存≥16GB（如RTX 4090、A100）
- **内存**：≥16GB系统内存


## 模型下载方法

从Hugging Face下载模型（以Qwen2.5-7B-Instruct为例）：
```bash
# 安装huggingface-hub
pip install -U huggingface_hub

# 设置镜像加速（可选）
export HF_ENDPOINT=https://hf-mirror.com

# 下载模型到本地目录
huggingface-cli download Qwen/Qwen2.5-7B-Instruct --local-dir ./models/Qwen2.5-7B-Instruct
```


## 详细部署步骤

### 方式一：pip安装部署（推荐）

1. **创建虚拟环境**
```bash
conda create -n vllm python=3.10 -y
conda activate vllm
```

2. **安装vLLM**
```bash
pip install vllm
```

3. **启动推理服务**
```bash
# 基本启动
vllm serve Qwen/Qwen2.5-7B-Instruct --host 0.0.0.0 --port 8000

# 高级参数配置
vllm serve ./models/Qwen2.5-7B-Instruct \
  --tensor-parallel-size 1 \
  --max-model-len 4096 \
  --gpu-memory-utilization 0.9 \
  --served-model-name Qwen2.5-7B-Instruct
```

### 方式二：Docker部署

1. **拉取vLLM镜像**
```bash
# 根据CUDA版本选择镜像
docker pull vllm/vllm-openai:latest
```

2. **启动容器**
```bash
docker run --gpus all \
  -v ./models:/models \
  -p 8000:8000 \
  vllm/vllm-openai:latest \
  --model /models/Qwen2.5-7B-Instruct \
  --host 0.0.0.0 \
  --port 8000
```


## 服务验证

```bash
# 检查服务状态
curl http://localhost:8000/v1/models

# 测试推理接口
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen2.5-7B-Instruct",
    "messages": [
      {"role": "user", "content": "请介绍一下人工智能"}
    ],
    "max_tokens": 100
  }'
```


## Python API调用示例

```python
from vllm import LLM, SamplingParams

# 初始化模型
llm = LLM(model="Qwen/Qwen2.5-7B-Instruct")

# 设置采样参数
sampling_params = SamplingParams(
    temperature=0.7,
    top_p=0.95,
    max_tokens=100
)

# 批量推理
outputs = llm.generate(
    ["请解释机器学习", "写一首关于春天的诗"],
    sampling_params
)

for output in outputs:
    print(f"Prompt: {output.prompt}")
    print(f"Generated text: {output.outputs[0].text}")
```


## 关键参数说明

| 参数 | 说明 | 推荐值 |
|------|------|--------|
| `--tensor-parallel-size` | GPU并行数量 | 与GPU数量一致 |
| `--max-model-len` | 最大上下文长度 | 不超过模型训练长度 |
| `--gpu-memory-utilization` | 显存利用率 | 0.8-0.95 |
| `--served-model-name` | 服务显示的模型名称 | 自定义名称 |


## 生产环境建议

1. **监控**：设置日志级别`--uvicorn-log-level info`
2. **性能优化**：启用前缀缓存`--enable-prefix-caching`提升相似提示响应速度
3. **多GPU支持**：使用`--tensor-parallel-size`参数实现模型并行
4. **量化支持**：生产环境可使用AWQ/GPTQ量化降低显存占用

vLLM已成为业界LLM推理的事实标准，被AWS、阿里云、字节跳动等头部机构广泛采用。其OpenAI兼容的API设计使得现有应用可以无缝迁移。
