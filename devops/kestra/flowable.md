## 循环和条件分支任务

- https://kestra.io/docs/tutorial/flowable

并行运行任务或子流，创建循环和条件分支。

## 条件判断

1. 根据 beauty 或 notebook 的产品类别输入发出 API 请求。
2. 判断API响应的结果是否存在商品，然后执行对应的流程。

```
id: getting_started
namespace: company.team

inputs:
  - id: category
    type: SELECT
    displayName: Select a category
    values: ['beauty', 'notebooks']
    defaults: 'beauty'

tasks:
  - id: api
    type: io.kestra.plugin.core.http.Request
    uri: "https://dummyjson.com/products/category/{{inputs.category}}"
    method: GET

  - id: if
    type: io.kestra.plugin.core.flow.If
    condition: "{{ json(outputs.api.body).products | length > 0 }}"
    then:
      - id: when_true
        type: io.kestra.plugin.core.log.Log
        message: "This category has products"
    else:
      - id: when_false
        type: io.kestra.plugin.core.log.Log
        message: "The category has no products."
```

## 循环遍历

- https://kestra.io/plugins/core/flow/io.kestra.plugin.core.flow.foreach

```yaml
id: for_loop_example
namespace: tutorial

tasks:
  - id: for_each
    type: io.kestra.plugin.core.flow.ForEach
    concurrencyLimit: 0
    values: ["pynchon", "dostoyevsky", "hedayat"]
    tasks:
      - id: api
        type: io.kestra.plugin.core.http.Request
        uri: "https://openlibrary.org/search.json?author={{ taskrun.value }}&sort=new"
```

1. values 属性定义迭代列表： 即字符串值列表["value1"， "value2"] 或键值对 [{"key": "value1"}, {"key": "value2"}] 列表 
2. tasks 属性定义要迭代执行的任务列表。可以使用 {{ taskrun.value }} 或 {{ parent.taskrun.value }} 变量访问迭代值。
3. concurrencyLimit 属性值为 0 ，任务讲并行执行。不填该属性或属性值为1，则任务串行，将按顺序执行。

```yaml
id: python_partitions
namespace: company.team

description: Process partitions in parallel

tasks:
  - id: getPartitions
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: ghcr.io/kestra-io/pydata:latest
    script: |
      from kestra import Kestra
      partitions = [f"file_{nr}.parquet" for nr in range(1, 10)]
      Kestra.outputs({'partitions': partitions})

  - id: processPartitions
    type: io.kestra.plugin.core.flow.ForEach
    
    values: '{{ outputs.getPartitions.vars.partitions }}'
    tasks:
      - id: partition
        type: io.kestra.plugin.scripts.python.Script
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: ghcr.io/kestra-io/pydata:latest
        script: |
          import random
          import time
          from kestra import Kestra

          filename = '{{ taskrun.value }}'
          print(f"Reading and processing partition {filename}")
          nr_rows = random.randint(1, 1000)
          processing_time = random.randint(1, 20)
          time.sleep(processing_time)
          Kestra.counter('nr_rows', nr_rows, {'partition': filename})
          Kestra.timer('processing_time', processing_time, {'partition': filename})
```
