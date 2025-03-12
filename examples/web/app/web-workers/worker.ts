// @ts-ignore
import type { ZodIssue } from 'zod';

/**
 - In main: send `{_id:msgId, name, data}` and listen `{_id: msgId, response}`
 - In worker: listen `{name, data, _id:msgId}`, match the function name and send 
 fetch request, get the response, emit(msgId, response)
 // ! Challenge: sovle deps problem
 */

export const ProtocolTypes = {
  request: 'REQ:',
  response: 'RES:',
  set: 'SET:',
};

export type RequestError = {
  errors?: ZodIssue[];
  message?: string;
};

const QUEUES: Record<string, any> = {};

onmessage = (e) => {
  // _id:msgId, name, data
  if (e.data?.type === ProtocolTypes.response && e.data?.data) {
    const payload = e.data.data as {
      _id: string;
      status?: number;
      result?: unknown;
      [key: string]: unknown;
    };
    const { _id: msgId, status, result } = payload;
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
  console.log('Worker: Message received from main script');

  const result = e.data[0] * e.data[1];

  if (isNaN(result)) {
    postMessage('Please write two numbers');
  } else {
    const workerResult = 'Result: ' + result;
    console.log('Worker: Posting message back to main script');
    postMessage(workerResult);
  }
  // TODO FIX:
  // ! [vite:worker] Invalid value "iife" for option "output.format" - UMD and IIFE output formats are not supported for code-splitting builds.
  import('xior').then(({ default: xior }) => {
    xior.get('/?' + e.data[0]).then((res) => {
      console.log(res.data);
      postMessage({ result: 'Worker fetch: ' + res.data });
    });
  });
};
