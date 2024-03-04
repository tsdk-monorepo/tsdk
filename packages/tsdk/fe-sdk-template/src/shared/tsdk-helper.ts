import { paramCase } from 'change-case';

import { ObjectLiteral } from './tsdk-types';

export * from './tsdk-types';

export const hasBodyMethods: { [key: string]: boolean | undefined } = {
  post: true,
  put: true,
  patch: true,
  options: true,
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

/**
 * remove undefined field or trim string value
 *
 * @param data - the object data
 */
export const trimAndRemoveUndefined = (data: ObjectLiteral): ObjectLiteral => {
  if (!isObject(data)) return data;
  const newData: ObjectLiteral = {};
  Object.keys(data).forEach((k: string) => {
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
