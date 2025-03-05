// @ts-ignore
import { XiorRequestConfig as _XiorRequestConfig, Xior as xior } from 'xior';
import { NoHandlerError } from './error';
import { pathParams } from './path-params';
import { APIConfig, checkMethodHasBody } from './shared/tsdk-helper';

let xiorInstance: xior;

/**
 * Set the XiorInstance
 *
 * @param instance - XiorInstance
 */
export const setXiorInstance = (instance: xior): void => {
  xiorInstance = instance;
};

/**
 * Get the XiorInstance
 *
 * @returns The XiorInstance
 */
export const getXiorInstance = (): xior => {
  return xiorInstance;
};

export type XiorRequestConfig<ReqPayload> = Omit<_XiorRequestConfig, 'data'> & {
  data?: ReqPayload;
};

/**
 * Handler for making HTTP requests using Xior
 *
 * @param apiConfig - API configuration including path, method, and headers
 * @param requestData - Request payload data
 * @param requestConfig - Optional Xior-specific request configuration
 * @returns Promise resolving to the response data
 */
export async function xiorHandler(
  apiConfig: APIConfig,
  requestData: any,
  requestConfig?: XiorRequestConfig<any>
): Promise<any> {
  const instance = getXiorInstance();
  if (!instance) {
    throw new NoHandlerError(`Call \`setXiorInstance\` first`);
  }

  const { path, headers, isGet, onRequest, onResponse } = apiConfig;
  const method = apiConfig.method.toLowerCase();

  // Apply onRequest hook if available
  if (onRequest) {
    requestData = await onRequest(requestData);
  }

  const payload: _XiorRequestConfig = {
    method: method === 'patch' ? method.toUpperCase() : method,
    url: path,
    isGet,
    ...requestConfig,
  };

  if (headers) {
    payload.headers = {
      ...payload.headers,
      ...headers,
    };
  }

  if (requestData) {
    if (checkMethodHasBody(method)) {
      payload.data = requestData;
      if (requestConfig?.params) {
        payload.params = requestConfig.params;
      }
    } else {
      payload.params = requestConfig?.params
        ? { ...requestConfig.params, ...requestData }
        : requestData;
    }
  }

  if (requestData && 'paramsInUrl' in apiConfig) {
    payload.url = pathParams(path, requestData, (apiConfig as any).paramsInUrl);
  }

  const { data } = await instance.request(payload);

  // Apply onResponse hook if available
  return onResponse ? await onResponse(data) : data;
}
