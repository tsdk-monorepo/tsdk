import { setHandler } from 'fe-sdk-demo/esm/gen-api';
import { xiorHandler, setXiorInstance } from 'fe-sdk-demo/esm/xior';
import axios, { XiorError as AxiosError, joinPath } from 'xior';

import APIWorker from './user-api.worker?worker';
import { setWorker } from 'fe-sdk-demo/esm/worker/user-api';

const baseURL =
  // process.env.NODE_ENV === 'production'
  //   ? process.env.BASE_URL
  //   :
  (() => {
    if (typeof document === 'undefined') return 'http://localhost:3012/';
    return (
      window?.location.protocol + '//' + window?.location.host.split(':')[0] + ':' + 3012 + '/'
    );
  })();

const socketURL = baseURL;
const apiURL = joinPath(baseURL, `/api/user`);

if (typeof document !== 'undefined' && typeof Worker !== 'undefined') {
  const myWorker = new APIWorker();
  myWorker.postMessage({ baseURL, apiURL, socketURL });
  setWorker(myWorker);
}

export const http = axios.create({
  baseURL: apiURL,
});

http.interceptors.request.use((config) => {
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    throw new Error((error?.response?.data as { msg: string })?.msg || error?.message);
  }
);

export function setupUserApi() {
  setXiorInstance(http);
  setHandler(xiorHandler);
}
setupUserApi();

export * from 'fe-sdk-demo/esm/worker/user-api';
export * from 'fe-sdk-demo/esm/worker/user-api-hooks';
export * from 'fe-sdk-demo/esm/apiconf-refs';
export * from 'fe-sdk-demo/esm/entity-refs';
export * from 'fe-sdk-demo/esm/shared-refs';
