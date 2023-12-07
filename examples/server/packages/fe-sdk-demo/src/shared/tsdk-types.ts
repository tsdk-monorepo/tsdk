import { z } from 'zod';
export interface APIConfig {
  /** The API type. Like: user side or admin side, required. */
  type: string;
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
  description: string;
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
