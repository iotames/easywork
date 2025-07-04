
## 触发器

- https://kestra.io/docs/workflow-components/triggers

触发器会根据事件自动启动您的流程。

1. 未定义任何触发器，默认未手动触发。
2. 可以将多个触发器附加到一个流。
3. 触发器类型：计划日期、新文件到达、队列中的新消息，其他流执行的结束。

## 示例

以下工作流会在每天上午 10 点以及 first_flow 完成执行时自动触发。这两个触发器彼此独立。

```
id: getting_started
namespace: company.team

tasks:
  - id: hello_world
    type: io.kestra.plugin.core.log.Log
    message: Hello World!

triggers:
  - id: schedule_trigger
    type: io.kestra.plugin.core.trigger.Schedule
    cron: 0 10 * * *

  - id: flow_trigger
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionFlow
        namespace: company.team
        flowId: first_flow
```

## WebHook触发器

- https://kestra.io/docs/workflow-components/triggers/webhook-trigger

示例：
```
id: trigger
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "Hello World! 🚀"

triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: 4wjtkzwVGBM9yKnjm3yv8r
```

URL地址：
```
https://{kestra_domain}/api/v1/executions/webhook/{namespace}/{flowId}/4wjtkzwVGBM9yKnjm3yv8r
```