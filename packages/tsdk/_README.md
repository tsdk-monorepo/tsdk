# tsdk

Move Fast and Break Nothing.
End-to-end typesafe APIs development.
Share code easy between projects.

包含以下几个部分：

- 接口定义：Path, Method, Request Payload Type, Request Payload Validation，Response data Type, Desc
- 将接口定义封装成调用函数
- 将以上打包模块，并导出文档，提供给前端

接口定义扩展：接口描述 desc，接口分类 category，接口是否需要登录 needAuth

### 改进之前版本

- 脚本改进（逻辑更清晰）
- 写法改进（减少低级错误）：config 的 validate schema 分更细：paramsSchema 和 schema，同时效验 get 时不应该有不必要的 schema
- 前端的 SDK 里面的 fetch 封装，配置更少，使用更加人性化

### Todo

- [x] tsdk 发布到 npm
- [x] 新项目运行成功
- [ ] 真实项目运行一段时间改进
- [ ] tsdk 漂亮文档

- [ ] sdk 文档构建
- [ ] sdk 发布（主要是利用 github 私库发布方案，同时提供另一个私有服务部署的方案）
- [ ] sdk 文档发布展示方案

- [x] add `build-sdk` to scripts
- [x] tsdk 脚本 sync 调用改为异步版本(部分暂时不弄)
- [x] 修复 syncSharedFiles 生成路径错误
- ~~[ ] tsdk 脚本优化：每步 try catch，错误信息提供~~
- [ ] `nestjs/cli` 在 example 中使用
- [ ] `tsdk` 支持 `nestjs/cli` 打包成一个文件

### 目前缺点

- apiconf 不能有重复命名
- 需要 snippet 写 apiconf，多加一个 CRUD 比较全的命令生成？
- entity / apiconf 不能有额外引入，尤其是 entity 需要按推荐格式写

### 文档规划

- 介绍
- features
- 使用指南
  - express / fastify / nestjs
  - with zod / yup
  - with typeorm
- 包发布说明
- FAQ
- 缺点
- troubleshooting
