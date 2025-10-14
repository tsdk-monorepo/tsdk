# tsdk 教程

## 安装与初始化项目

首先你要有一个 typescript 项目，然后运行如下命令初始化：

`npx tsdk --init`

## 快捷创建项目

如果你想要一个齐全的脚手架：git clone xxx.com
如果你想要一个轻量级的脚手架：git clone xxx.com

typeorm: todo
drizzle-orm: todo

fastify: todo
koa: todo
express: todo
hono: todo

## 写服务端插件

## 认识 接口配置（\*.apiconf）

## 认识 cli 文件配置（tsdk.config.js）

## 写后端接口

## 写单元测试

## 写 E2E 测试

## 导出前端接口模块

```ts
import { genRouteFactory, getRouteEventName, Protocol } from 'tsdk-server-adapters';
import { TypeORMError, EntityNotFoundError } from 'typeorm';
import type { StandardSchemaV1 } from '@standard-schema/spec';

export const APITypes = {
  user: 'user',
  admin: 'admin',
  common: 'common',
} as const;
export const APITypesKey = Object.keys(APITypes).filter((item) => item !== APITypes.common);
export type APIType = keyof typeof APITypes;
/** import { APIConfig } from '@/src/shared/tsdk-types'; */
export interface APIConfig {
  /** The API type, such as user-side or admin-side. Default is `user`. */
  type?: APIType;
  /** The API path. */
  path: string;
  /** The HTTP method. */
  method: 'get' | 'post' | 'delete' | 'put' | 'patch' | 'head' | 'options';
  /** Request data validation schema. */
  schema?: StandardSchemaV1;
  /** Does the API require authentication? Default is `false`. */
  needAuth?: boolean;
  /** Is the API disabled? Default is `false`. */
  disabled?: boolean;
  /** Custom headers for the client. */
  headers?: { [key: string]: any };
  /**
   * Are parameters included in the URL? Used for generating API SDK-based documentation.
   * Default is `undefined`.
   * - If `':'`, supports `/api/:a/b/:c`.
   * - If `'{}'`, supports `/api/{a}/b/{c}`.
   * Parameters will be replaced with data, e.g., `{ a: 1, c: 2 }` → `/api/1/b/2`.
   */
  paramsInUrl?: ':' | '{}';
  /** Force the API to be treated as a data-fetching request,
   * useful when backend APIs use `POST` for all requests. */
  isGet?: boolean;
  /** Hook to process data before sending the request. */
  onRequest?: (data: any) => any | Promise<any>;
  /** Hook to process data after receiving the response. */
  onResponse?: (response: any) => any | Promise<any>;
}

/**
 * import { ProtocolTypes } from '@/src/shared/tsdk-helper';
 */
export const ProtocolTypes = {
  request: 'REQ:',
  response: 'RES:',
  set: 'SET:',
};

export interface GeneralParams {
  ip: string;
  lang: string;
}

export interface RequestInfo extends GeneralParams {
  /** user or admin? */
  type: string;
  username?: string;
  userId?: number;
  token?: string;
}

export type ReadonlyRequestInfo = Readonly<RequestInfo>;

const middlewares = [getLanguageMiddleware, checkAuthMiddleware];
export const genRouteObj = genRouteFactory<APIConfig, RequestInfo>(
  onErrorHandler,
  ProtocolTypes,
  middlewares
);

export const routeBus = genRouteObj.routeBus;

const genRoute = genRouteObj.genRoute;

export { getRouteEventName, genRoute };
export default genRoute;

function onErrorHandler(
  e: Error,
  { protocol, send, msgId }: Parameters<Parameters<typeof genRouteFactory>[0]>[1]
) {
  if ((e as unknown as StandardSchemaV1.FailureResult)?.issues) {
    return send({
      _id: msgId,
      status: 400,
      result: {
        msg: (e as unknown as StandardSchemaV1.FailureResult).issues,
      },
    });
  }

  let status = 500;
  const msg = e.message;

  if (e instanceof AuthError) {
    status = 401;
  } else if (e instanceof TypeORMError) {
    if (e.name === TypeORMError.name) {
      status = 400;
    } else if (e instanceof EntityNotFoundError) {
      status = 404;
    }
  }
  return send({ _id: msgId, status, result: { msg } });
}

class AuthError extends Error {
  //
}

async function getLanguageMiddleware(
  protocol: Protocol,
  apiConfig: APIConfig,
  reqInfo: RequestInfo
) {
  // parse lang in adapter or here
  // @todo
  // reqInfo.lang = 'zh-CN';
  // if correct, next
  return Promise.resolve();
}

async function checkAuthMiddleware(protocol: Protocol, apiConfig: APIConfig, reqInfo: RequestInfo) {
  if (protocol === 'socket.io' || protocol === 'ws') {
    // only parse once for socket
  }
  if (!apiConfig.needAuth) {
    return Promise.resolve();
  }
  if (!reqInfo.token) {
    return Promise.reject(new AuthError());
  }

  // validate the token now
  // reqInfo.userId = 1;
  // reqInfo.username = 'hi';
  // reqInfo.lang = 'zh-CN';

  // if correct, next
  return Promise.resolve();
}
```
