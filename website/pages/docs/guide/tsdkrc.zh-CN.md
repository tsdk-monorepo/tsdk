## `.tsdkrc`

在执行完初始化命令后，tsdk 会在当前文件夹生成 `.tsdkrc` 配置文件，内容如下：

```json
{
  "packageDir": "packages/",
  "packageName": "fe-sdk",
  "baseDir": "./src",
  "entityLibName": ["typeorm", "kysely"],
  "entityExt": "entity",
  "apiconfExt": "apiconf",
  "shareExt": "shared",
  "sharedDirs": ["./src/shared"],
  "sdkWhiteList": [""],
  "monorepoRoot": "./",
  "axiosVersion": "1.6.2"
}
```

## 字段说明

- `packageDir` - 导出模块到哪个文件夹
- `packageName` - 导出的模块名称
- `entityLibName` - ORM 模块，目前支持 `TypeORM` 和 `kysely`
- `entityExt` - ORM 数据库表模块文件扩展，默认 `*.entity.ts`
- `apiconfExt` - API 配置文件扩展，默认 `*.apiconf.ts`
- `shareExt` - 共享文件名扩展，默认 `*.shared.ts`
- `sharedDirs` - 共享文件夹，默认 `["./src/shared"]`
- `sdkWhiteList` - 白名单文件夹，同步代码的时候不删除对应的文件夹
- `monorepoRoot` - monorepo 根路径，默认当前路径 `./`
- `axiosVersion` - 自定义 axios 版本号，默认最新 `1.6.2`
- `dataHookLib` - 可选值有 `SWR` | `ReactQuery`，生成 `SWR` 或者 `React Query` 钩子；get 方法的接口将生成获取钩子，非 get 的将生成更新钩子。默认不生成
- `swrVersion` - 可选值，**SWR** 的版本，默认 `^2.2.4`
- `reactQueryVersion` - 可选值，**@tanstack/react-query** 的版本，默认 `^5.8.4`
- `kyselyVersion` - 可选值，**kysely** 的版本，默认 `^0.26.3`

### packageDir

`packageDir` - 导出模块到哪个文件夹

### packageName

`packageName` - 导出的模块名称

### entityLibName

`entityLibName` - ORM 模块，目前支持 `TypeORM` 和 `kysely`

### entityExt

`entityExt` - ORM 数据库表模块文件扩展，默认 `*.entity.ts`

### apiconfExt

`apiconfExt` - API 配置文件扩展，默认 `*.apiconf.ts`

### shareExt

`shareExt` - 共享文件名扩展，默认 `*.shared.ts`

### sharedDirs

`sharedDirs` - 共享文件夹，默认 `["./src/shared"]`

### sdkWhiteList

`sdkWhiteList` - 白名单文件夹，同步代码的时候不删除对应的文件夹

### monorepoRoot

`monorepoRoot` - monorepo 根路径，默认当前路径 `./`

### axiosVersion

`axiosVersion` - 自定义 **axios** 版本号，默认 `1.6.2`

### dataHookLib

`dataHookLib` - 可选值有 `SWR` | `ReactQuery`，生成 `SWR` 或者 `React Query` 钩子；get 方法的接口将生成获取钩子，非 get 的将生成更新钩子。默认不生成

### swrVersion

`swrVersion` - 可选值，**SWR** 的版本，默认 `^2.2.4`

### reactQueryVersion

`reactQueryVersion` - 可选值，**@tanstack/react-query** 的版本，默认 `^5.8.4`

### kyselyVersion

`kyselyVersion` - 可选值，**kysely** 的版本，默认 `^0.26.3`
