import { paramCase } from 'change-case';

import { ObjectLiteral } from './tsdk-types';

export * from './tsdk-types';

export const hasBodyMethods: { [key: string]: boolean | undefined } = {
  post: true,
  put: true,
  patch: true,
  delete: true,
  options: true,
};

export function checkMethodHasBody(method: string) {
  return hasBodyMethods[method.toLowerCase()];
}

export function transformPath(path: string) {
  return `/${paramCase(path)}`;
}

/**
 * remove undefined field or trim string value
 *
 * @param data - the object data
 */
export const trimAndRemoveUndefined = (data: ObjectLiteral): ObjectLiteral => {
  const keys = Object.keys(data);
  if (!keys || keys.length === 0) return data;
  const newData: ObjectLiteral = {};
  keys.forEach((k: string) => {
    const valueType = typeof data[k];
    if (valueType === 'string') {
      newData[k] = data[k].trim();
    } else if (valueType !== 'undefined') {
      newData[k] = data[k];
    }
  });
  return newData;
};

export const ProtocolTypes = {
  request: 'REQ:',
  response: 'RES:',
  set: 'SET:',
};
