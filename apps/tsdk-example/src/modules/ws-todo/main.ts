import { createServer } from "http";
import { WebSocketServer } from "ws";
import { parse } from "url";
import { decode } from "querystring";
import { initializeDataSources } from "/src/db";
import { routeBus } from "../todo/gen-route";
import { setupRoutes } from "./setup-routes";
import { TYPE, PROTOCOLs } from "/src/shared/tsdk-helper";

function heartbeat() {
  this.isAlive = true;
}

(async () => {
  await initializeDataSources();
  setupRoutes();

  const server = createServer();
  const ws = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    const { pathname, query: _query } = parse(req.url);
    if (pathname === "/keep") {
      const query = decode(_query);
      // new Websocket('ws://127.0.0.1:8080/keep?token=xxx&lang=zh-CN')
      // req._authInfo = decode(query.token);
      // req.lang = query.lang;
      ws.handleUpgrade(req, socket, head, (socket) => {
        ws.emit("connection", socket, req);
      });
    } else {
      socket.destroy();
    }
  });

  ws.on("connection", (socket, req) => {
    const ip = req.socket.remoteAddress;
    const reqInfo = {
      uid: 1, // req._authInfo.uid
      uname: "", // req._authInfo.username
      lang: "zh-CN", // req.lang
      ip,
    };
    // @todo need confirm behaind proxy
    // const ip2 = req.headers['x-forwarded-for'].split(',')[0].trim();

    console.log("new connection");
    console.log("ws.clients size", ws.clients.size);

    (socket as unknown as ExtWebSocket).isAlive = true;
    socket.on("pong", heartbeat);

    socket.on("message", (payload, isBinary) => {
      // @todo maybe decrypt payload first

      const data = payload.toString();
      const type = data.toString().substring(0, TYPE.request.length);
      if (type === TYPE.request) {
        try {
          const body = JSON.parse(
            data.toString().substring(TYPE.request.length)
          );
          if (socket.readyState === 1) {
            if (body.path) {
              routeBus.emit(
                `${PROTOCOLs.ws}:${body.method || "get"}:${body.path}`,
                reqInfo,
                socket,
                body
              );
            }
          }
        } catch (e) {
          // not valid payload
        }
      } else if (type === TYPE.response) {
        console.log("client should not send response");
      } else if (type === TYPE.set) {
        try {
          const payload = JSON.parse(
            data.toString().substring(TYPE.set.length)
          );
          if (payload.key === "lang") {
            reqInfo.lang = payload.value;
          }
        } catch (e) {
          // not valid payload
        }
      }

      // ws.clients.forEach(function each(client) {
      //   if (client !== socket && client.readyState === WebSocket.OPEN) {
      //     client.send(data, { binary: isBinary });
      //   }
      // });
    });

    socket.on("close", function () {
      console.log("client socket close");
      console.log("ws.clients size", ws.clients.size);
    });
  });

  server.listen(8080, () => {
    console.log("server listening at: " + 8080);
  });

  const interval = setInterval(function ping() {
    ws.clients.size &&
      ws.clients.forEach(function each(socket) {
        if ((socket as unknown as ExtWebSocket).isAlive === false)
          return socket.terminate();

        (socket as unknown as ExtWebSocket).isAlive = false;
        socket.ping();
      });
  }, 30000);
})();
