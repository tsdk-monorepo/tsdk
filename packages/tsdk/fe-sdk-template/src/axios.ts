import { AxiosRequestConfig, AxiosInstance } from 'axios';

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
  needTrim?: boolean
) {
  const axiosInstance = getAxiosInstance();
  if (!axiosInstance) {
    const msg = new Error(`Call \`setAxiosInstance\` first`);
    throw msg;
  }
  const { path, headers } = apiConfig;
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

  const { data } = await axiosInstance.request(payload);
  return data;
}
