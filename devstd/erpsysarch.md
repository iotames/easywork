## 系统架构设计

参考互联网分层模型，设计集团公司的ERP系统架构。


## 后端架构设计

主框架基座，使用强类型的静态编程语言。复杂定制的业务场景逻辑，则用动态脚本语言开发。

### 架构底座

1. 编程语言：使用静态语言如：C, Go
2. 主要职责：外网请求的唯一入口。负责接收，过滤，分发网络请求，记录日志，统计数据。
3. 数据流转：数据在架构底座经过三层流转：网络防护层，业务分发层，结果处理层（负责最终响应，耗时统计等）。
4. 网络防护层：过滤、拦截网络攻击。记录请求进来的时间begin_at。记录请求日志，包括IP，请求头，流量（数据包大小）。
5. 业务分发层：对外业务网络请求的中央调度器。记录请求进来的时间begin_biz_at。通过URI路由映射，分发外部进来的网络请求到业务应用层的微服务。
6. 结果处理层：对外响应请求结果。记录业务应用层完成请求的时间done_biz_at。
7. 日志与统计组件：分析统计业务应用层，各个微服务，网络请求统计，包括耗时统计，API访问统计，报错统计。。。设置日志留存时间，防止存储空间不足。

### 业务应用层

1. 编程语言：使用动态脚本语言。如Python, PHP
2. 主要职责：处理业务逻辑，数据处理与存储。
3. 组织形式：领域驱动设计，按业务场景解耦，明确职责边界。每个业务领域，服务名以stbiz_开头，组成微服务。
4. 数据流转：微服务之间，通过TCP协议调用API接口进行内网通信。


## 前端架构设计

大规模复杂的企业中台前端架构。技术栈无关，低耦合，高扩展。

1. 技术栈无关：主框架不限制接入应用的技术栈。支持Web Components标准。方便后期业务扩展和组件库的引入。
2. 领域驱动支持：新业务领域，支持独立开发和部署。支持以前端微服务方式接入新扩展的业务。
3. 前端的逻辑与UI分离的设计。无头组件和无头框架。
4. 灵活高效：页面支持传统代码编程与低代码快速渲染2种方式。
5. 低代码：支持可视化的前端设计器。使用 baidu/amis 组件。可视化设计器参考：https://github.com/aisuda/amis-editor-demo
6. 前端逻辑层：使用 TanStack Query React 或者基于它的 Refine。
7. 灵活的导航菜单：使用统一的API接口动态获取菜单，路由，前端组件。保证登录后可根据角色定制菜单和页面。
8. 主框架暂定React，Vue组件可按需集成。例如使用Veaury
9. 为保证项目的生命周期能尽可能长，推荐遵循行业标准而不是深度绑定某个技术栈。


## 系统架构图

1. 后端架构图

```mermaid
flowchart TD
    %% 外部请求入口
    A[外部请求<br>来自互联网] --> B[架构底座]
    
    %% 架构底座 - 主流程
    B --> C[网络防护层]
    C --> D[业务分发层]
    D --> E[结果处理层]
    E --> F[响应返回客户端]
    
    %% 网络防护层细节
    subgraph C [网络防护层]
        C1[过滤/拦截网络攻击]
        C2[记录 begin_at]
        C3[记录 IP/请求头/流量]
        C1 --> C2 --> C3
    end
    
    %% 业务分发层细节
    subgraph D [业务分发层]
        D1[记录 begin_biz_at]
        D2[URI 路由映射]
        D3[请求分发]
        D1 --> D2 --> D3
    end
    
    %% 结果处理层细节
    subgraph E [结果处理层]
        E1[记录 done_biz_at]
        E2[处理响应结果]
        E3[耗时统计]
        E1 --> E2 --> E3
    end
    
    %% 日志组件
    G[日志与统计组件<br>分析统计/日志留存]
    C -.-> G
    D -.-> G
    E -.-> G
    
    %% 业务分发到微服务
    D --> H
    D --> I
    D --> J
    D --> K
    
    %% 微服务定义
    H[stbiz_订单服务<br>Python/PHP]
    I[stbiz_库存服务<br>Python/PHP]
    J[stbiz_财务服务<br>Python/PHP]
    K[stbiz_其他服务<br>Python/PHP]
    
    %% 微服务返回结果
    H --> E
    I --> E
    J --> E
    K --> E
    
    %% 微服务间通信
    H <--> I
    I <--> J
    J <--> K
    K <--> H
    
    %% 样式定义
    classDef baseLayer fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef appLayer fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef logLayer fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class C,D,E baseLayer
    class H,I,J,K appLayer
    class G logLayer
    
    %% 数据流注释
    linkStyle 0 stroke:#009688,stroke-width:2px
    linkStyle 1 stroke:#009688,stroke-width:2px
    linkStyle 2 stroke:#009688,stroke-width:2px
    linkStyle 3 stroke:#009688,stroke-width:2px
    linkStyle 4 stroke:#ff9800,stroke-width:2px
    linkStyle 5 stroke:#ff9800,stroke-width:2px
    linkStyle 6 stroke:#ff9800,stroke-width:2px
    linkStyle 7 stroke:#ff9800,stroke-width:2px
    linkStyle 8 stroke:#4caf50,stroke-width:2px
    linkStyle 9 stroke:#4caf50,stroke-width:2px
    linkStyle 10 stroke:#4caf50,stroke-width:2px
    linkStyle 11 stroke:#4caf50,stroke-width:2px
    linkStyle 12 stroke:#9c27b0,stroke-width:1px,stroke-dasharray:5 5
    linkStyle 13 stroke:#9c27b0,stroke-width:1px,stroke-dasharray:5 5
    linkStyle 14 stroke:#9c27b0,stroke-width:1px,stroke-dasharray:5 5
    linkStyle 15 stroke:#9c27b0,stroke-width:1px,stroke-dasharray:5 5
```

2. 前端架构图

```mermaid
graph TD
    A[用户访问层] --> B[主框架层 - React]
    
    subgraph B [主框架层]
        B1[应用容器]
        B2[路由管理器]
        B3[权限控制器]
        B4[动态菜单系统]
    end
    
    B --> C[微前端集成层]
    
    subgraph C [技术栈无关集成]
        C1[模块联邦]
        C2[Web Components包装器]
        C3[Vue组件集成 - Veaury]
    end
    
    C --> D[业务领域层]
    
    subgraph D [独立部署的微应用]
        D1[商品库存管理]
        D2[销售订单管理]
        D3[新业务领域]
    end
    
    B --> E[无头架构层]
    
    subgraph E [逻辑与UI分离]
        E1[TanStack Query/Refine]
        E2[业务逻辑层]
        E3[状态管理]
        E4[API客户端]
    end
    
    E --> F[UI渲染层]
    
    subgraph F [双模式渲染]
        F1[传统编程模式]
        F2[低代码渲染模式]
        F3[amis渲染引擎]
    end
    
    G[低代码设计器] --> F
    H[动态配置API] --> B
    H --> C
```