import * as z from 'zod';

export const hasBodyMethods: { [key: string]: boolean | undefined } = {
  post: true,
  put: true,
  patch: true,
};

export function checkMethodHasBody(method: string) {
  return hasBodyMethods[method.toLowerCase()];
}

export const ProtocolTypes = {
  request: 'REQ:',
  response: 'RES:',
  set: 'SET:',
};

export interface RequestInfo {
  /** user or admin? */
  type: string;
  username?: string;
  userId?: number;
  token?: string;
}

export type ReadonlyRequestInfo = Readonly<RequestInfo>;

export interface APIConfig {
  /** The API type. Like: user side or admin side, default is user. */
  type?: 'user' | 'admin' | 'common';
  /** The API path */
  path: string;
  method: 'get' | 'post' | 'head' | 'put' | 'delete' | 'options' | 'patch';
  /** Request data validate scheme */
  schema?: z.ZodTypeAny;
  /** The API need auth? Default is false */
  needAuth?: boolean;
  /** The API disabled? Default is false */
  disabled?: boolean;
  /** The API description */
  description?: string;
  /** The API category */
  category?: string;

  /** custom headers for client */
  headers?: { [key: string]: any };
  /** is params in url,
   * default undefined
   * if `:`, will support `/api/:a/b/:c`,
   * if `{}`, will support `/api/{a}/b/{c}`,
   * and will replace with data with {a: 1, c: 2} to `/api/1/b/2`  */
  paramsInUrl?: ':' | '{}';
  isGet?: boolean;
}

/**
 * The `methods` sort order should same with
 * `packages/tsdk-server-adapters/src/socket.io-adapter.ts`
 */
const methods = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options'];
const methodsMap: { [key: string]: number } = {};
methods.forEach((i, idx) => {
  methodsMap[i] = idx;
});

let ID = 0;

/**
 * Generates a unique ID for API requests based on HTTP method and path
 * @param method - HTTP method (get, post, etc.)
 * @param path - API endpoint path
 * @returns A unique string identifier
 */
export function getID(method: string, path: string): string {
  const lowCaseMethod = method.toLowerCase();
  const methodIdx = methodsMap[lowCaseMethod];

  // Add error handling for invalid methods
  if (methodIdx === undefined) {
    throw new Error(`Invalid method: ${method}. Valid methods are: ${methods.join(', ')}`);
  }

  return `${methodIdx}:${path}:${++ID}${
    Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(-4)
  }`;
}
