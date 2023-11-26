import fs from 'fs-extra';

const content = (idx) => `

/**
 * Hello${idx} api ({@link APIConfig})
 * @category hello
 */
export const Hello${idx}Config: APIConfig = {
  type: 'user',
  method: 'get',
  path: transformPath('Hello${idx}'),
  description: 'Hello${idx} api',
  category: 'hello',
};
/**
 *
 * @category hello
 */
export type Hello${idx}Req = object;

/**
 *
 * @category hello
 */
export type Hello${idx}Res = {
  result: string;
};
// --------- Hello${idx} END ---------

`;

const count = 10000;

let _i = 0;

let apiConfigResult = `
import { transformPath, APIConfig } from '@/src/shared/tsdk-helper';

`;

let apiContentResultImport = `
import { genRoute, type RequestInfo } from './gen-route';
import {

`;
let apiContentResult = `
export function setupHelloAPI() {
`;

while (_i < count) {
  const i = _i === 0 ? '' : _i;
  apiConfigResult += content(i);
  apiContentResultImport += `
  Hello${i}Config, Hello${i}Req, Hello${i}Res,
  `;
  apiContentResult += `
  genRoute<Hello${i}Req, Hello${i}Res>(Hello${i}Config, async (reqInfo: Readonly<RequestInfo>, data) => {
    const result = 'hi ' + Date.now() + ' ' + Math.random();

    return { result };
  });
  `;
  _i++;
}

fs.writeFileSync('./src/modules/tsdk-express/Hello.apiconf.ts', apiConfigResult);

fs.writeFileSync(
  './src/modules/tsdk-express/Hello.api.ts',
  `
${apiContentResultImport} } from './Hello.apiconf';
${apiContentResult}
}
`
);


fs.writeFileSync(
  './src/modules/tsdk-hono/Hello.api.ts',
  `
${apiContentResultImport} } from '../tsdk-express/Hello.apiconf';
${apiContentResult}
}
`
);
