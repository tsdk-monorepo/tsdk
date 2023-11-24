/**
 *
 * api-common.ts
 * fe-sdk-demo@1.0.0
 *
 **/

import { GetConfigsConfig, GetConfigsReq, GetConfigsRes } from './apiconf-refs';
import genApi from './gen-api';

/**
 * get server configs for client
 *
 * @category core
 */
export const GetConfigs = genApi<GetConfigsReq, GetConfigsRes>(GetConfigsConfig);
