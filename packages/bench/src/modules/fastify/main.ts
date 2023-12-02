import Fastify from 'fastify';

const fastify = Fastify({ logger: false });

const port = 3018;

const count = 2000;
let i = 0;

while (i <= count) {
  const _i = i === 0 ? '' : i;
  i++;

  fastify.get(`/api/user/hello${_i}`, function (request, reply) {
    const result = 'hi ' + Date.now() + ' ' + Math.random();

    reply.send({ result });
  });
}

fastify.listen({ port, host: '0.0.0.0' }, () => {
  console.log(`Fastify server running at http://localhost:${port}`);
});
