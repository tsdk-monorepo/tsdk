import * as z from 'zod';
import http from 'http';
import { Server } from 'socket.io';

import { socketIOAdapterFactory } from '../../src/socket.io-adapter';
import genRoute, { routeBus } from './gen-route';
import { ProtocolTypes, RequestInfo } from './utils';

genRoute(
  {
    method: 'get',
    path: '/hello',
    schema: z
      .object({
        a: z.string().optional(),
        b: z.string().optional(),
      })
      .strict(),
  },
  async (data) => {
    return { msg: 'hello get', data };
  }
);
genRoute(
  {
    method: 'post',
    path: '/hello',
    schema: z
      .object({
        a: z.string().optional(),
        b: z.string().optional(),
      })
      .strict(),
  },
  async (data) => {
    return { msg: 'hello post', data };
  }
);

genRoute({ method: 'get', path: '/auth', needAuth: true }, async (data) => {
  return { msg: 'ok', data };
});
genRoute({ method: 'post', path: '/auth', needAuth: true }, async (data) => {
  return { msg: 'ok', data };
});

export const server = http.createServer();
export const io = new Server(server);

io.on('connection', (socket) => {
  const { address, query, headers } = socket.handshake;

  const reqInfo = {
    ip: address,
    token: query.token as string,
    type: query.type as string,
  };

  socket.on('token', (token) => {
    reqInfo.token = token;
  });

  socketIOAdapterFactory<RequestInfo>({
    routeBus,
    getReqInfo() {
      return reqInfo;
    },
    getType(reqInfo) {
      return reqInfo.type;
    },
    getData(data) {
      return data;
    },
    protocolType: ProtocolTypes,
  })(socket);
});
