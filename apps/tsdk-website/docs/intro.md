---
title: 介绍
description: TypeScript 项目代码共享和 API 自动生成导出的工具。
sidebar_position: 1
slug: /
---

`tsdk` 让你将 TypeScript 项目的代码和类型，分享给其他 `TypeScript` / `JavaScript` 项目，以及按照 `tsdk 规范` 生成 API 调用，提升开发效率。

## 特点

- **API 生成** 按照 `tsdk` 的规范编写 API，将可以一个命令生成前端的 API 调用
- **代码分享** 将当前项目内需要共用的代码，同步到分享模块作为一个包发布
- **nest-cli 打包单文件** `nest-cli` 是一个不错的开发打包工具，但是目前打包仅使用 `tsc` 编译每个文件，而 `tsdk` 让其可以将引用的文件打包成单一文件（不包括`node_modules`模块）
- **体积小** [![install size](https://packagephobia.com/badge?p=tsdk)](https://packagephobia.com/result?p=tsdk)
- **内置文档** 良好的团队协作开发，需要优秀的文档，`tsdk` 生成的分享模块内置 [Docusaurus 2](https://docusaurus.io/)

## 快速开始

```bash
npx tsdk --init
```

使用该命令初始化 `tsdk` 配置，将会在当前文件夹生成 [`.tsdkrc`](/docs/configuration) 配置：

```JSON
{
  "packageDir": "packages/",
  "packageName": "@SCOPE-NAME/fe-sdk",
  "baseDir": "./src",
  "entityLibName": "typeorm",
  "entityExt": "entity",
  "apiconfExt": "apiconf",
  "swr": true,
  "sharedDirs": ["./src/shared"],
  "sdkWhiteList": [""]
}
```

我们需要将 `@SCOPE-NAME` 更新为自己的作用域。如果你的源码文件目录 `baseDir` 是在 `src`，那么其他选项保持默认即可。

接下来，在项目根目录，使用以下命令，创建 `packages/fe-sdk`，将 `*.entity.ts` / `*.apiconf.ts` / `sharedDirs`目录列表，同步到 `packages/fe-sdk/src` 文件夹。

```bash
npx tsdk --sync
```

### 简单示例

假如我们有这样的服务：

```ts
// server.ts
import express from "express";
const app = express();

app.get("/", function (req, res) {
  res.send({
    msg: "Hello " + req.query.name,
  });
});

app.listen(3000);
```

我们写的 `API配置` 将会是这样：

```ts
// VisitIndex.apiconf.ts

// 引用路径 `/src` 是自定义配置的 path alias
import { APIConfig } from "/src/shared/tsdk-helper";

export const VisitIndexConfig: APIConfig = {
  path: "/",
  method: "get",
  name: "VisitIndex",
  category: "normal",
  type: "common",
};

export type VisitIndexReq = { name: string };

export type VisitIndexRes = {
  msg: string;
};
```

`server.ts` 改成这样：

```ts
// server.ts
import express from "express";
import {
  VisitIndexConfig,
  VisitIndexReq,
  VisitIndexRes,
} from "./VisitIndex.apiconf.ts";

const app = express();

app[VisitIndexConfig.method](VisitIndexConfig.path, function (req, res) {
  const query: VisitIndexReq = req.query;
  const result: VisitIndexRes = {
    msg: "Hello " + query.name,
  };
  res.send(result);
});

app.listen(3000);
```

虽然改动后的代码比原本的多了一些，但是我们得到的好处很多：

- 生成可直接调用的类型安全的模块；
- `*.apiconf.ts` 的 `method` + `path` 可组装成权限管理的原子权限，不需要再自定义`code`；
- 我们还可以再加上 `zod` 效验，同一个效验逻辑，写一遍即可；
- 还可以加上是否需要登录字段，批量生成接口是否需要登录检查的测试代码；
- 写一个 websocket 适配器，无缝从`http协议`切换为`websocket协议`；
- ......

再调用 `npx tsdk --sync`，会将 `VisitIndex.apiconf.ts` 打包。

我们发布模块后安装，这样使用：

```ts
import { VisitIndex } from "@SCOPE-NAME/fe-sdk/lib/user-api";

VisitIndex({ name: "World" });
```

### 发布模块 `packages/fe-sdk`

你可以将 `packages/fe-sdk` 发布到 [GitHub Packages](https://docs.github.com/en/packages) / npm / 私有服务等。

其他需要依赖该包的项目，安装即可。
