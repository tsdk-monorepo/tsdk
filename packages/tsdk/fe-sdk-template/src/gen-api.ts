import type { RequestConfig as AxiosRequestConfig } from './axios';
import { NoHandlerError } from './error';
import { APIConfig, ObjectLiteral } from './shared/tsdk-helper';
import type { XiorRequestConfig } from './xior';

// Define a union type for all possible request configuration types
type RequestConfig<T> = AxiosRequestConfig<T> | XiorRequestConfig<T> | ObjectLiteral;

let handler = (
  apiConfig: APIConfig,
  requestData: any,
  requestConfig?: RequestConfig<any>
): Promise<any> => {
  return Promise.reject(new NoHandlerError(`Call \`setHandler\` first`));
};

export type Handler = typeof handler;

/**
 * @example
 * ```ts
 *  setAxiosInstance(axios.create())
 *  setSocketIOInstance(io());
 *
 *  setHandler(axiosHandler);
 *  setHandler(socketIOHandler);
 * ```
 * @param _handler
 */
export function setHandler(_handler: Handler) {
  handler = _handler;
}

export function getHandler(): Handler {
  return handler;
}

/**
 * Generate API
 *
 * @param apiConfig - {@link APIConfig}
 *
 * @example
 * ```ts
 * const apiDemo = genAPICall<ApiDemoReqPayload, ApiDemoResData>(ApiDemoConfig);
 * ```
 */
export default function genAPICall<ReqPayload, ResData>(
  apiConfig: APIConfig
): {
  (
    data: ReqPayload,
    requestConfig?: RequestConfig<ReqPayload>,
    customHandler?: Handler
  ): Promise<ResData>;
  config: APIConfig;
} {
  function APICall(
    data: ReqPayload,
    requestConfig?: RequestConfig<ReqPayload>,
    customHandler?: Handler
  ): Promise<ResData> {
    return (customHandler || getHandler())(apiConfig, data, requestConfig);
  }

  // now you can access the config with api
  // without another import
  APICall.config = apiConfig;

  return APICall;
}

export type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

export type ExpandRecursively<T> = T extends (...args: infer A) => infer R
  ? (...args: ExpandRecursively<A>) => ExpandRecursively<R>
  : T extends object
    ? T extends infer O
      ? { [K in keyof O]: ExpandRecursively<O[K]> }
      : never
    : T;
