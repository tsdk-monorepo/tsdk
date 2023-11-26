/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';

const port = 3017;

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const count = 2000;
let i = 0;

const obj: any = {};

while (i <= count) {
  const _i = i === 0 ? '' : i;
  i++;

  obj[`api/user/hello${_i}`] = publicProcedure.query(() => {
    const result = 'hi ' + Date.now() + ' ' + Math.random();
    return {
      result,
    };
  });
}

const appRouter = router(obj);

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

const app = express();

app.get('/', (req, res) => {
  res.send(`hi, from express.`);
});

app.use(
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(port, () => {
  console.log(`Trpc express server running at http://localhost:${port}`);
});
