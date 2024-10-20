// @ts-ignore
import EventEmitter from 'eventemitter3';
// @ts-ignore
import type { Response } from 'express';
// @ts-ignore
import type { Context } from 'hono';
import { StatusCode } from 'hono/utils/http-status';
// @ts-ignore
import type { Socket } from 'socket.io';
// @ts-ignore
import type { WebSocket } from 'ws';
import type { ZodTypeAny } from 'zod';

export const PROTOCOLs = {
  /** express.js */
  express: 'express',
  /** honojs */
  hono: 'hono',
  'socket.io': 'io',
  /** @deprecated not recommend */
  ws: 'ws',
} as const;

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
    // [key: string]: unknown;
    callback?: Function;
  }) {
    // default http is express.js
    if (protocol === 'express') {
      const { status, result } = payload;
      (response as Response).status(status || 200).send(result);
    } else if (protocol === 'hono') {
      const { status, result } = payload;
      (response as Context).status((status || 200) as StatusCode);
      if (typeof result === 'string') {
        callback?.((response as Context).text(result));
      } else {
        callback?.((response as Context).json(result || {}));
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
      config: APIConfig;
      payload?: any;
    }
  ) => void,
  protocolType: ProtocolType,
  middlewares?: ((
    protocol: Protocol,
    apiConfig: APIConfig & BasicAPIConfig,
    reqInfo: RequestInfo
  ) => Promise<any>)[],
  /** API types */
  types?: string[]
) {
  const routeBus = new EventEmitter();
  const routesMap: ObjectLiteral = Object.create(null);

  function genRoute<ReqData, ResData>(
    apiConfig: APIConfig & BasicAPIConfig,
    cb: (
      data: ReqData,
      reqInfo: Readonly<RequestInfo>,
      resOrSocket?: ResponseSocket
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
        const result = await cb(data, reqInfo, response);
        send({ result, _id: msgId, callback });
      } catch (e) {
        onErrorHandler(e, {
          protocol,
          msgId,
          send,
          config: apiConfig,
          payload,
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
          body: { _id: string; payload: ReqData },
          callback?: (result: any) => void
        ) => {
          onEvent(i as Protocol, reqInfo, resOrSocket, body, callback);
        }
      );
    });
  }

  return {
    routeBus,
    genRoute: function g<ReqData, ResData>(
      apiConfig: APIConfig & BasicAPIConfig,
      cb: (
        data: ReqData,
        reqInfo: Readonly<RequestInfo>,
        resOrSocket?: ResponseSocket
      ) => Promise<ResData>
    ) {
      if (apiConfig.type === 'common' || !apiConfig.type) {
        if (!types || types?.length === 0) {
          throw new Error(`\`genRouteFactory\` \`types\` param is required`);
        }
        types?.forEach((item) => {
          if (item !== 'common') {
            genRoute({ ...apiConfig, type: item }, cb);
          }
        });
      } else {
        genRoute(apiConfig, cb);
      }
    },
    getRouteEventName,
  };
}
