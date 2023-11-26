import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const port = 3014;
const app = new Hono();

app.get('/', (c) => {
  return c.text(`hi, from hono.`);
});

const count = 2000;
let i = 0;

while (i <= count) {
  const _i = i === 0 ? '' : i;
  i++;

  app.get(`/api/user/hello${_i}`, (c) => {
    const result = 'hi ' + Date.now() + ' ' + Math.random();

    return c.json({ result });
  });
}

serve({
  fetch: app.fetch,
  port,
});

console.log(`Hono server running at http://localhost:${port}`);
