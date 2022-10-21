import { z } from 'zod';

export interface APIConfig {
  /** The API type. Like: user side or admin side, default is common. */
  type?: string;
  /** The API name */
  name: string;
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
}

/**
 * remove undefined field or trim string value
 *
 * @param data - the object data
 */
export const trimAndRemoveUndefined = (data: ObjectLiteral): ObjectLiteral => {
  const newData: ObjectLiteral = {};
  Object.keys(data).forEach((k: string) => {
    const valueType = typeof data[k];
    if (valueType === 'string') {
      newData[k] = data[k].trim();
    } else if (valueType !== 'undefined') {
      newData[k] = data[k];
    }
  });
  return newData;
};

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
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];
