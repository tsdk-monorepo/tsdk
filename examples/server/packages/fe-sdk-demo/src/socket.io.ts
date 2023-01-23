// @ts-ignore
import type { Socket } from 'socket.io-client';

import {
  APIConfig,
  ObjectLiteral,
  ProtocolTypes,
  trimAndRemoveUndefined,
} from './shared/tsdk-helper';

let socketIOInstance: Socket;

/**
 * Set the io
 *
 * @param instance - io
 */
export const setSocketIOInstance = (instance: Socket): void => {
  socketIOInstance = instance;

  socketIOInstance.off(ProtocolTypes.response);
  socketIOInstance.on(ProtocolTypes.response, ({ _id: msgId, ...data }: ObjectLiteral) => {
    if (msgId && QUEUEs[msgId]) {
      !data.status || data.status === 200
        ? QUEUEs[msgId].resolve(data)
        : QUEUEs[msgId].reject(data);
      delete QUEUEs[msgId];
    }
  });
};

// const socket = io('https://server-domain.com', {
//   transports: ['websocket'],
// });
// setSocketIOInstance(socket);

/**
 * Get socket.io-client instance
 *
 * @param instance - socekt.io-client instance
 * @returns The io
 */
export const getSocketIOInstance = () => {
  return socketIOInstance;
};

const QUEUEs: ObjectLiteral = {};

let ID = 0;

export function socketIOHandler(
  apiConfig: APIConfig,
  data: any,
  requestConfig?: ObjectLiteral & { timeout?: number },
  needTrim?: boolean
): Promise<any> {
  const ioInstance = getSocketIOInstance();
  if (!ioInstance) {
    const msg = `Please call \`setSocketIOInstance\` first`;
    throw msg;
  }
  return new Promise((resolve, reject) => {
    if (!ioInstance.connected) {
      return reject('No Connection');
    }

    const msgId = `${apiConfig.method === 'get' ? '' : ''}:${apiConfig.path}:${++ID}${
      Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(-4)
    }`;

    ioInstance.emit(ProtocolTypes.request, {
      ...(needTrim && data ? trimAndRemoveUndefined(data) : {}),
      _id: msgId,
    });

    const timer = requestConfig?.timeout
      ? setTimeout(() => {
          delete QUEUEs[msgId];
          reject('Request Timeout');
        }, requestConfig.timeout)
      : -1;

    QUEUEs[msgId] = {
      resolve(res: any) {
        clearTimeout(timer);
        resolve(res);
      },
      reject(e: Error) {
        clearTimeout(timer);
        reject(e);
      },
    };
  });
}
