import * as z from 'zod';

export const APITypes = {
  user: 'user',
  admin: 'admin',
  common: 'common',
} as const;

export const APITypesKey = Object.keys(APITypes).filter((item) => item !== APITypes.common);

export type APIType = keyof typeof APITypes;

export interface APIConfig {
  /** The API type. Like: user side or admin side. */
  type: APIType;
  /** The API path */
  path: string;
  method: 'get' | 'post' | 'delete' | 'put' | 'patch' | 'head' | 'options';
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
  isGet?: boolean;
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
