// @ts-ignore
import type { Socket } from 'socket.io-client';

import { NoConnectionError, NoHandlerError, TimeoutError } from './error';
import { APIConfig, ObjectLiteral, ProtocolTypes } from './shared/tsdk-helper';
import { getID } from './utils';

let socketIOInstance: Socket;

const QUEUES: ObjectLiteral = {};

/**
 * Set the io instance
 * 
 * @example
 * ```ts
  const socket = io('https://server-domain.com', {
    transports: ['websocket'],
  });
  setSocketIOInstance(socket);
  ```
 *
 * @param instance - io
 */
export const setSocketIOInstance = (instance: Socket): void => {
  socketIOInstance = instance;

  socketIOInstance.off(ProtocolTypes.response);
  socketIOInstance.on(
    ProtocolTypes.response,
    ({
      _id: msgId,
      status,
      result,
    }: {
      _id: string;
      status?: number;
      result?: unknown;
      [key: string]: unknown;
    }) => {
      if (msgId && QUEUES[msgId]) {
        if (!status || status === 200) {
          QUEUES[msgId].resolve(result);
        } else {
          QUEUES[msgId].reject({ status, result });
        }
        delete QUEUES[msgId];
      }
    }
  );
};

/**
 * Get socket.io-client instance
 *
 * @returns The io
 */
export const getSocketIOInstance = (): Socket => {
  return socketIOInstance;
};

type ParamsOfFromEntries = Parameters<typeof Object.fromEntries>[0];

export function socketIOHandler(
  apiConfig: APIConfig,
  data: any,
  requestConfig?: ObjectLiteral & { timeout?: number }
): Promise<any> {
  const ioInstance = getSocketIOInstance();
  if (!ioInstance) {
    throw new NoHandlerError(`Call \`setSocketIOInstance\` first`);
  }
  return new Promise((resolve, reject) => {
    if (!ioInstance.connected) {
      return reject(new NoConnectionError('No Connection'));
    }

    const msgId = getID(apiConfig.method, apiConfig.path);

    ioInstance.emit(ProtocolTypes.request, {
      _id: msgId,
      payload:
        data instanceof FormData
          ? Object.fromEntries(data as unknown as ParamsOfFromEntries)
          : data,
    });

    const timer = setTimeout(() => {
      delete QUEUES[msgId];
      reject(new TimeoutError('Request Timeout'));
    }, requestConfig?.timeout || 10e3);

    QUEUES[msgId] = {
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
