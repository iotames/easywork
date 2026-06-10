## MetaGPT介绍

MetaGPT 是一个多智能体协作框架，将大型语言模型（LLM）驱动的AI智能体分别扮演产品经理、架构师、工程师等角色，按照标准软件公司的SOP流程协作，用户只需输入一句话需求，就能自动输出设计文档、代码等完整项目成果。

- 配置模型：https://docs.deepwisdom.ai/main/zh/guide/get_started/configuration/llm_api_configuration.html

- 快速开始：https://docs.deepwisdom.ai/main/zh/guide/get_started/quickstart.html

- 开源主页：https://github.com/FoundationAgents/MetaGPT


## 安装

```bash
# 请确保你的系统已安装Python 3.9+

# 方式一：安装pip发布包
pip install metagpt

# 方式二：以开发模式安装
# git clone https://github.com/FoundationAgents/MetaGPT
git clone https://github.com/geekan/MetaGPT.git
cd /your/path/to/MetaGPT
pip install -e .
```

Docker安装：

```bash
# 第1步：下载metagpt官方镜像并准备config2.yaml
docker pull metagpt/metagpt:latest
mkdir -p /opt/metagpt/{config,workspace}
docker run --rm metagpt/metagpt:latest cat /app/metagpt/config/config2.yaml > /opt/metagpt/config/config2.yaml
vim /opt/metagpt/config/config2.yaml # 修改配置

# 第2步：使用容器运行metagpt demo
docker run --rm \
    --privileged \
    -v /opt/metagpt/config/config2.yaml:/app/metagpt/config/config2.yaml \
    -v /opt/metagpt/workspace:/app/metagpt/workspace \
    metagpt/metagpt:latest \
    metagpt "Write a cli snake game"

# 你也可以启动一个容器并在其中执行命令
docker run --name metagpt -d \
    --privileged \
    -v /opt/metagpt/config/config2.yaml:/app/metagpt/config/config2.yaml \
    -v /opt/metagpt/workspace:/app/metagpt/workspace \
    metagpt/metagpt:latest

docker exec -it metagpt /bin/bash
metagpt "Write a cli snake game"
```

自己构建Docker镜像：

```bash
git clone https://github.com/geekan/MetaGPT.git
cd MetaGPT && docker build -t metagpt:custom .
```


## 配置

如果您按照安装中的 `git clone` 方法，`config/config2.yaml` 文件已经存在。只需编辑它或创建一个名为 `~/.metagpt/config2.yaml` 的副本进行编辑。这样您就不会意外地使用git提交和共享您的API密钥。

- MetaGPT将按照以下优先顺序读取您的设置：`~/.metagpt/config2.yaml` > `config/config2.yaml`

```yaml
llm:
  api_type: 'openai' # or azure / ollama / groq etc. Check LLMType for more options
  api_key: 'sk-...' # YOUR_API_KEY
  model: 'gpt-4-turbo' # or gpt-3.5-turbo
  base_url: 'https://api.openai.com/v1'  # or any forward url.
  # proxy: 'YOUR_LLM_PROXY_IF_NEEDED'  # Optional. If you want to use a proxy, set it here.
  # pricing_plan: 'YOUR_PRICING_PLAN' # Optional. If your pricing plan uses a different name than the `model`.
```

## 使用

- 智能体入门：https://docs.deepwisdom.ai/main/zh/guide/tutorials/agent_101.html

- 多智能体入门：https://docs.deepwisdom.ai/main/zh/guide/tutorials/multi_agent_101.html