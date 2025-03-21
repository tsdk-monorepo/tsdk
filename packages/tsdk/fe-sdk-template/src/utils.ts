// @ts-ignore
import type { StandardSchemaV1 } from '@standard-schema/spec';
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

export function resetID() {
  ID = 0;
}

/**
 * Generates a unique ID for API requests based on HTTP method and path
 * @param method - HTTP method (get, post, etc.)
 * @param path - API endpoint path
 * @returns A unique string identifier
 */
export function getID(method: string, path: string): string {
  const lowCaseMethod = method.toLowerCase();
  const methodIdx = methodsMap[lowCaseMethod];

  // Add error handling for invalid methods
  if (methodIdx === undefined) {
    throw new Error(`Invalid method: ${method}. Valid methods are: ${methods.join(', ')}`);
  }

  const timestamp = Date.now().toString(36).slice(-4);
  const randomStr = Math.random().toString(36).slice(-4);

  return `${methodIdx}:${path}:${++ID}${timestamp}${randomStr}`;
}

export type RequestError = {
  errors?: StandardSchemaV1.Issue[];
  message?: string;
};
