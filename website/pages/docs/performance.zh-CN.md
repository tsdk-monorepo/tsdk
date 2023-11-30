# 性能压测

创建 2000 个接口，对 `express`，`hono`，`tsdk-express-adapter`，`tsdk-hono-adapter` 以及 trpc 的 `express adapter` 进行压力测试。


### 测试条件
- 使用的压测工具 plow：
  https://github.com/six-ddc/plow

- 压测环境：家庭局域网
- 服务运行硬件：OrangePI 5 Plus
- 压测硬件：Macbook M1 Pro


### 单核测试结果：

> RPS = Requests Per Second, 每秒请求数。越高越好

| Service              | RPS      | Elapsed | Count | 2xx   | Reads     | Writes    |
| -------------------- | -------- | ------- | ----- | ----- | --------- | --------- |
| Hono                 | 2440.637 | 30s     | 73228 | 73228 | 0.508MB/s | 0.186MB/s |
| Trpc Express Adapter | 2360.502 | 30s     | 70817 | 70817 | 0.554MB/s | 0.180MB/s |
| tsdk Express Adapter | 2207.844 | 30s     | 66240 | 66240 | 0.596MB/s | 0.169MB/s |
| tsdk Hono Adapter    | 2106.088 | 30s     | 63188 | 63188 | 0.438MB/s | 0.161MB/s |
| Express              | 584.828  | 30s     | 17547 | 17547 | 0.158MB/s | 0.045MB/s |

![tsdk-bench-result](./assets/tsdk-bench-result.jpg)

### 多核测试结果(8 核)

> 使用 `pm2 start app.js -i max` 运行

| Service        | RPS      | Elapsed | Count  | 2xx   | Reads     | Writes    |
| -------------- | -------- | ------- | ------ | ----- | --------- | --------- |
| tsdk Hono      | 2420.152 | 30s     | 72609  | 72609 | 0.504MB/s | 0.185MB/s |
| tsdk Express   | 2413.334 | 30s     | 72403  | 72403 | 0.652MB/s | 0.184MB/s |
| Trpc Express   | 2233.697 | 30s     | 67011  | 67011 | 0.525MB/s | 0.171MB/s |
| Hono           | 2077.162 | 30s     | 62317  | 62317 | 0.432MB/s | 0.159MB/s |
| Express        | 1901.312 | 30s     | 57049  | 57049 | 0.514MB/s | 0.145MB/s |

![tsdk-bench-result-cluster](./assets/tsdk-bench-result-cluster.jpg)


### 代码

https://github.com/tsdk-monorepo/tsdk/tree/main/packages/bench


