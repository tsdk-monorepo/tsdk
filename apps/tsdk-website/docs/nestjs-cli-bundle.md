---
title: nest-cli 打包成单文件
sidebar_position: 5
---

`nest-cli` 是一个不错的 node 应用开发和打包工具。目前为止，`nest-cli` 不支持单文件打包，所以 `tsdk` 增加了该功能。

原理是，将 `nest build xxx` 打包出来的 js 文件，再利用 `webpack` 打包成单文件（不包含`node_modules/*`）。

```bash
# 默认打包
npx tsdk --nest build

# 打包多个
npx tsdk --nest build [nameA] [nameB]

# 打包所有
npx tsdk --nest build all
```

输出文件夹在 `./dist-projects`，同时会将 `package.json` 的 `devDependencies` 字段删除，保存到打包目录。
