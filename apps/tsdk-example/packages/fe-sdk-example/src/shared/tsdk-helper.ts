import { paramCase } from 'change-case';
export * from './tsdk-types';

export const withDataMethods: { [key: string]: boolean | undefined } = {
  post: true,
  put: true,
  patch: true,
};

export function checkMethodHasBody(method: string) {
  return withDataMethods[method];
}

export function transformPath(path: string) {
  return `/${paramCase(path)}`;
}

export const TYPE = {
  request: 'REQ:',
  response: 'RES:',
  set: 'SET:',
};

export const PROTOCOLs = {
  http: 'http',
  ws: 'ws',
  'socket.io': 'io',
};

export const PROTOCOL_VALUEs = Object.values(PROTOCOLs);
