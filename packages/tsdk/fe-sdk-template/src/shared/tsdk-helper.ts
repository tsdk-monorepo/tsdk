import { paramCase } from 'change-case';

export * from './tsdk-types';

export const hasBodyMethods: { [key: string]: boolean | undefined } = {
  post: true,
  put: true,
  patch: true,
  delete: true,
  options: true,
};

export function checkMethodHasBody(method: string) {
  return hasBodyMethods[method];
}

export function transformPath(path: string) {
  return `/${paramCase(path)}`;
}

export const ProtocolTypes = {
  request: 'REQ:',
  response: 'RES:',
  set: 'SET:',
};
