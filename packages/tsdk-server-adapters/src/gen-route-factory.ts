// @ts-ignore
import EventEmitter from 'eventemitter3';
// @ts-ignore
import type { Response } from 'express';
import type { Context } from 'hono';
// @ts-ignore
import type { Socket } from 'socket.io';
// @ts-ignore
import type { WebSocket } from 'ws';
import type { ZodTypeAny } from 'zod';

export const PROTOCOLs = {
  /** express.js */
  http: 'http',
  /** honojs */
  honoHttp: 'hono',
  'socket.io': 'io',
  /** @deprecated not recommend */
  ws: 'ws',
};

export type Protocol = keyof typeof PROTOCOLs;

export const PROTOCOL_KEYs = Object.keys(PROTOCOLs);

type ResponseSocket = Response | Context | Socket | WebSocket;

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
  return `${PROTOCOLs[config.protocol]}:${config.type}:${config.method}:${config.path}`;
}

function sendFactory(
  protocol: Protocol,
  response: ResponseSocket,
  protocolType: ProtocolType,
  callback?: (result: any) => void
) {
  return function send(payload: {
    _id: string;
    status?: number;
    result?: unknown;
    [key: string]: unknown;
    callback?: Function;
  }) {
    // default http is express.js
    if (protocol === 'http') {
      const { status, result } = payload;
      (response as Response).status(status || 200).send(result);
    } else if (protocol === 'honoHttp') {
      const { status, result } = payload;
      (response as Context).status(status || 200);
      if (typeof result === 'string') {
        callback?.((response as Context).text(result));
      } else {
        callback?.((response as Context).json(result));
      }
    } else if (protocol === 'socket.io') {
      // for socket.io
      if ((response as Socket).connected) {
        (response as Socket).emit(protocolType.response, payload);
      }
    } else if (protocol === 'ws') {
      // for websocket
      (response as WebSocket).send(protocolType.response + JSON.stringify(payload));
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
      { _id: msgId, payload }: { _id: string; payload: ReqData },
      callback?: (result: any) => void
    ) {
      const send = sendFactory(protocol, response, protocolType, callback);

      try {
        // middlewares
        // will throw error if one of middlewares throw error
        if (middlewares && middlewares?.length > 0) {
          await middlewares.reduce((previousPromise, nextMiddleware) => {
            return previousPromise.then(() => nextMiddleware(protocol, apiConfig, reqInfo));
          }, Promise.resolve());
        }
        const data = apiConfig.schema ? apiConfig.schema.parse(payload) : payload;
        const result = await cb(reqInfo, response, data);
        send({ result, _id: msgId });
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
          body: { _id: string; payload: ReqData }
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
