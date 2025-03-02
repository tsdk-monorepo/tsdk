import { genRouteFactory, getRouteEventName, Protocol } from '../../src';
import { ZodError } from 'zod';
import { APIConfig, ProtocolTypes, RequestInfo } from './utils';

function onErrorHandler(
  e: unknown,
  { send, msgId }: Parameters<Parameters<typeof genRouteFactory>[0]>[1]
) {
  if (e instanceof ZodError) {
    return send({
      _id: msgId,
      status: 400,
      result: {
        msg: e.issues,
      },
    });
  }

  let status = 500;
  if (e instanceof AuthError) {
    status = 401;
  }
  const msg = (e as Error).message;

  return send({ _id: msgId, status, result: { msg } });
}

class AuthError extends Error {
  //
}

async function langMiddleware(protocol: Protocol, apiConfig: APIConfig, reqInfo: RequestInfo) {
  // parse lang in adapter or here
  // @todo
  // reqInfo.lang = 'zh-CN';
  // if correct, next
  return Promise.resolve();
}

async function authMiddleware(protocol: Protocol, apiConfig: APIConfig, reqInfo: RequestInfo) {
  if (protocol === 'socket.io' || protocol === 'ws') {
    // only parse once for socket
  }
  if (!apiConfig.needAuth) {
    return Promise.resolve();
  }
  if (!reqInfo.token) {
    return Promise.reject(new AuthError());
  }

  return Promise.resolve();
}

const middlewares = [langMiddleware, authMiddleware];
export const genRouteObj = genRouteFactory<APIConfig, RequestInfo>(
  onErrorHandler,
  ProtocolTypes,
  middlewares
);

export const routeBus = genRouteObj.routeBus;

export { getRouteEventName };

export default genRouteObj.genRoute;
