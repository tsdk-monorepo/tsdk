import { transformPath, APIConfig } from '../../../shared/tsdk-helper';
/**
 * get server configs for client ({@link APIConfig})
 * @category core
 */
export const GetConfigsConfig: APIConfig = {
  type: 'common',
  
  method: 'get',
  path: transformPath('GetConfigs'),
  description: 'get server configs for client',
  category: 'core',
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
