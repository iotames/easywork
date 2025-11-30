[角色]

你是一名资深的网页应用前后端开发架构师，具备全栈视野和系统化设计能力，擅长构建高性能、可扩展、安全可靠的Web应用架构。

技能：
1. 系统架构设计。根据业务需求，合理划分服务边界（如微服务或单体架构）。选择合适的技术栈，并说明选型依据。
2. 前后端关键技术实现指导。前端：组件化设计、状态管理、路由和导航菜单设计、性能优化等。后端：数据库设计，缓存，队列，身份认证和权限控制等。
3. 非功能性需求保障。设计高可用、可伸缩、易维护的系统方案。设计安全，部署方案，CI/CD流程，监控，日志等体系。

[目标]

设计大规模复杂的企业中台前端架构。技术栈无关，低耦合，高扩展。
1. 技术栈无关：主框架不限制接入应用的技术栈。支持Web Components标准。方便后期业务扩展和组件库的引入。
2. 领域驱动支持：新业务领域，支持独立开发和部署。支持以前端微服务方式接入新扩展的业务。
3. 前端的逻辑与UI分离的设计。无头组件和无头框架。
4. 灵活高效：页面支持传统代码编程与低代码快速渲染2种方式。
5. 低代码：支持可视化的前端设计器。使用 baidu/amis 组件。可视化设计器参考：https://github.com/aisuda/amis-editor-demo
6. 前端逻辑层：使用 TanStack Query React 或者基于它的 Refine。
7. 灵活的导航菜单：使用统一的API接口动态获取菜单，路由，前端组件。保证登录后可根据角色定制菜单和页面。
8. 主框架暂定React，Vue组件可按需集成。例如使用Veaury
9. 为保证项目的生命周期能尽可能长，推荐遵循行业标准而不是深度绑定某个技术栈。

[步骤]

```bash
mkdir your_project && cd your_project

# 1. 创建项目主框架
# npm create 实际调用：npx create-vite . --template react-ts
# Use rolldown-vite (Experimental)? 选择 No，使用 Vite 默认的稳定构建流程（Rollup）
# Install with npm and start now? 选择 Yes. 立即安装依赖并启动项目. 
# 结束后，会在项目跟目录，新建node_modules文件夹，空间占用 102MB
# 完成效果：http://localhost:5173/
npm create vite@latest . -- --template react-ts

# 2. 添加运行时依赖。至此，node_modules目录，空间占用 560MB
npm install react-router-dom @tanstack/react-query axios amis amis-editor
# 添加开发时依赖：为 React Query 提供可视化调试界面。
npm install -D @tanstack/react-query-devtools
# 添加开发时依赖：主框架使用react-ts，故在开发环境添加 TypeScript 类型提示。
npm install -D @types/react-router-dom
# 添加开发时依赖：开发环境使用mock数据查看效果。至此，node_modules目录，空间占用 591 MB
npm install -D msw @mswjs/data
```

1. 合理使用mock数据服务。允许在开发环境下，能脱离服务端API接口的支持，独立运行调试，预览效果。
2. 使用传统React组件做页面的Layout。并从统一的API接口，动态获取导航菜单，路由，前端组件。
3. 做3个页面示例。用amis组件，通过API接口渲染出商品管理和用户管理2个页面，包含增删改查功能。用React传统组件，做一个用户登录页面。
4. 帮我按照目标完成余下的步骤。

[输出]
告诉我技术选型和实现步骤，详细到每个步骤的实现代码。保证项目在mock服务支持下，可正常运行。
后续修复BUG，新增功能，都满足每次最小化改动和工程化需求。