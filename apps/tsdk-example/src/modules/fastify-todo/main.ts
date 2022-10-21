import Fastify from "fastify";
import { routeBus } from "../todo/gen-route";
import { setupRoutes } from "../ws-todo/setup-routes";
import { initializeDataSources } from "/src/db";
import {
  checkMethodHasBody,
  ObjectLiteral,
  PROTOCOLs,
} from "/src/shared/tsdk-helper";

(async () => {
  await initializeDataSources();

  setupRoutes();

  const fastify = Fastify({
    logger: true,
  });

  // fastify.register((req, res, next) => {
  //   res.headers({
  //     "X-Powered-By": "tsdk",
  //   });
  //   next();
  // });

  fastify.get("/", (req, res) => {
    return "hi, from fastify.";
  });

  fastify.all<{
    Params: { name: string };
  }>("/api/:name", (req, res) => {
    const method = req.method.toLowerCase();
    const eventName = `${PROTOCOLs.http}:${method || "get"}:/${
      req.params.name
    }`;

    if ((routeBus as ObjectLiteral)._events[eventName]) {
      const reqInfo = {
        uid: 1, // req._authInfo.uid
        uname: "", // req._authInfo.username
        lang: "zh-CN", // req.lang
        ip: "",
      };
      const body = checkMethodHasBody(method) ? req.body : req.query;
      routeBus.emit(eventName, reqInfo, res, body);
    } else {
      res.callNotFound();
    }
  });

  const port = 3016;

  fastify.listen({ port }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    console.log(`express serve listening on ${address}`);
  });
})();
