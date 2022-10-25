import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { parse } from 'url';
import { wsAdapterFactory } from 'tsdk-server-adapters/lib/ws-adapter';
import { initializeDataSources } from '/src/db';
import { ProtocolTypes } from '/src/shared/tsdk-helper';
import { setupRoutes } from '../setup-routes';
import { routeBus } from '../todo/gen-route';
import { RequestInfo } from '../todo/types';

function heartbeat() {
  this.isAlive = true;
}

(async () => {
  await initializeDataSources();
  setupRoutes();

  const server = createServer();
  const ws = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    const { pathname, query: _query } = parse(req.url || '');
    if (pathname === '/keep') {
      // const query = decode(_query);
      // new Websocket('ws://127.0.0.1:8080/keep?token=xxx&lang=zh-CN')
      // req._authInfo = decode(query.token);
      // req.lang = query.lang;
      ws.handleUpgrade(req, socket, head, (socket) => {
        ws.emit('connection', socket, req);
      });
    } else {
      socket.destroy();
    }
  });

  ws.on('connection', (socket, req) => {
    const ip = req.socket.remoteAddress;
    const reqInfo = {
      uid: 1, // req._authInfo.uid
      uname: '', // req._authInfo.username
      lang: 'zh-CN', // req.lang
      ip,
    };
    // @todo need confirm behaind proxy
    // const ip2 = req.headers['x-forwarded-for'].split(',')[0].trim();

    console.log('new connection');
    console.log('ws.clients size', ws.clients.size);

    (socket as unknown as ExtWebSocket).isAlive = true;
    socket.on('pong', heartbeat);

    wsAdapterFactory<RequestInfo>({
      routeBus,
      getReqInfo() {
        return reqInfo;
      },
      protocolType: ProtocolTypes,
    })(socket);

    socket.on('close', function () {
      console.log('client socket close');
      console.log('ws.clients size', ws.clients.size);
    });
  });

  server.listen(8080, () => {
    console.log('server listening at: ' + 8080);
  });

  const interval = setInterval(function ping() {
    ws.clients.size &&
      ws.clients.forEach(function each(socket) {
        if ((socket as unknown as ExtWebSocket).isAlive === false) return socket.terminate();

        (socket as unknown as ExtWebSocket).isAlive = false;
        socket.ping();
      });
  }, 30000);
})();
