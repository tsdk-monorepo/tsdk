import { ObjectLiteral } from './shared/tsdk-types';

export function pathParams(path: string, data: ObjectLiteral, symbol: ':' | '{}'): string {
  let newPath = path;

  const params = symbol === ':' ? parseParams(path) : parseBracesParams(path);

  if (params.length > 0) {
    params.forEach((item) => {
      if (data[item.name] !== undefined) {
        newPath = newPath.replace(`${item.symbol}`, data[item.name]);
      }
    });
  }

  return newPath;
}

/** parse /:a/:b -> [{name: 'a', symbol: ':'},{name: 'b', symbol: ':'},] */
export function parseParams(path: string) {
  const result: { name: string; symbol: string }[] = [];
  const symbol = ':';
  const arr = path.split(symbol);
  arr.forEach((item) => {
    if (item && item !== '/') {
      const key = item.split('/')[0];
      result.push({
        name: key,
        get symbol() {
          return `${symbol}${key}`;
        },
      });
    }
  });
  return result;
}

/** parse /{a}/{b} -> [{name: 'a', symbol: '{a}'},{name: 'b', symbol: '{b}'},] */
export function parseBracesParams(path: string) {
  const result: { name: string; symbol: string }[] = [];
  const arr = path.match(/\{(.*?)\}/g);

  if (arr)
    arr.forEach((item) => {
      const key = item.slice(1, -1);
      result.push({
        name: key,
        get symbol() {
          return `{${key}}`;
        },
      });
    });
  return result;
}
