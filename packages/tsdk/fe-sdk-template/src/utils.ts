/**
 * The `methods` sort order should same with
 * `packages/tsdk-server-adapters/src/socket.io-adapter.ts`
 */
const methods = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options'];
const methodsMap: { [key: string]: number } = {};
methods.forEach((i, idx) => {
  methodsMap[i] = idx;
});

let ID = 0;

export function getID(method: string, path: string) {
  const lowCaseMethod = method.toLowerCase();
  const methodIdx = methodsMap[lowCaseMethod];
  return `${methodIdx}:${path}:${++ID}${
    Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(-4)
  }`;
}
