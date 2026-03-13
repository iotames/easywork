## 推理框架

推理框架​ 是专门用于优化和执行已训练好模型的软件库或工具。它的核心目标不是训练模型，而是将训练好的模型以高效、快速、节省资源的方式部署到实际的生产或应用环境中，处理用户的输入（推理请求）并生成输出。

追求高吞吐、易用的云服务API​ → `vLLM`
需要极致的跨平台、本地或边缘部署，使用GGUF模型 → `llama.cpp`
追求在NVIDIA GPU上极致的单请求性能与延迟​ → `TensorRT-LLM`
需要部署复杂的多框架模型流水线​ → `Triton`推理服务器

这些框架构成了大模型推理部署的核心基础设施。


### Llama

基于C/C++编写，无第三方依赖，追求极致的跨平台部署能力。它对GGUF格式模型提供原生、深度优化，支持从高端GPU到普通CPU、甚至手机的广泛设备。是本地、边缘或资源受限环境部署的首选。

https://github.com/ggml-org/llama.cpp


### vLLM

- https://github.com/vllm-project/vllm
- https://github.com/NVIDIA/TensorRT-LLM
- Docker: https://hub.docker.com/r/vllm/vllm-openai/

vLLM 独创 PagedAttention 设计，将 Llama、Qwen、Mistral 等主流模型的吞吐量提升 10 以上，同时保持更低的延迟和显存占用，解决了大模型部署的核心瓶颈。

为LLM服务专用推理引擎，是性能利器。由伯克利 LMSYS 团队打造，社区维护。

1. 仅运行 `<7B` 的小模型，且无并发压力则 Hugging Face Transformers 足够。
2. 极致定制化推理逻辑 → 可能需基于 Triton 或 TensorRT-LLM 自研。

```bash
# vLLM部署示例
docker run --gpus all -p 8000:8000 \
  --rm -it ghcr.io/vllm-project/vllm-openai:latest \
  --model Qwen/Qwen2.5-7B-Instruct \
  --quantization awq
```


### TensorFlow Serving

TensorFlow生态专用服务框架，Google官方维护。


### TorchServe

PyTorch生态专用服务框架，PyTorch官方维护。


### Triton Inference Server

Triton推理服务器​ 是一个强大的统一推理服务平台，支持多框架、多硬件。是企业AI基础设施的“操作系统”。

框架支持: TensorFlow, PyTorch, ONNX Runtime, TensorRT, OpenVINO, vLLM, Python, 自定义后端。

模型热更新、版本管理、资源隔离和丰富的诊断指标是开箱即用的企业级功能。NVIDIA官方维护，是云厂商和大型企业AI平台的事实标准后端。

https://github.com/triton-inference-server/server
