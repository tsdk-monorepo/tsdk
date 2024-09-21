import type { RequestConfig as AxiosRequestConfig } from './axios';
import { NoHandlerError } from './error';
import { APIConfig, ObjectLiteral } from './shared/tsdk-helper';
import type { XiorRequestConfig } from './xior';

type RequestConfig<T> = AxiosRequestConfig<T>;

let handler = (
  apiConfig: APIConfig,
  requestData: any,
  requestConfig?: any | RequestConfig<any> | ObjectLiteral | XiorRequestConfig<any>
): Promise<any> => {
  return Promise.reject(new NoHandlerError(`Call \`setHandler\` first`));
};

/**
 * @example
 * ```ts
 *  setAxiosInstance(axios.create())
    setSocketIOInstance(io());

    setHandler(axiosHandler);
    setHandler(socketIOHandler);
 * ```
 * @param _handler
 */
export function setHandler(_handler: typeof handler) {
  handler = _handler;
}

export function getHandler() {
  return handler;
}

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
  (data: ReqPayload, requestConfig?: RequestConfig<ReqPayload> | ObjectLiteral): Promise<ResData>;
  config: APIConfig;
} {
  function APICall(
    data: ReqPayload,
    requestConfig?: RequestConfig<ReqPayload> | ObjectLiteral,
    customHandler?: typeof handler
  ): Promise<ResData> {
    return (customHandler ? customHandler : getHandler())(apiConfig, data, requestConfig);
  }

  // now you can access the config with api
  // without another import
  APICall.config = apiConfig;

  return APICall;
}
