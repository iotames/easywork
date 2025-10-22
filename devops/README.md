---
layout: home
title: DevOps
---

{% comment %}
项目简介部分移到了页面主体内容中
{% endcomment %}

## 什么是DevOps

DevOps 是一种软件开发方法，通过将软件开发 (Dev) 和 IT 运营 (Ops) 团队的工作相结合并实现自动化，加速交付应用程序和服务。

DevOps 的特点是持续集成和持续交付 (CI/CD)，它们支持更小、更快的软件更新。通过 CI/CD，一小部分新代码会频繁地合并到代码库中，然后自动集成、测试和准备部署到生产环境。

- https://www.ibm.com/cn-zh/think/topics/devops


## 项目管理

- 通用项目管理
1. PowerProject：闭源，商业授权费用高。适合强管控型项目：如基建/制造。可与SAP/用友等ERP深度集成。https://blog.csdn.net/Bianyj5678/article/details/145597148
2. OpenProject：开源（GPLv3），自托管。在资源调度、成本控制方面的标准化能力更契合大型集团管控需求。有官方移动应用

- 软件项目管理
1. Taiga：原生自洽设计，敏捷开发，与GitLab深度集成。Django+Angular架构。
2. Redmine：插件生态设计。Ruby on Rails架构。配置复杂，优势：缺陷跟踪。


## OpenProject

1. 项目主页：https://github.com/opf/openproject，https://github.com/opf/openproject-docker-compose
2. 官网：https://www.openproject.org
3. 安装：https://www.openproject.org/docs/installation-and-operations/installation/docker-compose/

环境变量文件：`.env` 
```conf
TAG=16.2.0
OPENPROJECT_HTTPS=false
OPENPROJECT_HOST__NAME=172.16.160.18
PORT=8089
```

## Taiga

- taiga.md: [taiga/taiga.md](taiga/taiga.md)

------------

- DevOps平台搭建过程详解--Gitlab+Jenkins+Docker+Harbor+K8s集群搭建CICD平台 https://blog.csdn.net/xfp5158/article/details/142092050
- 十大DevOPS工具推荐：GitLab, Jenkins, Docker容器, K8S容器编排, Ansible配置管理, Terraform基础设施即代码，Prometheus+Grafana监控，ELK Stack日志分析，Jira项目管理，Nagios网络监控
- K8S的GUI界面：k8s Dashbord, Kuboard
- Ansible: 在大量服务器上自动执行配置任务；方便部署应用；确保系统配置的一致性
- Jenkins: 持续集成服务
