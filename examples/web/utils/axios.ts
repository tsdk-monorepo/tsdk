import axios, { AxiosRequestConfig } from 'axios';
import { getEnhanceAdapter } from 'axios-enhance-adapter';

const defaultOptions = {
  shouldRetryOnError: () => true,
  errorRetryInterval: 3000,
  errorRetryCount: 3,
  getKey(config: AxiosRequestConfig) {
    const { method, data, params, url } = config;
    const arr = [method, url];
    if (data) {
      arr.push(JSON.stringify(data));
    }
    if (params) {
      arr.push(JSON.stringify(params));
    }
    return arr.join(',');
  },
  checkEnable(config: AxiosRequestConfig) {
    const method = config.method?.toLowerCase();
    const isGet = method === 'get';
    return isGet;
  },
};

export const axiosInstance = axios.create({
  baseURL: `/`,
  adapter: getEnhanceAdapter(defaultOptions),
});

let runAlready = false;
export async function run() {
  if (runAlready) return;
  runAlready = true;

  return Promise.all(
    [1, 2, 3, 4, 5, 6].map((item) =>
      axiosInstance.get('/test', {
        // default
        shouldRetryOnError: () => false,
        errorRetryInterval: 3000,
        errorRetryCount: 3,
        getKey(config: AxiosRequestConfig) {
          const { method, data, params, url } = config;
          const arr = [method, url];
          if (data) {
            arr.push(JSON.stringify(data));
          }
          if (params) {
            arr.push(JSON.stringify(params));
          }
          return arr.join(',');
        },
        checkEnable() {
          return false;
        },
        // only get enable
        // checkEnable(config: AxiosRequestConfig) {
        //   const method = config.method?.toLowerCase();
        //   const isGet = method === 'post';
        //   return isGet;
        // },
      })
    )
  );
}
