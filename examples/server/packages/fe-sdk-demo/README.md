# Get Started

This is the `fe-sdk-demo` documentation.

### Setup

```ts
import {
  setHandler,
  setSocketIOInstance,
  socketIOHandler,
  setAxiosInstance,
  axiosHandler,
  getHandler,
} from 'fe-sdk-demo';
import type { QueryTodoRes } from 'fe-sdk-demo/lib/apiconf-refs';
import { QueryTodo } from 'fe-sdk-demo/lib/user-api';
import { io as SocketIO } from 'socket.io-client';

const apiType = 'user';
const baseURL = 'https://example.com';
const socketURL = baseURL;
const apiURL = `${baseURL}/api/${apiType}`;

// use HTTP protocol
setAxiosInstance(axios.create({ baseURL: apiURL }));
setHandler(axiosHandler);

// Usage
(async function run() {
  const res = await QueryTodo({});
  console.log(res);
})();

// or use socket.io protocol
const io = SocketIO(socketURL, {
  transports: ['websocket'],
  query: {
    type: apiType,
  },
});
setSocketIOInstance(io);
setHandler(socketIOHandler);

io.on('connect', async function () {
  // Usage
  const res = await QueryTodo({});
  console.log(res);
});
```

### API Reference

- [user APIs](/modules/user_api)
