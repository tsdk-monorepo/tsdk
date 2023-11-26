import { genRoute, type RequestInfo } from './gen-route';

import { transformPath } from '@/src/shared/tsdk-helper';

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
        description: `Hello${_i} api`,
        category: 'hello',
      },
      async (reqInfo: Readonly<RequestInfo>, data) => {
        const result = 'hi ' + Date.now() + ' ' + Math.random();
        return { result };
      }
    );
  }
}
