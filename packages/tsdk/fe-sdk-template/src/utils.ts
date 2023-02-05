let ID = 0;

export function getID(method: string, path: string) {
  return `${method === 'get' ? '' : method}:${path}:${++ID}${
    Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(-4)
  }`;
}
