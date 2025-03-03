import * as z from 'zod';

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
  schema?: z.ZodTypeAny;
  /** Does the API require authentication? Default is `false`. */
  needAuth?: boolean;
  /** Is the API disabled? Default is `false`. */
  disabled?: boolean;
  /** A description of the API. */
  description?: string;
  /** The API category. */
  category?: string;
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

export interface ObjectLiteral {
  [key: string]: any;
}

/**
 * Result object returned by InsertQueryBuilder execution.
 */
export declare class InsertResult {
  /**
   * Contains inserted entity id.
   * Has entity-like structure (not just column database name and values).
   */
  identifiers: ObjectLiteral[];
  /**
   * Generated values returned by a database.
   * Has entity-like structure (not just column database name and values).
   */
  generatedMaps: ObjectLiteral[];
  /**
   * Raw SQL result returned by executed query.
   */
  raw: any;
}

export declare class UpdateResult {
  /**
   * Raw SQL result returned by executed query.
   */
  raw: any;
  /**
   * Number of affected rows/documents
   * Not all drivers support this
   */
  affected?: number;
  /**
   * Contains inserted entity id.
   * Has entity-like structure (not just column database name and values).
   */
  /**
   * Generated values returned by a database.
   * Has entity-like structure (not just column database name and values).
   */
  generatedMaps: ObjectLiteral[];
}

/**
 * Result object returned by DeleteQueryBuilder execution.
 */
export declare class DeleteResult {
  /**
   * Raw SQL result returned by executed query.
   */
  raw: any;
  /**
   * Number of affected rows/documents
   * Not all drivers support this
   */
  affected?: number | null;
}

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];
