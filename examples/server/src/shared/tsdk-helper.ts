import { paramCase } from 'change-case';

export * from './tsdk-types';

export const withDataMethods: { [key: string]: boolean | undefined } = {
  post: true,
  put: true,
  patch: true,
};

export function checkMethodHasBody(method: string) {
  return withDataMethods[method.toLowerCase()];
}

export function transformPath(path: string) {
  return `/${paramCase(path)}`;
}

export const ProtocolTypes = {
  request: 'REQ:',
  response: 'RES:',
  set: 'SET:',
};
