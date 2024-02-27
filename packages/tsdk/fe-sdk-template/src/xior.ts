import { XiorRequestConfig as _XiorRequestConfig, xior } from 'xior';

import { NoHandlerError } from './error';
import { pathParams } from './path-params';
import { APIConfig, checkMethodHasBody, trimAndRemoveUndefined } from './shared/tsdk-helper';

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
 * @param instance - XiorInstance
 * @returns The XiorInstance
 */
export const getXiorInstance = () => {
  return xiorInstance;
};

export type XiorRequestConfig<ReqPayload> = Omit<_XiorRequestConfig, 'data'> & {
  data?: ReqPayload;
};

export async function xiorHandler(
  apiConfig: APIConfig,
  requestData: any,
  requestConfig?: XiorRequestConfig<any>,
  /** remove fields with undefined */
  needTrim?: boolean
) {
  const xiorInstance = getXiorInstance();
  if (!xiorInstance) {
    throw new NoHandlerError(`Call \`setXiorInstance\` first`);
  }
  const { path, headers } = apiConfig;
  const method = apiConfig.method.toLowerCase();

  const payload: _XiorRequestConfig = {
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
  if (requestData && (apiConfig as any).paramsInUrl) {
    payload.url = pathParams(path, requestData, (apiConfig as any).paramsInUrl);
  }

  const { data } = await xiorInstance.request(payload);
  return data;
}
