import type { RequestConfig } from './axios';
import { APIConfig, ObjectLiteral } from './shared/tsdk-helper';

let handler = (
  apiConfig: APIConfig,
  requestData: any,
  requestConfig?: RequestConfig<any> | ObjectLiteral,
  needTrim?: boolean
): Promise<any> => {
  return Promise.reject({
    msg: `Please call \`setHandler\` first`,
  });
};

export function setHandler(_handler: typeof handler) {
  handler = _handler;
}

export function getHandler() {
  return handler;
}

// example
// setAxiosInstance(axios.create())
// setSocketIOInstance(io());

// setHandler(axiosHandler);
// setHandler(socketIOHandler);

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
} {
  function APICall(
    data: ReqPayload,
    requestConfig?: RequestConfig<ReqPayload> | ObjectLiteral,
    needTrim = true
  ): Promise<ResData> {
    return getHandler()(apiConfig, data, requestConfig, needTrim);
  }

  // now you can access the config with api
  // without another import
  APICall.config = apiConfig;

  return APICall;
}
