import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { expressAdapterFactory } from 'tsdk-server-adapters/lib/express-adapter';
import { socketIOAdapterFactory } from 'tsdk-server-adapters/lib/socket.io-adapter';

import { checkMethodHasBody, ProtocolTypes } from '/src/shared/tsdk-helper';
import { initializeDataSources } from '/src/db';

import { setupRoutes } from '../setup-routes';
import { routeBus } from '../todo/gen-route';
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
    '/api/:type',
    expressAdapterFactory<RequestInfo>({
      routeBus,
      getReqInfo(req) {
        return {
          ip: req.ip,
          lang: 'zh-CN',
          type: req.params.type,
          token: req.headers.authorization,
        };
      },
      getType(reqInfo) {
        return reqInfo.type;
      },
      getData(req) {
        // maybe decode here?(e.g.: decryption)
        return checkMethodHasBody(req.method) ? req.body : req.query;
      },
    })
  );

  // support socket.io protocol
  const io = new Server(server);
  io.on('connection', (socket) => {
    const { address, query, headers } = socket.handshake;
    console.log('New connection from ' + address);
    console.log(address);
    console.log(query);
    console.log('headers: ');
    console.log(headers);
    console.log(headers.language);

    const reqInfo = {
      ip: address,
      lang: 'zh-CN', // query.lang
      token: query.token as string,
      type: query.type as string,
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
