## 错误和重试

通过自动重试和通知处理错误。

- https://kestra.io/docs/tutorial/errors
- https://kestra.io/docs/workflow-components/errors

1. 流程级别 ：为特定 `流程` 或 `任务` 实施自定义警报。这可以通过添加 errors 任务来实现。
2. 命名空间级别 ：为给定 `命名空间` 内任何失败的 Execution 发送通知。
3. allowFailure：给指定任务添加 `allowFailure: true` 属性，允许任务失败，而不会中断整个流程。执行以 WARNING 状态结束。


作用域：

1. errors 可以是子任务列表中，与 `子任务列表同级` 的错误处理列表。和子任务中的 `tasks` 同级并列。
2. errors 可以是流级别设置的 `任务列表`。这些任务在发生错误时执行。和 yml流文件中的 `tasks` 同级并列。
3. errors 可以是 `命名空间级别` 的错误处理列表。


## 子任务级别的错误处理


```yml
id: errors
namespace: company.team

tasks:
  - id: parent-seq
    type: io.kestra.plugin.core.flow.Sequential
    tasks:
      - id: t1
        type: io.kestra.plugin.core.debug.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
      - id: t2
        type: io.kestra.plugin.core.flow.Sequential
        tasks:
          - id: t2-t1
            type: io.kestra.plugin.core.execution.Fail
        errors:
          - id: error-t1
            type: io.kestra.plugin.core.debug.Return
            format: "Error Trigger ! {{task.id}}"
```

## 流级别的错误处理

```yml
id: unreliable_flow
namespace: company.team

tasks:
  - id: fail
    type: io.kestra.plugin.core.execution.Fail

errors:
  - id: alert_on_failure
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}" # https://hooks.slack.com/services/xyz/xyz/xyz
    payload: |
      {
        "text": "Failure alert for flow {{ flow.namespace }}.{{ flow.id }} with ID {{ execution.id }}"
      }
```

## 命名空间级别的错误处理

示例：一旦命名空间 company.team 中的任何流 `失败` 或 `完成并发出警告`，它就会自动发送 Slack 警报。

```yaml
id: failure_alert
namespace: system

tasks:
  - id: send
    type: io.kestra.plugin.notifications.slack.SlackExecution
    url: "{{ secret('SLACK_WEBHOOK') }}"
    channel: "#general"
    executionId: "{{trigger.executionId}}"

triggers:
  - id: listen
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionStatus
        in:
          - FAILED
          - WARNING
      - type: io.kestra.plugin.core.condition.ExecutionNamespace
        namespace: company.team
        prefix: true
```

## 重试

针对指定具体任务，添加 `retry` 属性。

- `retry` 属性的`type` 配置项，有 `constant`, `exponential`, `random` 三个可选值。

1. constant ：每 X 秒/分钟/小时/天重试一次。
2. exponential X 秒/分钟/小时/天重试一次，但采用指数退避（即每次重试尝试之间的指数时间间隔）。
3. random ：任务将每 X 秒/分钟/小时/天重试一次，并带有随机延迟（即每次重试之间的随机时间间隔）。

示例：API 调用容易出现暂时性错误。我们将重试任务 5 次(maxAttempt: 5)，最长不超过任务总运行持续时间的 1 分钟(maxDuration: PT1M)，每次重试尝试之间的间隔恒定为 3 秒(interval: PT3S)。

```yml
id: getting_started
namespace: company.team

tasks:
  - id: api
    type: io.kestra.plugin.core.http.Request
    uri: https://dummyjson.com/products
    retry:
      type: constant
      interval: PT3S
      maxDuration: PT1M
      maxAttempt: 5
      warningOnRetry: true
```
