
      
      /** 
       * 
       * api-common.ts 
       * fe-sdk-demo@1.0.0 
       * 
       **/

      import genApi from './gen-api';

      import {
          
          GetConfigsConfig,
          GetConfigsReq,
          GetConfigsRes,
        
        } from './apiconf-refs';
      
      
          /** 
           * get server configs for client
           * 
           * @category core
           */
          export const GetConfigs = genApi<GetConfigsReq, GetConfigsRes>(GetConfigsConfig);
        
    