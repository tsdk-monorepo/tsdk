import { NestFactory } from "@nestjs/core";
import { initializeDataSources } from "/src/db";
import { AppModule } from "./app.module";
import axios from "axios";
import {
  checkMethodHasBody,
  ObjectLiteral,
  PROTOCOLs,
} from "/src/shared/tsdk-helper";
import { routeBus } from "../todo/gen-route";

async function bootstrap() {
  await initializeDataSources();

  const app = await NestFactory.create(AppModule);

  app.use((req, res, next) => {
    res.setHeader("X-Powered-By", "tsdk");
    next();
  });

  app.use("/api", (req, res, next) => {
    const method = req.method.toLowerCase();
    const eventName = `${PROTOCOLs.http}:${method || "get"}:${req.path}`;

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
      next();
    }
  });

  await app.listen(3096, () => {
    axios.get("http://localhost:3096/").then((res) => {
      console.log(res.headers);
      console.log(res.data);
      app.close();
    });
  });
}
bootstrap();
