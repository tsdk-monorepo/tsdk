import { z } from 'zod';

import { transformPath, APIConfig, ObjectLiteral } from '../../../shared/tsdk-helper';

/**
 * Test path params ({@link APIConfig})
 * @category test
 */
export const TestPathParamsConfig: APIConfig = {
  type: 'user',
  method: 'get',
  path: transformPath('TestPathParams') + '/:a/b/:c',
  description: 'Test path params',
  category: 'test',
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
