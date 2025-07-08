## 命名空间

- 工作流组件-命名空间：https://kestra.io/docs/workflow-components/namespace

可以使用嵌入式代码编辑器和 `命名空间文件` 在命名空间级别组织您的代码，并可以选择从 `Git` 同步这些文件


## 命名空间文件

1. 概念 - 命名空间文件：https://kestra.io/docs/concepts/namespace-files

2. 版本控制与 CI/CD - 版本控制与 Git：https://kestra.io/docs/version-control-cicd/git

您可以将您的 Git 仓库与特定的命名空间同步，以协调 dbt、Terraform 或 Ansible，或任何包含代码和配置文件的其他项目。

一旦您将任何文件添加到命名空间中，您可以使用来自同一命名空间的 `EVERY` 任务或触发器中的 `read()` 函数在流程中引用它。


命名空间文件，存储在命名空间目录的 `_files` 子目录中，允许您在工作流中使用 `read()` 函数读取文件内容。

```
.
└── main
    ├── debug
    │   └── _files
    │       └── debug1.txt
    └── odoo
        ├── dev
        │   └── _files
        │       └── odoo_dev1.txt
        └── _files
            ├── hello.txt
            └── odoorun.yml
```

## 示例


```yaml
id: files
namespace: company.team

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "{{ read('example.txt') }}"
```

```python
import requests
api_key = '{{ secret("WEATHER_DATA_API_KEY") }}'
url = f"https://api.openweathermap.org/data/2.5/weather?q=Paris&APPID={api_key}"
weather_data = requests.get(url)
print(weather_data.json())
```

```yaml
id: weather_data
namespace: company.team

tasks:
  - id: get_weather
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
      include:
        - scripts/weather.py
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: ghcr.io/kestra-io/pydata:latest
    commands:
      - python scripts/weather.py
```

```yaml
id: namespace_files_example
namespace: dev.test

tasks:

  - id: namespace
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
      namespaces:
        - "dev.test"
        - "company"
    commands:
      - python test.py


  - id: namespace2
    type: io.kestra.plugin.scripts.python.Script
    namespaceFiles:
      enabled: true
    script: "{{ read('test.py') }}"
```

## TODO