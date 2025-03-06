// @ts-ignore
import { AxiosRequestConfig, AxiosInstance } from 'axios';
import { NoHandlerError } from './error';
import { pathParams } from './path-params';
import { APIConfig, checkMethodHasBody } from './shared/tsdk-helper';

let axiosInstance: AxiosInstance;

/**
 * Set the AxiosInstance
 *
 * @param instance - AxiosInstance
 */
export const setAxiosInstance = (instance: AxiosInstance): void => {
  axiosInstance = instance;
};

/**
 * Get the AxiosInstance
 *
 * @returns The AxiosInstance
 */
export const getAxiosInstance = (): AxiosInstance => {
  return axiosInstance;
};

export type RequestConfig<ReqPayload> = Omit<AxiosRequestConfig, 'data'> & {
  data?: ReqPayload;
};

/**
 * Handler for making HTTP requests using Axios
 *
 * @param apiConfig - API configuration including path, method, and headers
 * @param requestData - Request payload data
 * @param requestConfig - Optional Axios-specific request configuration
 * @returns Promise resolving to the response data
 */
export async function axiosHandler(
  apiConfig: APIConfig,
  requestData: any,
  requestConfig?: RequestConfig<any>
): Promise<any> {
  const instance = getAxiosInstance();
  if (!instance) {
    throw new NoHandlerError(`Call \`setAxiosInstance\` first`);
  }

  const { path, headers, onRequest, onResponse } = apiConfig;
  const method = apiConfig.method.toLowerCase();

  // Apply onRequest hook if available
  if (onRequest) {
    requestData = await onRequest(requestData);
  }

  const payload: AxiosRequestConfig = {
    method: method === 'patch' ? method.toUpperCase() : method,
    url: path,
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
