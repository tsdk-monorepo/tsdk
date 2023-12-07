import { AxiosRequestConfig, AxiosInstance } from 'axios';

import { NoHandlerError } from './error';
import { pathParams } from './path-params';
import { APIConfig, checkMethodHasBody, trimAndRemoveUndefined } from './shared/tsdk-helper';

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
 * @param instance - AxiosInstance
 * @returns The AxiosInstance
 */
export const getAxiosInstance = () => {
  return axiosInstance;
};

export type RequestConfig<ReqPayload> = Omit<AxiosRequestConfig, 'data'> & {
  data?: ReqPayload;
};

export async function axiosHandler(
  apiConfig: APIConfig,
  requestData: any,
  requestConfig?: RequestConfig<any>,
  /** remove fields with undefined */
  needTrim?: boolean
) {
  const axiosInstance = getAxiosInstance();
  if (!axiosInstance) {
    throw new NoHandlerError(`Call \`setAxiosInstance\` first`);
  }
  const { path, headers, paramsInUrl } = apiConfig;
  const method = apiConfig.method.toLowerCase();

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
    const data = needTrim ? trimAndRemoveUndefined(requestData) : requestData;
    if (checkMethodHasBody(method)) {
      payload.data = data;
      if (requestConfig?.params) {
        payload.params = requestConfig.params;
      }
    } else {
      payload.params = requestConfig?.params ? { ...requestConfig.params, ...data } : data;
    }
  }
  if (requestData && paramsInUrl) {
    payload.url = pathParams(path, requestData, paramsInUrl);
  }

  const { data } = await axiosInstance.request(payload);
  return data;
}
