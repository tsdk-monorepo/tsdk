import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import { socketIOAdapterFactory } from 'tsdk-server-adapters/lib/socket.io-adapter';
import { expressAdapterFactory } from 'tsdk-server-adapters/lib/express-adapter';
import { checkMethodHasBody, TYPE } from '/src/shared/tsdk-helper';
import { initializeDataSources } from '/src/db';
import { routeBus } from '../todo/gen-route';
import { setupRoutes } from '../ws-todo/setup-routes';
import { RequestInfo } from '../todo/types';

const port = 3012;

(async () => {
  await initializeDataSources();

  setupRoutes();

  const app = express();
  const server = http.createServer(app);

  app.use(cors());

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
          uid: 1, // req._authInfo.uid
          uname: '', // req._authInfo.username
          lang: 'zh-CN', // req.lang?
          ip: req.ip,
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
    const { address } = socket.handshake;
    console.log('New connection from ' + address);

    const reqInfo = {
      uid: 1, // req._authInfo.uid
      uname: '', // req._authInfo.username
      lang: 'zh-CN', // req.lang
      ip: address,
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
      type: TYPE,
    })(socket);
  });

  server.listen(port, () => {
    console.log(`express serve listening at ${port}`);

    if (process.env.IS_TEST) {
      server.close();
    }
  });
})();
