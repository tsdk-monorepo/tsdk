import { transformPath, APIConfig } from '@/src/tsdk-shared/helpers';

/**
 * get server configs for client ({@link APIConfig})
 * @category core
 */
export const GetConfigsConfig: APIConfig = {
  type: 'common',
  category: 'test',
  method: 'get',
  path: transformPath('GetConfigs'),
};
/**
 *
 * @category core
 */
export type GetConfigsReq = undefined;

/**
 *
 * @category core
 */
export type GetConfigsRes = {
  socketURL: string;
};
// --------- GetConfigs END ---------
