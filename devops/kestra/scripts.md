## 运行脚本任务

- https://kestra.io/docs/tutorial/scripts

在隔离的 Docker 容器中运行自定义 Python、R、Julia、Node.js、Shell 脚本等。

- 运行 Python、Node.js、R、Julia、Bash 等的脚本任务
- 运行数据摄取同步的 Singer 任务
- 运行 DBT 作业的 DBT 任务


## 配置taskRunner

要在 Docker 容器中运行任务，必须给任务设置 `taskRunner` 配置项。

每个脚本任务（例如 Python、R、Julia、Node.js 和 Shell）的任务文档提供了有关可用 taskRunner 属性的更多详细信息。

- https://kestra.io/plugins/plugin-script-python/io.kestra.plugin.scripts.python.script
- https://kestra.io/plugins/plugin-script-shell/io.kestra.plugin.scripts.shell.script


```yaml
id: private_docker_image
namespace: company.team

tasks:
  - id: custom_image
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
      credentials:
        username: your_username
        password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    containerImage: ghcr.io/your_org/your_package:tag
    script: |
        print("this runs using a private container image")
```