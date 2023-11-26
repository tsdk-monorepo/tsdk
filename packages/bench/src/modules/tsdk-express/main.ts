import express, { Request } from 'express';
import { expressAdapterFactory } from 'tsdk-server-adapters/lib/express-adapter';

import { setupHelloAPI } from './Hello.api';
import { RequestInfo, routeBus } from './gen-route';

import { checkMethodHasBody } from '@/src/shared/tsdk-helper';

const port = 3015;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('hi, from express.');
});

app.use(
  '/api/:type',
  expressAdapterFactory<RequestInfo>({
    routeBus,
    async getReqInfo(req: Request) {
      return {
        ip: req.ip as string,
        lang: 'zh-CN',
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

setupHelloAPI();

app.listen(port, () => {
  console.log(`Tsdk express server running at http://localhost:${port}`);
});
