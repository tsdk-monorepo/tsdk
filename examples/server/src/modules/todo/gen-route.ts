import { TypeORMError, EntityNotFoundError } from 'typeorm';
import { ZodError } from 'zod';
import { genRouteFactory, getRouteEventName } from 'tsdk-server-adapters';
import { TYPE } from '/src/shared/tsdk-helper';
import { APIConfig } from '/src/shared/tsdk-types';
import { RequestInfo } from './types';

function onErrorHandler(e: Error, socket, msgId, send) {
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

class AuthError extends Error {
  //
}

async function langMiddleware(apiConfig: APIConfig, reqInfo: RequestInfo) {
  // parse lang in adapter or here
  // @todo
  // reqInfo.lang = 'zh-CN';
  // if correct, next
  return Promise.resolve();
}

async function authMiddleware(apiConfig: APIConfig, reqInfo: RequestInfo) {
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
function rateLimitMiddleware(apiConfig: APIConfig, reqInfo: RequestInfo) {
  // @todo
  return Promise.resolve();
}

const middlewares = [langMiddleware, authMiddleware, rateLimitMiddleware];
export const genRouteObj = genRouteFactory<APIConfig, RequestInfo>(
  onErrorHandler,
  TYPE,
  middlewares
);

export const routeBus = genRouteObj.routeBus;

const genRoute = genRouteObj.genRoute;

export { getRouteEventName };

export default genRoute;
