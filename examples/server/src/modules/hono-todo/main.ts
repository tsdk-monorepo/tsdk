import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { honoAdapterFactory } from 'tsdk-server-adapters/lib/hono-adapter';

import { checkMethodHasBody } from '/src/shared/tsdk-helper';
import { initializeDataSources } from '/src/db';

import { setupRoutes } from '../setup-routes';
import { routeBus } from '../todo/gen-route';
import { RequestInfo } from '../todo/types';

const port = 3013;

(async () => {
  await initializeDataSources();

  setupRoutes();

  const app = new Hono();

  app.use('*', cors());

  app.use('*', async (c, next) => {
    c.header('X-Powered-By', 'tsdk');
    await next();
  });

  app.get('/', (c) => {
    return c.text('hi, from hono.');
  });

  app.use(
    '/api/:type',
    honoAdapterFactory<RequestInfo>({
      routeBus,
      getReqInfo(req) {
        return {
          ip: '',
          lang: 'zh-CN',
          type: (req.param() as { type: string }).type,
          token: req.headers.get('authorization'),
        };
      },
      getType(reqInfo) {
        return reqInfo.type;
      },
      getData(req) {
        // maybe decode here?(e.g.: decryption)
        return checkMethodHasBody(req.method) ? req.body : req.query;
      },
    })
  );

  const s = serve({
    fetch: app.fetch,
    port,
  });
})();
