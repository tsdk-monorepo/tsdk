import type { StandardSchemaV1 } from '@standard-schema/spec';

export const APITypes = {
  user: 'user',
  admin: 'admin',
  common: 'common',
} as const;

export const APITypesKey = Object.keys(APITypes).filter((item) => item !== APITypes.common);

export type APIType = keyof typeof APITypes;
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
