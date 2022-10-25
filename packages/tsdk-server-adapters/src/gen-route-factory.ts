/** @ts-ignore */
import type { ZodTypeAny } from 'zod';
import EventEmitter from 'eventemitter3';

export const PROTOCOLs = {
  http: 'http',
  ws: 'ws',
  'socket.io': 'io',
};

export const PROTOCOL_KEYs = Object.keys(PROTOCOLs);

type RequestOrSocket = {
  send: Function;
  status?: (statusCode: number) => {
    send: (msg: string | object) => void;
  };
  /** socket.io */
  emit?: EventEmitter['emit'];
  /** socket.io */
  connected?: boolean;
  /** websocket
   * 0	CONNECTING	So-cket has been created. The connection is not yet open.
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

export interface ProtocolType {
  request: string;
  response: string;
  set: string;
}

export function getRouteEventName(
  config: Pick<BasicAPIConfig, 'method' | 'path'> & { protocol: keyof typeof PROTOCOLs }
) {
  return `${PROTOCOLs[config.protocol]}:${config.method || 'get'}:${config.path}`;
}

function sendFactory(reqSocket: RequestOrSocket, protocolType: ProtocolType) {
  return function send(result: ObjectLiteral) {
    if (reqSocket.status) {
      // for http request
      const { status, ...rest } = result;
      reqSocket.status(status || 200).send(rest);
    } else if (reqSocket.emit) {
      // for socket.io
      if (reqSocket.connected) {
        reqSocket.emit(protocolType.response, result);
      }
    } else if (reqSocket.readyState === 1) {
      // for websocket
      reqSocket.send(protocolType.response + JSON.stringify(result));
    }
  };
}

export function genRouteFactory<APIConfig, RequestInfo>(
  onErrorHandler: (
    error: unknown,
    params: {
      msgId: string;
      send: ReturnType<typeof sendFactory>;
    }
  ) => void,
  protocolType: ProtocolType,
  middlewares?: ((apiConfig: APIConfig & BasicAPIConfig, reqInfo: RequestInfo) => Promise<any>)[]
) {
  const routeBus = new EventEmitter();
  const routesMap: ObjectLiteral = Object.create(null);

  function genRoute<ReqData, ResData>(
    apiConfig: APIConfig & BasicAPIConfig,
    cb: (
      reqInfo: Readonly<RequestInfo>,
      reqSocket: RequestOrSocket,
      data: ReqData
    ) => Promise<ResData>
  ) {
    async function onEvent(
      reqInfo: Readonly<RequestInfo>,
      reqSocket: RequestOrSocket,
      { _id: msgId, ...body }: ReqData & { _id: string }
    ) {
      const send = sendFactory(reqSocket, protocolType);

      try {
        // middlewares
        // will throw error if one of middlewares throw error
        if (middlewares && middlewares?.length > 0) {
          await middlewares.reduce((previousPromise, nextMiddleware) => {
            return previousPromise.then(() => nextMiddleware(apiConfig, reqInfo));
          }, Promise.resolve());
        }
        const data = apiConfig.schema ? apiConfig.schema.parse(body) : body;
        const result = await cb(reqInfo, reqSocket, data);
        send({ _id: msgId, ...result });
      } catch (e) {
        onErrorHandler(e, {
          msgId,
          send,
        });
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
