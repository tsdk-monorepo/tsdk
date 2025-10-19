import { z } from 'zod/v4';

import { transformPath, APIConfig } from '@/src/tsdk-shared/helpers';

/**
 * Test path params ({@link APIConfig})
 * @category test
 */
export const TestPathParamsConfig: APIConfig = {
  type: 'user',
  method: 'get',
  path: transformPath('TestPathParams') + '/:a/b/:c',
  paramsInUrl: ':',
};
/**
 *
 * @category test
 */
export type TestPathParamsReq = {
  a: number;
  c: string;
};

/**
 *
 * @category test
 */
export type TestPathParamsRes = {
  a: number;
  c: string;
};
// --------- TestPathParams END ---------
