import * as http from 'http';
import * as express from 'express';
import { Server } from 'socket.io';
import {
  checkMethodHasBody,
  ObjectLiteral,
  PROTOCOLs,
  TYPE,
} from '/src/shared/tsdk-helper';
import { initializeDataSources } from '/src/db';
import { routeBus } from '../todo/gen-route';
import { setupRoutes } from '../ws-todo/setup-routes';
import * as cors from 'cors';

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

  app.use('/api', (req, res, next) => {
    const method = req.method.toLowerCase();
    const eventName = `${PROTOCOLs.http}:${method || 'get'}:${req.path}`;

    if ((routeBus as ObjectLiteral)._events[eventName]) {
      const reqInfo = {
        uid: 1, // req._authInfo.uid
        uname: '', // req._authInfo.username
        lang: 'zh-CN', // req.lang
        ip: '',
      };
      const body = checkMethodHasBody(method) ? req.body : req.query;
      routeBus.emit(eventName, reqInfo, res, body);
    } else {
      next();
    }
  });

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

    socket.on(TYPE.request, (body) => {
      if (!socket.connected) return;
      try {
        if (body._id) {
          const [method, path] = body._id.split(':');
          routeBus.emit(
            `${PROTOCOLs['socket.io']}:${method || 'get'}:${path}`,
            reqInfo,
            socket,
            body
          );
        }
      } catch (e) {
        // not valid payload
      }
    });

    socket.on(TYPE.set, (data) => {
      if (data.key === 'lang') {
        reqInfo.lang = data.value;
      }
    });
  });

  server.listen(port, () => {
    console.log(`express serve listening at ${port}`);
  });
})();
