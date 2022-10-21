import { APIConfig, ObjectLiteral } from './shared/tsdk-helper';
import { RequestConfig } from './axios';
declare let handler: (
  apiConfig: APIConfig,
  requestData: any,
  requestConfig?: RequestConfig<any> | ObjectLiteral,
  needTrim?: boolean
) => Promise<any>;
export declare function setHandler(_handler: typeof handler): void;
export declare function getHandler(): (
  apiConfig: APIConfig,
  requestData: any,
  requestConfig?: ObjectLiteral | RequestConfig<any> | undefined,
  needTrim?: boolean | undefined
) => Promise<any>;
/**
 * Generate API
 *
 * @param apiConfig - {@link APIConfig}
 *
 * @example
 * ```ts
 * const apiDemo = genApi<ApiDemoReqPayload, ApiDemoResData>(ApiDemoConfig);
 * ```
 */
export default function genAPICall<ReqPayload, ResData>(
  apiConfig: APIConfig
): {
  (
    data: ReqPayload,
    requestConfig?: RequestConfig<ReqPayload> | ObjectLiteral,
    needTrim?: boolean
  ): Promise<ResData>;
  config: APIConfig;
};
export {};
