[![NPM version](https://badge.fury.io/js/tsdk-server-adapters.svg)](https://www.npmjs.com/package/tsdk-server-adapters)
[![install size](https://packagephobia.com/badge?p=tsdk-server-adapters)](https://packagephobia.com/result?p=tsdk-server-adapters)
![Downloads](https://img.shields.io/npm/dm/tsdk-server-adapters.svg?style=flat)

# Adapters for tsdk APIs development

Example Code:

Use adapters in `app.ts`:

```ts
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';

import { expressAdapterFactory } from 'tsdk-server-adapters/lib/express-adapter';
import { socketIOAdapterFactory } from 'tsdk-server-adapters/lib/socket.io-adapter';

import { checkMethodHasBody, ProtocolTypes } from '/src/shared/tsdk-helper';
import { routeBus, RequestInfo } from './gen-route';

const port = 3012;

(async () => {
  const app = express();
  const server = http.createServer(app);

  app.use(cors());
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'tsdk');
    next();
  });

  app.get('/', (req, res) => {
    res.end('hi, from express.');
  });

  app.use(
    '/api/:type',
    expressAdapterFactory<RequestInfo>({
      routeBus,
      getReqInfo(req) {
        return {
          type: req.params.type,
          lang: 'zh-CN', // req.lang?
          ip: req.ip,
        };
      },
      getType(reqInfo) {
        return reqInfo.type;
      },
      getData(req) {
        // maybe decode here?(e.g.: decryption)
        const data = checkMethodHasBody(req.method) ? req.body : req.query;
        return data;
      },
    })
  );

  // support socket.io protocol
  const io = new Server(server);
  io.on('connection', (socket) => {
    const { address, query } = socket.handshake;
    console.log('New connection from ' + address);

    const reqInfo = {
      type: query.type,
      uid: 1, // req._authInfo.uid
      uname: '', // req._authInfo.username
      lang: 'zh-CN', // req.lang
      ip: address,
    };

    socketIOAdapterFactory<RequestInfo>({
      routeBus,
      getReqInfo() {
        return reqInfo;
      },
      getType(reqInfo) {
        return reqInfo.type;
      },
      getData(data) {
        // maybe decode here?(e.g.: decryption)
        return data;
      },
      protocolType: ProtocolTypes,
    })(socket);
  });

  server.listen(port, () => {
    console.log(`express serve listening at ${port}`);

    if (process.env.IS_TEST) {
      server.close();
    }
  });
})();
```

`gen-route.ts`:

```ts
import { genRouteFactory, getRouteEventName, Protocol } from 'tsdk-server-adapters';
import { TypeORMError, EntityNotFoundError } from 'typeorm';
import { ZodError } from 'zod';
import { ProtocolTypes } from '/src/shared/tsdk-helper';
import { APIConfig } from '/src/shared/tsdk-types';

export interface RequestInfo {
  lang: string;
  /** username */
  uname: string;
  /** userId */
  uid: number;
  ip: string;
  token?: string;
}

function onErrorHandler(
  e: Error,
  { protocol, send, msgId }: Parameters<Parameters<typeof genRouteFactory>[0]>[1]
) {
  if (e instanceof ZodError) {
    return send({ __id__: msgId, status: 400, msg: e.issues });
  }

  let status = 500,
    msg = e.message;

  if (e instanceof AuthError) {
    status = 401;
  } else if (e instanceof TypeORMError) {
    if (e.name === TypeORMError.name) {
      status = 400;
    } else if (e instanceof EntityNotFoundError) {
      status = 404;
    }
  }
  return send({ __id__: msgId, status, msg });
}

class AuthError extends Error {
  //
}

async function langMiddleware(protocol: Protocol, apiConfig: APIConfig, reqInfo: RequestInfo) {
  // parse lang in adapter or here
  // @todo
  // reqInfo.lang = 'zh-CN';
  // if correct, next
  return Promise.resolve();
}

async function authMiddleware(protocol: Protocol, apiConfig: APIConfig, reqInfo: RequestInfo) {
  if (!apiConfig.needAuth) {
    return Promise.resolve();
  }
  if (!reqInfo.token) {
    return Promise.reject(new AuthError());
  }

  // validate the token now
  // reqInfo.userId = 1;
  // reqInfo.username = 'hi';
  // reqInfo.lang = 'zh-CN';

  // if correct, next
  return Promise.resolve();
}

// reate limit middleware
function rateLimitMiddleware(protocol: Protocol, apiConfig: APIConfig, reqInfo: RequestInfo) {
  // @todo
  return Promise.resolve();
}

const middlewares = [langMiddleware, authMiddleware, rateLimitMiddleware];
export const genRouteObj = genRouteFactory<APIConfig, RequestInfo>(
  onErrorHandler,
  ProtocolTypes,
  middlewares
);

export const routeBus = genRouteObj.routeBus;

const genRoute = genRouteObj.genRoute;

export { getRouteEventName };

export default genRoute;
```
