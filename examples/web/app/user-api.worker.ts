import { setHandler } from 'fe-sdk-demo/esm/worker/user-api-worker';
import { xiorHandler, setXiorInstance } from 'fe-sdk-demo/esm/xior';
import axios, { XiorError as AxiosError, joinPath } from 'xior';

self.addEventListener('message', (e) => {
  if (!e.data.baseURL) return;
  const baseURL = e.data.baseURL;

  const apiType = 'user';
  const socketURL = baseURL;
  const apiURL = joinPath(baseURL, `/api/${apiType}`);

  const http = axios.create({
    baseURL: apiURL,
    params: { worker: true },
  });

  http.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      throw new Error((error?.response?.data as { msg: string })?.msg || error?.message);
    }
  );

  setXiorInstance(http);
  setHandler(xiorHandler);
});
