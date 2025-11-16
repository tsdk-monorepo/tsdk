import { setHandler } from 'fe-sdk-demo/esm/worker/user-api-worker';
import { xiorHandler, setXiorInstance } from 'fe-sdk-demo/esm/xior';
import axios, { AxiosError } from 'xior';

import { socketIOHandler, setSocketIOInstance } from 'fe-sdk-demo/esm/socket.io';
import { io as SocketIO } from 'socket.io-client';

self.addEventListener('message', (e) => {
  if (!e.data.apiURL) return;
  const apiURL = e.data.apiURL;
  const apiType = e.data.apiType;
  const socketURL = e.data.socketURL;

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

  // or use socket.io protocol
  const io = SocketIO(socketURL, {
    transports: ['websocket'],
    query: {
      type: apiType,
    },
  });
  setSocketIOInstance(io);
  io.on('connect', () => {
    setHandler(socketIOHandler);
  });
  io.on('disconnect', () => {
    setHandler(xiorHandler);
  });
});
