## 简介

[xve-admin](https://github.com/xuekang/xve-admin) 是一个后台前端解决方案，它基于 [vue](https://github.com/vuejs/vue) 和 [element-ui](https://github.com/ElemeFE/element)实现。它使用了最新的前端技术栈，动态路由，权限验证，提炼了典型的业务模型，抽象出常用的 CRUD 逻辑，通用数据集配置生成 json 数据，动态生成表单、表格和按钮。

## 📌 功能

✅ 完全由后端配置数据动态渲染前端路由，新增页面时只需新增后台数据配置，前端无需任何理路由配置

✅ 完全由后端配置数据前端权限控制，除了常规的菜单页面权限控制，更是细化到按钮权限控制

✅ 基于 RBAC 模型（role-based-access-control）的通用权限管理模块

✅ 通过后台配置数据自动生成常规的 CRUD 前端管理页面

✅ 通用流程设计和管理，支持行政办公和业务办公流程

✅ 通用流程报表查询

✅ 可按配置自动生表单、表格、按钮，可视化配置生成 crud 页面

✅ 后端接口自动生成可视化的接口文档

## 开发

```bash
# 克隆项目
git clone git@github.com:xuekang/xve-admin.git

# 进入项目目录
cd xve-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

Copyright (c) 2022-present xuekang
