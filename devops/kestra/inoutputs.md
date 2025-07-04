## 资源

- 项目主页：https://kestra.io/docs/tutorial/fundamentals
- 轻量灵活的命令行JSON处理器：https://jqlang.org/

## 工作流

```yml
id: getting_started
namespace: company.team

description: |
  # Getting Started
  Let's `write` some **markdown** - [first flow](https://t.ly/Vemr0) 🚀

labels:
  owner: rick.astley
  project: never-gonna-give-you-up

tasks:
  - id: hello_world
    type: io.kestra.plugin.core.log.Log
    message: Hello World!
    description: |
      ## About this task
      This task will print "Hello World!" to the logs.
```

- id 表示流的名称。相同id的工作流，可存在于不同的namespace中。id 和 namespace 的组合用作流的唯一标识符 。
- namespace 可用于分离开发和生产环境。
- tasks 是将按定义的顺序执行的任务列表。推荐使用小写英文和下划线命名。

1. 空间：创建流后，您将无法更改其命名空间。
2. 标签：使用键值对对流进行分组


## 获取工作流的输入

```yml
id: getting_started
namespace: company.team

inputs:
  - id: api_url
    type: STRING
    defaults: https://dummyjson.com/products

tasks:
  - id: api
    type: io.kestra.plugin.core.http.Request
    uri: "{{ inputs.api_url }}"
```

## 获取任务的输出

引用某个 `task_id(task-id)` 任务的输出:

```
{{ outputs.task_id.output_property }}

# 任务 ID 包含一个或多个连字符（- 符号），请将任务 ID 括在方括号中
{{ outputs['task-id'].output_property }}
```

示例：

```yaml
id: getting_started
namespace: company.team

inputs:
  - id: api_url
    type: STRING
    defaults: https://dummyjson.com/products

tasks:
  - id: api
    type: io.kestra.plugin.core.http.Request
    uri: "{{ inputs.api_url }}"

  - id: python
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    beforeCommands:
      - pip install polars
    outputFiles:
      - "products.csv"
    script: |
      import polars as pl
      data = {{ outputs.api.body | jq('.products') | first }}
      df = pl.from_dicts(data)
      df.glimpse()
      df.select(["brand", "price"]).write_csv("products.csv")

  - id: sqlQuery
    type: io.kestra.plugin.jdbc.duckdb.Query
    inputFiles:
      in.csv: "{{ outputs.python.outputFiles['products.csv'] }}"
    sql: |
      SELECT brand, round(avg(price), 2) as avg_price
      FROM read_csv_auto('{{ workingDir }}/in.csv', header=True)
      GROUP BY brand
      ORDER BY avg_price DESC;
    store: true
```

1. 使用 `{{ outputs.task_id.body }}` 语法，提取上游 `API` 任务的结果数据
2. 使用 [jq](https://jqlang.org/) 语法 `{{ outputs.task_id.body | jq('.products') | first }}`，提取 `products` 数组中的第一个元素
3. 在执行实例的 `输出(Outputs)` 选项卡，对输出结果进行调试。
4. 使用 `io.kestra.plugin.jdbc.duckdb.Query` 任务，对上游的 `CSV文件` 执行 SQL 查询，将结果作为可下载构件保存（配置：`store： true`）。
