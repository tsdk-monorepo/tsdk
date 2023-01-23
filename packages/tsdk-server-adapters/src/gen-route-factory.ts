// @ts-ignore
import EventEmitter from 'eventemitter3';
import type { Response } from 'express';
// @ts-ignore
// @ts-ignore
import type { Socket } from 'socket.io';
// @ts-ignore
import type { WebSocket } from 'ws';
import type { ZodTypeAny } from 'zod';

export const PROTOCOLs = {
  http: 'http',
  ws: 'ws',
  'socket.io': 'io',
};

export type Protocol = keyof typeof PROTOCOLs;

export const PROTOCOL_KEYs = Object.keys(PROTOCOLs);

type ResponseSocket = Response | Socket | WebSocket;

interface BasicAPIConfig {
  method: string;
  path: string;
  type: string;
  schema?: ZodTypeAny;
}

export interface ObjectLiteral {
  [key: string]: any;
}

export interface ProtocolType {
  request: string;
  response: string;
}

export function getRouteEventName(
  config: Pick<BasicAPIConfig, 'type' | 'method' | 'path'> & { protocol: Protocol }
) {
  return `${PROTOCOLs[config.protocol]}:${config.type}:${config.method || 'get'}:${config.path}`;
}

function sendFactory(protocol: Protocol, response: ResponseSocket, protocolType: ProtocolType) {
  return function send(result: ObjectLiteral) {
    if (protocol === 'http') {
      // for http request
      const { status, ...rest } = result;
      (response as Response).status(status || 200).send(rest);
    } else if (protocol === 'socket.io') {
      // for socket.io
      if ((response as Socket).connected) {
        (response as Socket).emit(protocolType.response, result);
      }
    } else if (protocol === 'ws') {
      // for websocket
      (response as WebSocket).send(protocolType.response + JSON.stringify(result));
    }
  };
}

export function genRouteFactory<APIConfig, RequestInfo>(
  onErrorHandler: (
    error: unknown,
    params: {
      protocol: Protocol;
      msgId: string;
      send: ReturnType<typeof sendFactory>;
    }
  ) => void,
  protocolType: ProtocolType,
  middlewares?: ((
    protocol: Protocol,
    apiConfig: APIConfig & BasicAPIConfig,
    reqInfo: RequestInfo
  ) => Promise<any>)[]
) {
  const routeBus = new EventEmitter();
  const routesMap: ObjectLiteral = Object.create(null);

  function genRoute<ReqData, ResData>(
    apiConfig: APIConfig & BasicAPIConfig,
    cb: (
      reqInfo: Readonly<RequestInfo>,
      resOrSocket: ResponseSocket,
      data: ReqData
    ) => Promise<ResData>
  ) {
    async function onEvent(
      protocol: Protocol,
      reqInfo: Readonly<RequestInfo>,
      response: ResponseSocket,
      { _id: msgId, ...body }: ReqData & { _id: string }
    ) {
      const send = sendFactory(protocol, response, protocolType);

      try {
        // middlewares
        // will throw error if one of middlewares throw error
        if (middlewares && middlewares?.length > 0) {
          await middlewares.reduce((previousPromise, nextMiddleware) => {
            return previousPromise.then(() => nextMiddleware(protocol, apiConfig, reqInfo));
          }, Promise.resolve());
        }
        const data = apiConfig.schema ? apiConfig.schema.parse(body) : body;
        const result = await cb(reqInfo, response, data);
        send({ _id: msgId, ...result });
      } catch (e) {
        onErrorHandler(e, {
          protocol,
          msgId,
          send,
        });
      }
    }

    PROTOCOL_KEYs.forEach((i) => {
      const routeEventName = getRouteEventName({
        protocol: i as keyof typeof PROTOCOLs,
        type: apiConfig.type,
        method: apiConfig.method.toLowerCase(),
        path: apiConfig.path,
      });

      if (routesMap[routeEventName]) {
        throw new Error(`\`${routeEventName}\` already used.`);
      } else {
        routesMap[routeEventName] = 1;
      }

      routeBus.on(
        routeEventName,
        (
          reqInfo: Readonly<RequestInfo>,
          resOrSocket: ResponseSocket,
          body: ReqData & { _id: string }
        ) => {
          onEvent(i as Protocol, reqInfo, resOrSocket, body);
        }
      );
    });
  }

  return {
    routeBus,
    genRoute,
    getRouteEventName,
  };
}
