import { setHandler } from 'fe-sdk-demo/esm/gen-api';
import { xiorHandler, setXiorInstance } from 'fe-sdk-demo/esm/xior';
import axios, { XiorError as AxiosError } from 'xior';

const baseURL =
  // process.env.NODE_ENV === 'production'
  //   ? process.env.BASE_URL
  //   :
  (() => {
    if (typeof window === 'undefined') return;
    return (
      window?.location.protocol + '//' + window?.location.host.split(':')[0] + ':' + 3012 + '/'
    );
  })();

const apiType = 'user';
const socketURL = baseURL;
const apiURL = baseURL + `api/${apiType}`;

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

export * from 'fe-sdk-demo/esm/user-api';
export * from 'fe-sdk-demo/esm/user-api-hooks';
export * from 'fe-sdk-demo/esm/apiconf-refs';
export * from 'fe-sdk-demo/esm/entity-refs';
export * from 'fe-sdk-demo/esm/shared-refs';
