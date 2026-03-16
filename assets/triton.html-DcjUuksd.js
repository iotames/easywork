import{_ as s,c as a,e,o as p}from"./app-C7XnOHte.js";const l={};function t(i,n){return p(),a("div",null,[...n[0]||(n[0]=[e(`<h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h2><p>Inference Server 是 NVIDIA 开源的高性能推理服务平台。它的核心设计目标是标准化、高性能地部署和生产化任何框架训练的 AI 模型。</p><p>核心特点：</p><ol><li>统一服务化：将 TensorFlow、PyTorch、ONNX、TensorRT 或像 vLLM 这样的自定义后端模型，统一封装成标准的 HTTP/gRPC API 服务。</li><li>极致性能：内置并发模型执行、动态批处理、模型流水线，能最大化利用 GPU/CPU 资源，降低推理延迟。</li><li>生产就绪：直接提供模型版本管理、健康检查、监控指标、并发模型加载等生产级功能。</li></ol><ul><li>https://github.com/triton-inference-server/server</li><li>https://developer.nvidia.com/dynamo-triton</li><li>https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/index.html</li></ul><h2 id="环境准备与模型获取" tabindex="-1"><a class="header-anchor" href="#环境准备与模型获取"><span>环境准备与模型获取</span></a></h2><p>下载推理框架：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 拉取 Triton CPU 官方镜像 (选择带Python后端的版本)</span></span>
<span class="line"><span class="token function">docker</span> pull nvcr.io/nvidia/tritonserver:24.10-py3</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 也可以直接下载二进制文件，但要安装好依赖</span></span>
<span class="line"><span class="token comment"># 从 GitHub Releases 下载对应版本（以 25.01 为例）</span></span>
<span class="line"><span class="token comment"># wget https://github.com/triton-inference-server/server/releases/download/v25.01/tritonserver-25.01-linux-x86_64.tar.gz</span></span>
<span class="line"><span class="token comment"># tar -xvf tritonserver-25.01-linux-x86_64.tar.gz</span></span>
<span class="line"><span class="token comment"># cd tritonserver</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Ubuntu/Debian 系统，安装系统依赖</span></span>
<span class="line"><span class="token comment"># sudo apt-get update</span></span>
<span class="line"><span class="token comment"># sudo apt-get install -y libssl-dev libcurl4-openssl-dev libarchive-dev \\</span></span>
<span class="line"><span class="token comment">#                        libb64-dev libre2-dev libboost-all-dev \\</span></span>
<span class="line"><span class="token comment">#                        rapidjson-dev libopenblas-dev</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 准备 Python 环境（vLLM 依赖）</span></span>
<span class="line"><span class="token comment"># 创建 Python 虚拟环境</span></span>
<span class="line"><span class="token comment"># python3 -m venv /opt/triton/python_env</span></span>
<span class="line"><span class="token comment"># source /opt/triton/python_env/bin/activate</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># # 安装 vLLM 和 Triton Python 后端</span></span>
<span class="line"><span class="token comment"># pip install vllm tritonclient[all]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下载模型</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 2. 创建模型仓库目录结构</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /path/to/model_repository</span>
<span class="line"><span class="token builtin class-name">cd</span> /path/to/model_repository</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 下载示例GGUF模型并创建模型目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> qwen_gguf/1</span>
<span class="line"><span class="token builtin class-name">cd</span> qwen_gguf/1</span>
<span class="line"><span class="token function">wget</span> https://huggingface.co/unsloth/Qwen3.5-0.8B-GGUF/resolve/main/qwen3.5-0.8b.Q4_K_M.gguf <span class="token parameter variable">-O</span> model.gguf</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="核心配置文件-config-pbtxt" tabindex="-1"><a class="header-anchor" href="#核心配置文件-config-pbtxt"><span>核心配置文件：config.pbtxt</span></a></h2><p><code>config.pbtxt</code> 文件， 在 <code>/path/to/model_repository/qwen_gguf/</code> 目录 ，这是Triton模型部署的核心。</p><div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre><code class="language-protobuf"><span class="line"># <span class="token number">1.</span> 模型名称：客户端调用时使用的标识符</span>
<span class="line">name<span class="token punctuation">:</span> <span class="token string">&quot;qwen_llamacpp&quot;</span></span>
<span class="line"></span>
<span class="line"># <span class="token number">2.</span> 后端类型：必须指定为 <span class="token string">&quot;python&quot;</span>，以使用您编写的 model<span class="token punctuation">.</span>py</span>
<span class="line">backend<span class="token punctuation">:</span> <span class="token string">&quot;python&quot;</span></span>
<span class="line"></span>
<span class="line"># <span class="token number">3.</span> 最大批处理大小：设置为 <span class="token number">0</span> 表示禁用 Triton 的动态批处理。</span>
<span class="line"># 原因：llama<span class="token punctuation">.</span>cpp 在 model<span class="token punctuation">.</span>py 内部已实现其自身的生成循环，由 Triton 在外部做动态批处理会复杂且低效。</span>
<span class="line">max_batch_size<span class="token punctuation">:</span> <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"># <span class="token number">4.</span> 输入定义：必须与 model<span class="token punctuation">.</span>py 中 \`pb_utils<span class="token punctuation">.</span>get_input_tensor_by_name\` 使用的名称一致。</span>
<span class="line">input <span class="token punctuation">[</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    name<span class="token punctuation">:</span> <span class="token string">&quot;prompt&quot;</span>        # 输入张量名称</span>
<span class="line">    data_type<span class="token punctuation">:</span> TYPE_STRING # 数据类型为字符串</span>
<span class="line">    dims<span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token punctuation">]</span>          # 维度为 <span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span> 表示可变长度的一维数组（即单个字符串）</span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  # 您可以在此添加其他输入，例如生成参数（temperature<span class="token punctuation">,</span> max_tokens）</span>
<span class="line">  # <span class="token punctuation">{</span></span>
<span class="line">  #   name<span class="token punctuation">:</span> <span class="token string">&quot;max_tokens&quot;</span></span>
<span class="line">  #   data_type<span class="token punctuation">:</span> TYPE_INT32</span>
<span class="line">  #   dims<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span></span>
<span class="line">  # <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"># <span class="token number">5.</span> 输出定义：必须与 model<span class="token punctuation">.</span>py 中构造的返回张量名称一致。</span>
<span class="line">output <span class="token punctuation">[</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    name<span class="token punctuation">:</span> <span class="token string">&quot;generated_text&quot;</span> # 输出张量名称</span>
<span class="line">    data_type<span class="token punctuation">:</span> TYPE_STRING</span>
<span class="line">    dims<span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token punctuation">]</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"># <span class="token number">6.</span> 实例组配置：<span class="token operator">*</span><span class="token operator">*</span>CPU模型部署的核心配置<span class="token operator">*</span><span class="token operator">*</span></span>
<span class="line">instance_group <span class="token punctuation">[</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    count<span class="token punctuation">:</span> <span class="token number">1</span>               # 实例数量。对于CPU模型，可增加以利用多核，但会倍增内存占用。</span>
<span class="line">    kind<span class="token punctuation">:</span> KIND_CPU         # 指定在 CPU 上执行。这是必须的。</span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"># <span class="token number">7.</span> 模型版本策略：默认为加载所有版本，保持即可。</span>
<span class="line">version_policy<span class="token punctuation">:</span> <span class="token punctuation">{</span> all <span class="token punctuation">{</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"># <span class="token number">8.</span> 优化配置（可选但重要）</span>
<span class="line">optimization <span class="token punctuation">{</span></span>
<span class="line">  # CPU 线程池配置，可影响内部并行度</span>
<span class="line">  cpu_execution_accelerators <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span> name<span class="token punctuation">:</span> <span class="token string">&quot;auto&quot;</span> <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"># <span class="token number">9.</span> 后端参数：<span class="token operator">*</span><span class="token operator">*</span>Python后端特有的关键配置<span class="token operator">*</span><span class="token operator">*</span></span>
<span class="line">parameters <span class="token punctuation">[</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    key<span class="token punctuation">:</span> <span class="token string">&quot;EXECUTION_ENV&quot;</span></span>
<span class="line">    # 用于设置 Python 后端的运行时环境变量。</span>
<span class="line">    # 例如，可指定共享库路径，确保能找到 llama<span class="token operator">-</span>cpp<span class="token operator">-</span>python 的底层 C 库。</span>
<span class="line">    value<span class="token punctuation">:</span> <span class="token punctuation">{</span>string_value<span class="token punctuation">:</span> <span class="token string">&quot;{\\&quot;LD_LIBRARY_PATH\\&quot;: \\&quot;/usr/local/custom_lib:/opt/llama_cpp_libs\\&quot;}&quot;</span><span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="python后端模型脚本-model-py" tabindex="-1"><a class="header-anchor" href="#python后端模型脚本-model-py"><span>Python后端模型脚本：model.py</span></a></h2><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code class="language-python"><span class="line"><span class="token keyword">import</span> triton_python_backend_utils <span class="token keyword">as</span> pb_utils</span>
<span class="line"><span class="token keyword">import</span> numpy <span class="token keyword">as</span> np</span>
<span class="line"><span class="token keyword">from</span> llama_cpp <span class="token keyword">import</span> Llama  <span class="token comment"># 使用llama-cpp-python库</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">TritonPythonModel</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token keyword">def</span> <span class="token function">initialize</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token triple-quoted-string string">&quot;&quot;&quot;模型初始化，加载GGUF文件&quot;&quot;&quot;</span></span>
<span class="line">        model_path <span class="token operator">=</span> os<span class="token punctuation">.</span>path<span class="token punctuation">.</span>join<span class="token punctuation">(</span>args<span class="token punctuation">[</span><span class="token string">&#39;model_repository&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> args<span class="token punctuation">[</span><span class="token string">&#39;model_version&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token string">&#39;model.gguf&#39;</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token comment"># 关键参数：n_ctx为上下文长度，n_threads为推理线程数，n_gpu_layers=0表示纯CPU</span></span>
<span class="line">        self<span class="token punctuation">.</span>llm <span class="token operator">=</span> Llama<span class="token punctuation">(</span></span>
<span class="line">            model_path<span class="token operator">=</span>model_path<span class="token punctuation">,</span></span>
<span class="line">            n_ctx<span class="token operator">=</span><span class="token number">4096</span><span class="token punctuation">,</span></span>
<span class="line">            n_threads<span class="token operator">=</span><span class="token number">4</span><span class="token punctuation">,</span>  <span class="token comment"># 根据CPU核心数调整</span></span>
<span class="line">            n_gpu_layers<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">,</span>  <span class="token comment"># 纯CPU推理</span></span>
<span class="line">            verbose<span class="token operator">=</span><span class="token boolean">False</span></span>
<span class="line">        <span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f&quot;Model loaded from </span><span class="token interpolation"><span class="token punctuation">{</span>model_path<span class="token punctuation">}</span></span><span class="token string">&quot;</span></span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">def</span> <span class="token function">execute</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> requests<span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token triple-quoted-string string">&quot;&quot;&quot;处理推理请求&quot;&quot;&quot;</span></span>
<span class="line">        responses <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token keyword">for</span> request <span class="token keyword">in</span> requests<span class="token punctuation">:</span></span>
<span class="line">            <span class="token comment"># 1. 获取输入</span></span>
<span class="line">            prompt <span class="token operator">=</span> pb_utils<span class="token punctuation">.</span>get_input_tensor_by_name<span class="token punctuation">(</span>request<span class="token punctuation">,</span> <span class="token string">&quot;prompt&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>as_numpy<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>decode<span class="token punctuation">(</span><span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">)</span></span>
<span class="line">            </span>
<span class="line">            <span class="token comment"># 2. 调用模型生成（关键：流式生成或单次生成）</span></span>
<span class="line">            output <span class="token operator">=</span> self<span class="token punctuation">.</span>llm<span class="token punctuation">(</span></span>
<span class="line">                prompt<span class="token punctuation">,</span></span>
<span class="line">                max_tokens<span class="token operator">=</span><span class="token number">256</span><span class="token punctuation">,</span></span>
<span class="line">                temperature<span class="token operator">=</span><span class="token number">0.7</span><span class="token punctuation">,</span></span>
<span class="line">                stop<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string">&quot;&lt;/s&gt;&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;###&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">                echo<span class="token operator">=</span><span class="token boolean">False</span></span>
<span class="line">            <span class="token punctuation">)</span></span>
<span class="line">            generated_text <span class="token operator">=</span> output<span class="token punctuation">[</span><span class="token string">&#39;choices&#39;</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token string">&#39;text&#39;</span><span class="token punctuation">]</span></span>
<span class="line">            </span>
<span class="line">            <span class="token comment"># 3. 构造返回张量</span></span>
<span class="line">            output_tensor <span class="token operator">=</span> pb_utils<span class="token punctuation">.</span>Tensor<span class="token punctuation">(</span></span>
<span class="line">                <span class="token string">&quot;generated_text&quot;</span><span class="token punctuation">,</span></span>
<span class="line">                np<span class="token punctuation">.</span>array<span class="token punctuation">(</span><span class="token punctuation">[</span>generated_text<span class="token punctuation">.</span>encode<span class="token punctuation">(</span><span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">,</span> dtype<span class="token operator">=</span><span class="token builtin">object</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token punctuation">)</span></span>
<span class="line">            responses<span class="token punctuation">.</span>append<span class="token punctuation">(</span>pb_utils<span class="token punctuation">.</span>InferenceResponse<span class="token punctuation">(</span>output_tensors<span class="token operator">=</span><span class="token punctuation">[</span>output_tensor<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">return</span> responses</span>
<span class="line"></span>
<span class="line">    <span class="token keyword">def</span> <span class="token function">finalize</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token triple-quoted-string string">&quot;&quot;&quot;清理资源&quot;&quot;&quot;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token builtin">hasattr</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> <span class="token string">&#39;llm&#39;</span><span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token keyword">del</span> self<span class="token punctuation">.</span>llm</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以创建 <code>model.json</code> 文件，定义内置的 <code>vLLM</code> 引擎的具体参数(Triton 24.03+)。但对 <code>gguf</code> 格式的CPU模型，不推荐使用。</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;model&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/opt/triton/models/qwen35_08b_gguf/1/Qwen3.5-0.8B-Q4_K_M.gguf&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;tokenizer&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Qwen/Qwen3.5-0.8B&quot;</span><span class="token punctuation">,</span>  <span class="token comment">// 或使用本地分词器目录</span></span>
<span class="line">  <span class="token property">&quot;disable_log_requests&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;trust_remote_code&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;max_model_len&quot;</span><span class="token operator">:</span> <span class="token number">8192</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;gpu_memory_utilization&quot;</span><span class="token operator">:</span> <span class="token number">0.9</span><span class="token punctuation">,</span>  <span class="token comment">// 如果使用 GPU 则保留，纯 CPU 可移除或忽略</span></span>
<span class="line">  <span class="token property">&quot;enforce_eager&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;dtype&quot;</span><span class="token operator">:</span> <span class="token string">&quot;float16&quot;</span>  <span class="token comment">// GGUF 已量化，此处指定加载的数据类型</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="创建python环境包" tabindex="-1"><a class="header-anchor" href="#创建python环境包"><span>创建Python环境包</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 在宿主机上创建Python虚拟环境并打包</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /path/to/model_repository/qwen_gguf/1</span>
<span class="line">python3 <span class="token parameter variable">-m</span> venv qwen_env</span>
<span class="line"><span class="token builtin class-name">source</span> qwen_env/bin/activate</span>
<span class="line">pip <span class="token function">install</span> llama-cpp-python  <span class="token comment"># 核心依赖</span></span>
<span class="line">pip <span class="token function">install</span> numpy tritonclient<span class="token punctuation">[</span>all<span class="token punctuation">]</span>  <span class="token comment"># Triton Python后端工具</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 打包环境（Triton Python后端要求）</span></span>
<span class="line"><span class="token function">tar</span> <span class="token parameter variable">-czf</span> qwen_env.tar.gz qwen_env/</span>
<span class="line"><span class="token comment"># 将此包复制到容器内指定路径，或通过卷挂载</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="启动triton服务-生产级参数" tabindex="-1"><a class="header-anchor" href="#启动triton服务-生产级参数"><span>启动Triton服务（生产级参数）</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 使用Docker启动，关键参数已标注</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> triton_server <span class="token punctuation">\\</span></span>
<span class="line">  --shm-size<span class="token operator">=</span>2g <span class="token variable"><span class="token variable">\`</span><span class="token comment"># 共享内存，用于进程间通信，根据批处理大小调整</span><span class="token variable">\`</span></span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--memory</span><span class="token operator">=</span><span class="token string">&quot;8g&quot;</span> <span class="token variable"><span class="token variable">\`</span><span class="token comment"># 限制容器内存</span><span class="token variable">\`</span></span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--cpus</span><span class="token operator">=</span><span class="token string">&quot;4.0&quot;</span> <span class="token variable"><span class="token variable">\`</span><span class="token comment"># 限制CPU资源</span><span class="token variable">\`</span></span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-p</span> <span class="token number">8000</span>:8000 <span class="token variable"><span class="token variable">\`</span><span class="token comment"># HTTP端口</span><span class="token variable">\`</span></span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-p</span> <span class="token number">8001</span>:8001 <span class="token variable"><span class="token variable">\`</span><span class="token comment"># gRPC端口（性能更优）</span><span class="token variable">\`</span></span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-p</span> <span class="token number">8002</span>:8002 <span class="token variable"><span class="token variable">\`</span><span class="token comment"># 监控指标端口</span><span class="token variable">\`</span></span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /path/to/model_repository:/models <span class="token variable"><span class="token variable">\`</span><span class="token comment"># 挂载模型仓库</span><span class="token variable">\`</span></span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /path/to/model_repository/qwen_gguf/1/qwen_env.tar.gz:/opt/tritonserver/backends/python/qwen_env.tar.gz <span class="token variable"><span class="token variable">\`</span><span class="token comment"># 挂载Python环境</span><span class="token variable">\`</span></span> <span class="token punctuation">\\</span></span>
<span class="line">  nvcr.io/nvidia/tritonserver:24.10-py3 <span class="token punctuation">\\</span></span>
<span class="line">  tritonserver <span class="token punctuation">\\</span></span>
<span class="line">  --model-repository<span class="token operator">=</span>/models <span class="token punctuation">\\</span></span>
<span class="line">  --model-control-mode<span class="token operator">=</span>poll <span class="token variable"><span class="token variable">\`</span><span class="token comment"># 轮询模式，支持模型热更新</span><span class="token variable">\`</span></span> <span class="token punctuation">\\</span></span>
<span class="line">  --http-thread-count<span class="token operator">=</span><span class="token number">8</span> <span class="token variable"><span class="token variable">\`</span><span class="token comment"># HTTP处理线程数，建议为CPU核心数1-2倍</span><span class="token variable">\`</span></span> <span class="token punctuation">\\</span></span>
<span class="line">  --allow-metrics<span class="token operator">=</span>true <span class="token variable"><span class="token variable">\`</span><span class="token comment"># 启用监控指标</span><span class="token variable">\`</span></span> <span class="token punctuation">\\</span></span>
<span class="line">  --metrics-port<span class="token operator">=</span><span class="token number">8002</span> <span class="token punctuation">\\</span></span>
<span class="line">  --log-info<span class="token operator">=</span>true <span class="token punctuation">\\</span></span>
<span class="line">  --log-verbose<span class="token operator">=</span><span class="token number">0</span> <span class="token variable"><span class="token variable">\`</span><span class="token comment"># 生产环境可关闭详细日志</span><span class="token variable">\`</span></span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># # 二进制启动命令：</span></span>
<span class="line"><span class="token comment"># ./bin/tritonserver \\</span></span>
<span class="line"><span class="token comment">#   --model-repository=/opt/triton/models \\</span></span>
<span class="line"><span class="token comment">#   --strict-model-config=false \\</span></span>
<span class="line"><span class="token comment">#   --log-verbose=1 \\</span></span>
<span class="line"><span class="token comment">#   --model-control-mode=explicit \\</span></span>
<span class="line"><span class="token comment">#   --load-model=qwen35_08b_gguf \\</span></span>
<span class="line"><span class="token comment">#   --backend-config=vllm,env=&quot;PYTHONPATH=/opt/triton/python_env/lib/python3.10/site-packages&quot;  </span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="服务验证与监控" tabindex="-1"><a class="header-anchor" href="#服务验证与监控"><span>服务验证与监控</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token comment"># 1. 检查服务状态</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-v</span> localhost:8000/v2/health/ready</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 查看已加载模型</span></span>
<span class="line"><span class="token function">curl</span> localhost:8000/v2/models</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 使用HTTP API进行推理</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST http://localhost:8000/v2/models/qwen_gguf/infer <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-H</span> <span class="token string">&quot;Content-Type: application/json&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-d</span> <span class="token string">&#39;{</span>
<span class="line">    &quot;inputs&quot;: [</span>
<span class="line">      {</span>
<span class="line">        &quot;name&quot;: &quot;prompt&quot;,</span>
<span class="line">        &quot;shape&quot;: [1],</span>
<span class="line">        &quot;datatype&quot;: &quot;BYTES&quot;,</span>
<span class="line">        &quot;data&quot;: [&quot;请用中文介绍人工智能&quot;]</span>
<span class="line">      }</span>
<span class="line">    ],</span>
<span class="line">    &quot;outputs&quot;: [{&quot;name&quot;: &quot;generated_text&quot;}]</span>
<span class="line">  }&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 获取性能指标（用于Prometheus）</span></span>
<span class="line"><span class="token function">curl</span> localhost:8002/metrics</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,23)])])}const o=s(l,[["render",t]]),u=JSON.parse('{"path":"/ai/deploy/triton.html","title":"","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1772896691000,"contributors":[{"name":"Hankin","username":"Hankin","email":"554553400@qq.com","commits":1,"url":"https://github.com/Hankin"}],"changelog":[{"hash":"29fa8d7f0dbc580c1f646617e2445a6a60b7d954","time":1772896691000,"email":"554553400@qq.com","author":"Hankin","message":"ADD ai deploy by: llama, triton"}]},"filePathRelative":"ai/deploy/triton.md"}');export{o as comp,u as data};
