/** @ts-ignore */
import type { ZodTypeAny } from 'zod';
import EventEmitter from 'eventemitter3';

export const PROTOCOLs = {
  http: 'http',
  ws: 'ws',
  'socket.io': 'io',
};

export const PROTOCOL_KEYs = Object.keys(PROTOCOLs);

type Socket = {
  send: Function;
  status?: (statusCode: number) => {
    send: (msg: string | object) => void;
  };
  /** socket.io */
  emit?: EventEmitter['emit'];
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

interface BasicAPIConfig {
  method: string;
  path: string;
  schema?: ZodTypeAny;
}

export interface ObjectLiteral {
  [key: string]: any;
}

export interface Type {
  request: string;
  response: string;
  set: string;
}

export function getRouteEventName(
  config: Pick<BasicAPIConfig, 'method' | 'path'> & { protocol: keyof typeof PROTOCOLs }
) {
  return `${PROTOCOLs[config.protocol]}:${config.method || 'get'}:${config.path}`;
}

function send(socket: Socket, result: ObjectLiteral, type: Type, status?: number) {
  if (socket.status) {
    // http
    const { status, ...rest } = result;
    socket.status(status || 200).send(rest);
  } else if (socket.emit) {
    // socket.io
    if (socket.connected) {
      socket.emit(type.response, result);
    }
  } else if (socket.readyState === 1) {
    // websocket
    socket.send(type.response + JSON.stringify(result));
  }
}

export function genRouteFactory<APIConfig, RequestInfo>(
  onErrorHandler: (e: unknown, socket: Socket, msgId: string, _send: typeof send) => void,
  type: Type,
  middlewares?: ((apiConfig: APIConfig & BasicAPIConfig, reqInfo: RequestInfo) => Promise<any>)[]
) {
  const routeBus = new EventEmitter();
  const routesMap: ObjectLiteral = Object.create(null);

  function genRoute<ReqData, ResData>(
    apiConfig: APIConfig & BasicAPIConfig,
    cb: (reqInfo: Readonly<RequestInfo>, socket: Socket, data: ReqData) => Promise<ResData>
  ) {
    async function onEvent(
      reqInfo: Readonly<RequestInfo>,
      socket: Socket,
      { _id: msgId, ...body }: ReqData & { _id: string }
    ) {
      try {
        // middlewares
        // will throw error if one of middlewares throw error
        if (middlewares && middlewares?.length > 0) {
          await middlewares.reduce((previousPromise, nextMiddleware) => {
            return previousPromise.then(() => nextMiddleware(apiConfig, reqInfo));
          }, Promise.resolve());
        }
        const data = apiConfig.schema ? apiConfig.schema.parse(body) : body;
        const result = await cb(reqInfo, socket, data);
        send(socket, { _id: msgId, ...result }, type);
      } catch (e) {
        onErrorHandler(e, socket, msgId, send);
      }
    }

    PROTOCOL_KEYs.forEach((i) => {
      const routeEventName = getRouteEventName({
        protocol: i as keyof typeof PROTOCOLs,
        method: apiConfig.method.toLowerCase(),
        path: apiConfig.path,
      });

      if (routesMap[routeEventName]) {
        throw new Error(`\`${routeEventName}\` already used.`);
      } else {
        routesMap[routeEventName] = 1;
      }

      routeBus.on(routeEventName, onEvent);
    });
  }

  return {
    routeBus,
    genRoute,
    getRouteEventName,
  };
}
