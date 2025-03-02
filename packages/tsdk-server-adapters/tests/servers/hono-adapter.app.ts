import { Hono, HonoRequest } from 'hono';

import { honoAdapterFactory } from '../../src/hono-adapter';
import genRoute, { routeBus } from './gen-route';
import { checkMethodHasBody, RequestInfo } from './utils';

export const app = new Hono();

genRoute({ method: 'get', path: '/hello' }, async (data) => {
  return { msg: 'hello get', data };
});
genRoute({ method: 'post', path: '/hello' }, async (data) => {
  return { msg: 'hello post', data };
});

genRoute({ method: 'get', path: '/auth', needAuth: true }, async (data) => {
  return { msg: 'ok', data };
});
genRoute({ method: 'post', path: '/auth', needAuth: true }, async (data) => {
  return { msg: 'ok', data };
});

app.all(
  '/api/:type/*',
  honoAdapterFactory<RequestInfo>({
    routeBus,
    async getReqInfo(req: HonoRequest) {
      const params = {
        type: (req.param() as { type: string }).type,
        token: req.header('authorization'),
      };
      return params;
    },
    getType(reqInfo) {
      return reqInfo.type;
    },
    async getData(req: HonoRequest) {
      const data = checkMethodHasBody(req.method)
        ? req.header('Content-Type')?.startsWith('application/json')
          ? req.json()
          : req.raw.body
        : req.query();
      return data;
    },
  })
);
