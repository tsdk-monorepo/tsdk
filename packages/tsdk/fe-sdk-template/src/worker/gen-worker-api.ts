import { APIConfig, ObjectLiteral, ProtocolTypes } from '../shared/tsdk-helper';
import { getID, RequestError } from '../utils';
import type { Handler, RequestConfig } from '../gen-api';
import { TimeoutError } from '../error';

const QUEUES: ObjectLiteral = {};

let worker: Worker;
let ready = false;
export function setWorker(_worker: Worker) {
  worker = _worker;
  worker.onmessage = (e) => {
    if (e.data.type !== ProtocolTypes.response) return;
    if (e.data.ready) ready = true;

    const msgId = e.data.id;
    if (msgId && QUEUES[msgId]) {
      if (e.data.success) {
        QUEUES[msgId].resolve(e.data.result);
      } else {
        const _result = e.data.error as RequestError;
        QUEUES[msgId].reject({ errors: _result?.errors, message: _result?.message });
      }
      delete QUEUES[msgId];
    }
  };
}

export default function genWorkerAPICall<ReqPayload, ResData>(
  apiConfig: APIConfig
): {
  (
    payload: ReqPayload,
    requestConfig?: RequestConfig<ReqPayload>,
    customHandler?: Handler
  ): Promise<ResData>;
  config: APIConfig;
} {
  function APICall(
    payload: ReqPayload,
    requestConfig?: RequestConfig<ReqPayload>,
    customHandler?: Handler
  ): Promise<ResData> {
    return new Promise((resolve, reject) => {
      const msgId = getID(apiConfig.method, apiConfig.path);
      const timer = setTimeout(() => {
        delete QUEUES[msgId];
        reject(new TimeoutError(`Request Timeout: ${apiConfig.method} ${apiConfig.path}`));
      }, requestConfig?.timeout || 10e3);
      QUEUES[msgId] = {
        async resolve(res: ResData) {
          clearTimeout(timer);
          resolve(res);
        },
        reject(error: Error) {
          clearTimeout(timer);
          reject(error);
        },
      };
      worker.postMessage({
        type: ProtocolTypes.request,
        id: msgId,
        payload,
        apiConfig,
        options: requestConfig,
      });
    });
  }
  APICall.config = apiConfig;
  return APICall;
}
