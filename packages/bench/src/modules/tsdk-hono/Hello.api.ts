import { genRoute, type RequestInfo } from './gen-route';

import { transformPath } from '@/src/tsdk-shared/helpers';

export function setupHelloAPI() {
  const count = 2000;
  let i = 0;

  while (i <= count) {
    const _i = i === 0 ? '' : i;
    i++;
    genRoute<object, { result: string }>(
      {
        type: 'user',
        method: 'get',
        path: transformPath(`Hello${_i}`),
      },
      async (requestData, reqInfo: Readonly<RequestInfo>) => {
        const result = 'hi ' + Date.now() + ' ' + Math.random();
        return { result };
      }
    );
  }
}
