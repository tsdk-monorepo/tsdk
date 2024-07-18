import { paramCase } from 'change-case';

export * from './tsdk-types';

export const hasBodyMethods: { [key: string]: boolean | undefined } = {
  post: true,
  put: true,
  patch: true,
};

export function checkMethodHasBody(method: string) {
  return hasBodyMethods[method.toLowerCase()];
}

export function transformPath(path: string) {
  return `/${paramCase(path)}`;
}

export function isObject<T = any>(data: T) {
  const result =
    typeof data === 'object' &&
    !Array.isArray(data) &&
    data !== null &&
    !(data instanceof FormData) &&
    Object.keys(data).length > 0;
  return result;
}

export const ProtocolTypes = {
  request: 'REQ:',
  response: 'RES:',
  set: 'SET:',
};
