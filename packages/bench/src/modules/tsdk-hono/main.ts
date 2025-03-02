import { serve } from '@hono/node-server';
import { Hono, HonoRequest } from 'hono';
import { honoAdapterFactory } from 'tsdk-server-adapters/lib/hono-adapter';
// import { honoAdapterFactory } from 'tsdk-server-adapters/esm/hono-adapter';

import { setupHelloAPI } from './Hello.api';
import { RequestInfo, routeBus } from './gen-route';

import { checkMethodHasBody } from '@/src/shared/tsdk-helper';

const port = 3016;

const app = new Hono();

app.get('/', (c) => {
  return c.text('hi, from hono.');
});

app.all(
  '/api/:type/*',
  honoAdapterFactory<RequestInfo>({
    routeBus,
    async getReqInfo(req: HonoRequest) {
      return {
        ip: '',
        lang: 'zh-CN',
        type: (req.param() as { type: string }).type,
        token: req.header['authorization'],
      };
    },
    getType(reqInfo) {
      return reqInfo.type;
    },
    async getData(req) {
      return checkMethodHasBody(req.method) ? req.raw.body : req.query();
    },
  })
);

setupHelloAPI();

serve({
  fetch: app.fetch,
  port,
});

console.log(`tsdk hono server running at http://localhost:${port}`);
