## 简介

Workflow​​ 是GitHub提供的自动化工作流服务。常用于自动化软件构建、测试和部署等流程。

可以用来搭建持续集成和持续交付 (CI/CD) 平台等功能。

## 使用

1. 存储在仓库的 .github/workflows/目录下的 YAML 文件中
2. 由特定事件触发（如 push、pull request、定时任务等）
3. 包含一个或多个按顺序或并行执行的作业 (jobs)

## Action​​：

Action​​ 是工作流中的独立任务单元，是可重用的代码块。

1. ​预定义 Actions​​：GitHub 市场提供的现成解决方案
2. 自定义 Actions​​：用户可以自己创建的动作
3. 三种类型​​：JavaScript Actions、Docker container Actions、Composite Actions

## Artifact

1. GitHub Actions 的 `jobs` 之间是分布式的，相互独立的。上一个 job 生成的文件，不能直接传到下一个 job 中。
2. `Artifact` 用于在不同job之间传递文件：第一个 job 把构建好的文件，传到Artifact上，下一个 job 再从Artifact中下载。
3. GitHub 官方的 Action: `actions/upload-artifact`


## 本地调试工具: Act

[Act源码仓库](https://github.com/nektos/act)

[使用 Act 本地运行 GitHub Actions](https://blog.csdn.net/u011387521/article/details/139952626)

### 安装Act

1. 直接下载二进制文件：[https://github.com/nektos/act/releases](https://github.com/nektos/act/releases)

2. go install 源码安装

```
git clone https://github.com/nektos/act.git
cd act
go install
act --version

# act version 0.2.68
```

### 使用Act

输入 `act --help` 能看帮助内容

- `-n`：Dry run，用于校验语法，查看基本运行逻辑；
- `-j`：直接指定触发 Job；
- `g`：图形化的方式来展示 Action 的流程；
- `-e`：可以编写一个 JSON 文件来描述 Github 事件，例如一个 PR：

