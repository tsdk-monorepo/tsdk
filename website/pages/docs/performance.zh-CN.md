# 性能压测

这里使用脚本创建 10000 个接口使用 `express` 和 `tsdk-express-adapter`，再进行压力测试，对比并发以及内存占用。

并将使用脚本创建 10000 个接口使用 `hono` 和 `tsdk-hono-adapter`，再进行压力测试，对比并发以及内存占用。

- 使用的压测工具 plow：
  https://github.com/six-ddc/plow

- 服务运行硬件：OrangePI 5 Plus
- 压测硬件：Macbook M1 Pro

## express VS tsdk-express-adapter 压测结果

express 并发性能：

express 内存占用：

tsdk-express-adapter 内存占用：

tsdk-express-adapter 并发性能：

## hono VS tsdk-hono-adapter 压测结果

hono 并发性能：

hono 内存占用：

tsdk-hono-adapter 并发性能：

tsdk-hono-adapter 内存占用：
