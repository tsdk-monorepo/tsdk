import type { StandardSchemaV1 } from '@standard-schema/spec';

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
  schema?: StandardSchemaV1;
  /** The API need auth? Default is false */
  needAuth?: boolean;
  /** The API disabled? Default is false */
  disabled?: boolean;

  /** custom headers for client */
  headers?: { [key: string]: any };
  isGet?: boolean;
}
