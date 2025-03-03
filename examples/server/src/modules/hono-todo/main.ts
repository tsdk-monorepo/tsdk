import { serve } from '@hono/node-server';
import { Hono, HonoRequest } from 'hono';
import { cors } from 'hono/cors';
import { honoAdapterFactory } from 'tsdk-server-adapters/lib/hono-adapter';
// import { honoAdapterFactory } from 'tsdk-server-adapters/esm/hono-adapter';

import { setupRoutes } from '../setup-routes';
import { routeBus } from '../todo/gen-route';
import { RequestInfo } from '../todo/types';

import { initializeDataSources } from '@/src/db';
import { checkMethodHasBody } from '@/src/shared/tsdk-helper';

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

  app.all(
    '/api/:type/*',
    honoAdapterFactory<RequestInfo>({
      routeBus,
      async getReqInfo(req: HonoRequest) {
        const params = {
          ip: '',
          lang: 'zh-CN',
          type: (req.param() as { type: string }).type,
          token: req.header('authorization'),
        };
        return params;
      },
      getType(reqInfo) {
        return reqInfo.type;
      },
      async getData(req: HonoRequest) {
        if (checkMethodHasBody(req.method)) {
          return req.query();
        }
        const contentType = req.header('content-type') || '';
        try {
          if (contentType.includes('application/json')) {
            const bodyText = await req.text(); // Read raw body first

            if (!bodyText.trim()) {
              return null; // Handle empty JSON body
            }

            return JSON.parse(bodyText); // Manually parse to catch errors
          } else if (contentType.includes('text/plain')) {
            return await req.text();
          } else if (
            contentType.includes('multipart/form-data') ||
            contentType.includes('application/x-www-form-urlencoded')
          ) {
            return await req.parseBody();
          }
        } catch (error) {
          return null; // Gracefully handle unexpected errors
        }
      },
    })
  );

  const s = serve({
    fetch: app.fetch,
    port,
  });
})();
