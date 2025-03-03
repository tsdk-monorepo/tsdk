// @ts-ignore
import type { Socket } from 'socket.io-client';
import { NoConnectionError, NoHandlerError, TimeoutError } from './error';
import { APIConfig, ObjectLiteral, ProtocolTypes } from './shared/tsdk-helper';
import { RequestError, getID } from './utils';

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
          const _result = result as RequestError;
          QUEUES[msgId].reject({ status, errors: _result?.errors, message: _result?.message });
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

export async function socketIOHandler(
  apiConfig: APIConfig,
  data: any,
  requestConfig?: ObjectLiteral & { timeout?: number }
): Promise<any> {
  const ioInstance = getSocketIOInstance();
  if (!ioInstance) {
    throw new NoHandlerError(`Call \`setSocketIOInstance\` first`);
  }
  if (!ioInstance.connected) {
    throw new NoConnectionError('No Connection');
  }

  const { method, path, onRequest, onResponse } = apiConfig;

  let requestData =
    data instanceof FormData ? Object.fromEntries(data as unknown as ParamsOfFromEntries) : data;
  // Apply onRequest hook if available
  if (onRequest) {
    requestData = await onRequest(requestData);
  }

  return new Promise((resolve, reject) => {
    const msgId = getID(method, path);

    ioInstance.emit(ProtocolTypes.request, {
      _id: msgId,
      payload: requestData,
    });

    const timer = setTimeout(() => {
      delete QUEUES[msgId];
      reject(new TimeoutError('Request Timeout'));
    }, requestConfig?.timeout || 10e3);

    QUEUES[msgId] = {
      async resolve(res: unknown) {
        clearTimeout(timer);
        resolve(onResponse ? await onResponse(res) : res);
      },
      reject(e: Error) {
        clearTimeout(timer);
        reject(e);
      },
    };
  });
}
