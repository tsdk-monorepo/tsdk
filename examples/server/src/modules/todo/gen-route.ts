import { genRouteFactory, getRouteEventName, Protocol } from 'tsdk-server-adapters';
import { TypeORMError, EntityNotFoundError } from 'typeorm';
import { ZodError } from 'zod';

import { ProtocolTypes } from '/src/shared/tsdk-helper';
import { APIConfig } from '/src/shared/tsdk-types';

import { RequestInfo } from './types';

function onErrorHandler(
  e: Error,
  { protocol, send, msgId }: Parameters<Parameters<typeof genRouteFactory>[0]>[1]
) {
  if (e instanceof ZodError) {
    return send({ __id__: msgId, status: 400, msg: e.issues });
  }

  let status = 500,
    msg = e.message;

  if (e instanceof AuthError) {
    status = 401;
  } else if (e instanceof TypeORMError) {
    if (e.name === TypeORMError.name) {
      status = 400;
    } else if (e instanceof EntityNotFoundError) {
      status = 404;
    }
  }
  return send({ __id__: msgId, status, msg });
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

  // validate the token now
  // reqInfo.userId = 1;
  // reqInfo.username = 'hi';
  // reqInfo.lang = 'zh-CN';

  // if correct, next
  return Promise.resolve();
}

// reate limit middleware
function rateLimitMiddleware(protocol: Protocol, apiConfig: APIConfig, reqInfo: RequestInfo) {
  // @todo
  return Promise.resolve();
}

const middlewares = [langMiddleware, authMiddleware, rateLimitMiddleware];
export const genRouteObj = genRouteFactory<APIConfig, RequestInfo>(
  onErrorHandler,
  ProtocolTypes,
  middlewares
);

export const routeBus = genRouteObj.routeBus;

const genRoute = genRouteObj.genRoute;

export { getRouteEventName };

export default genRoute;
