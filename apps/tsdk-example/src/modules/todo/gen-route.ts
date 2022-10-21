import { TypeORMError, EntityNotFoundError } from "typeorm";
import { ZodError } from "zod";
import * as EventEmitter from "eventemitter3";
import {
  APIConfig,
  ObjectLiteral,
  PROTOCOL_VALUEs,
  TYPE,
} from "/src/shared/tsdk-helper";
import { RequestInfo } from "../todo/types";

type Socket = {
  send: Function;
  status?: (statusCode: number) => {
    send: (msg: string | ObjectLiteral) => void;
  };
  /** socket.io */
  emit?: EventEmitter["emit"];
  /** socket.io */
  connected?: boolean;
  /** websocket
   * 0	CONNECTING	Socket has been created. The connection is not yet open.
   * 1	OPEN	The connection is open and ready to communicate.
   * 2	CLOSING	The connection is in the process of closing.
   * 3	CLOSED	The connection is closed or couldn't be opened.
   */
  readyState?: 0 | 1 | 2 | 3;
};

export const routeBus = new EventEmitter();

const routesMap: ObjectLiteral = Object.create(null);

function send(socket: Socket, result: ObjectLiteral, status?: number) {
  if (socket.status) {
    // http
    const { status, ...rest } = result;
    socket.status(status || 200).send(rest);
  } else if (socket.emit) {
    // socket.io
    if (socket.connected) {
      socket.emit(TYPE.response, result);
    }
  } else if (socket.readyState === 1) {
    // websocket
    socket.send(TYPE.response + JSON.stringify(result));
  }
}

export default function genRoute<ReqData, ResData>(
  apiConfig: APIConfig,
  cb: (
    reqInfo: Readonly<RequestInfo>,
    socket: Socket,
    data: ReqData
  ) => Promise<ResData>
) {
  const routeName = `${apiConfig.method}:${apiConfig.path}`;

  async function onEvent(
    reqInfo: Readonly<RequestInfo>,
    socket: Socket,
    { _id: msgId, ...body }: ReqData & { _id: string }
  ) {
    try {
      const data = apiConfig.schema ? apiConfig.schema.parse(body) : body;
      const result = await cb(reqInfo, socket, data);
      send(socket, { _id: msgId, ...result });
    } catch (e) {
      if (e instanceof ZodError) {
        return send(socket, { _id: msgId, status: 400, msg: e.issues });
      }

      let status = 500,
        msg = e.message;

      if (e instanceof TypeORMError) {
        if (e.name === TypeORMError.name) {
          status = 400;
        } else if (e instanceof EntityNotFoundError) {
          status = 404;
        }
      }
      return send(socket, { _id: msgId, status, msg });
    }
  }

  PROTOCOL_VALUEs.forEach((i) => {
    const name = `${i}:${routeName}`;

    if (routesMap[name]) {
      throw new Error(`\`${i}:${apiConfig.path}\` already used.`);
    } else {
      routesMap[name] = 1;
    }

    routeBus.on(name, onEvent);
  });
}
