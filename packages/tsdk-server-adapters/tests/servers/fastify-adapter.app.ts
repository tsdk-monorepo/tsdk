import * as z from 'zod';
import express from 'express';
import fastifyExpress from '@fastify/express';
import Fastify from 'fastify';
import http from 'http';
import { expressAdapterFactory } from '../../src/express-adapter';
import genRoute, { routeBus } from './gen-route';
import { checkMethodHasBody, RequestInfo } from './utils';

let server: http.Server;

const serverFactory = (handler) => {
  server = http.createServer((req, res) => {
    handler(req, res);
  });

  return server;
};
export const app = Fastify({ serverFactory });
await app.register(fastifyExpress);

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  '/api/:type',
  expressAdapterFactory<RequestInfo>({
    routeBus,
    async getReqInfo(req) {
      return {
        type: req.params.type,
        token: req.headers.authorization,
      };
    },
    getType(reqInfo) {
      return reqInfo.type;
    },
    async getData(req) {
      return checkMethodHasBody(req.method) ? req.body : req.query;
    },
  })
);
