import APIWorker from './user-api.worker?worker';
import { setWorker } from 'fe-sdk-demo/esm/worker/user-api';

if (typeof document !== 'undefined' && typeof Worker !== 'undefined') {
  const myWorker = new APIWorker();

  const baseURL =
    // process.env.NODE_ENV === 'production'
    //   ? process.env.BASE_URL
    //   :
    (() => {
      if (typeof document === 'undefined') return '/';
      return (
        window?.location.protocol + '//' + window?.location.host.split(':')[0] + ':' + 3012 + '/'
      );
    })();

  myWorker.postMessage({ baseURL });

  setWorker(myWorker);
}

export * from 'fe-sdk-demo/esm/worker/user-api';
export * from 'fe-sdk-demo/esm/worker/user-api-hooks';
export * from 'fe-sdk-demo/esm/apiconf-refs';
export * from 'fe-sdk-demo/esm/entity-refs';
export * from 'fe-sdk-demo/esm/shared-refs';
