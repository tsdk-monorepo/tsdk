import express from 'express';

import { expressAdapterFactory } from '../../src/express-adapter';
import genRoute, { routeBus } from './gen-route';
import { checkMethodHasBody, RequestInfo } from './utils';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      // maybe decode here?(e.g.: decryption)
      return checkMethodHasBody(req.method) ? req.body : req.query;
    },
  })
);
