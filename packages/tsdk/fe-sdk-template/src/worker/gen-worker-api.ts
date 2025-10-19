import { APIConfig, ProtocolTypes } from '../tsdk-shared/helpers';
import { getID, RequestError } from '../utils';
import genAPI, { type Handler, type RequestConfig } from '../gen-api';
import { TimeoutError } from '../error';

const QUEUES: Record<string, any> = {};
let PENDINGS: [(value: unknown) => void, () => void][] = [];

let worker: Worker;
let ready = false;
export function setWorker(_worker: Worker) {
  worker = _worker;
  worker.addEventListener('message', (e) => {
    if (e.data.type !== ProtocolTypes.response) return;
    if (e.data.ready) {
      ready = true;
      PENDINGS.forEach(([resolve]) => resolve(1));
      PENDINGS = [];
    }

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
  });
}
function genWorkerAPI<ReqPayload, ResData>(
  apiConfig: APIConfig
): {
  (
    payload: ReqPayload,
    requestConfig?: RequestConfig<ReqPayload> & { worker?: boolean },
    customHandler?: Handler
  ): Promise<ResData>;
  config: APIConfig;
} {
  async function APICall(
    payload: ReqPayload,
    requestConfig?: RequestConfig<ReqPayload> & { worker?: boolean },
    /** @deprecated Useless with web workers */
    customHandler?: Handler
  ): Promise<ResData> {
    if (requestConfig?.worker === false)
      return genAPI<ReqPayload, ResData>(apiConfig)(payload, requestConfig, customHandler);
    if (!ready) {
      await new Promise((resolve, reject) => {
        PENDINGS.push([resolve, reject]);
      });
    }
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

const supportWebWorkers = typeof document !== 'undefined' && typeof Worker !== 'undefined';

export default !supportWebWorkers ? genAPI : genWorkerAPI;
