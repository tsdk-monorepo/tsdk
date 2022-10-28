import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { expressAdapterFactory } from 'tsdk-server-adapters/lib/express-adapter';
import { socketIOAdapterFactory } from 'tsdk-server-adapters/lib/socket.io-adapter';

import { checkMethodHasBody, ProtocolTypes } from '/src/shared/tsdk-helper';
import { initializeDataSources } from '/src/db';
import { routeBus } from '../todo/gen-route';
import { setupRoutes } from '../setup-routes';
import { RequestInfo } from '../todo/types';

const port = 3012;

(async () => {
  await initializeDataSources();

  setupRoutes();

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
    '/api',
    expressAdapterFactory<RequestInfo>({
      routeBus,
      getReqInfo(req) {
        return {
          ip: req.ip,
          lang: 'zh-CN',
          token: req.headers.authorization,
        };
      },
      getData(req) {
        return checkMethodHasBody(req.method) ? req.body : req.query;
      },
    })
  );

  // support socket.io protocol
  const io = new Server(server);
  io.on('connection', (socket) => {
    const { address, query } = socket.handshake;
    console.log('New connection from ' + address);

    const reqInfo = {
      ip: address,
      lang: 'zh-CN', // req.lang
      token: query.token as string,
    };

    // @todo need confirm behaind proxy

    // @todo maybe decrypt payload first

    // const sockets = await io.fetchSockets();

    // sockets.length

    socketIOAdapterFactory<RequestInfo>({
      routeBus,
      getReqInfo() {
        return reqInfo;
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
