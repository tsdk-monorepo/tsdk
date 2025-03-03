import { it, beforeAll, afterAll, describe, expect } from 'vitest';

import SocketIOClient, { Socket } from 'socket.io-client';
import { server } from './servers/socket.io-adapter.app';
import { getID, ProtocolTypes } from './servers/utils';
import { ObjectLiteral } from '../src/gen-route-factory';
import { RequestError } from './servers/gen-route';

const port = 7004;
const QUEUES: ObjectLiteral = {};
let io!: Socket;

beforeAll(async () => {
  await new Promise((resolve) =>
    server.listen(port, () => {
      resolve('ok');
    })
  );
  io = SocketIOClient(`http://localhost:${port}`, { query: { type: 'user' } });
  io.on(
    ProtocolTypes.response,
    ({
      _id: msgId,
      status,
      result,
    }: {
      _id: string;
      status?: number;
      result?: unknown;
      [key: string]: unknown;
    }) => {
      if (msgId && QUEUES[msgId]) {
        if (!status || status === 200) {
          QUEUES[msgId].resolve(result);
        } else {
          const _result = result as RequestError;
          QUEUES[msgId].reject({ status, errors: _result?.errors, message: _result?.message });
        }
        delete QUEUES[msgId];
      }
    }
  );
  await new Promise((resolve) => setTimeout(resolve, 200));
});

afterAll(async () => {
  io.disconnect();
  await new Promise((resolve) =>
    server.close(() => {
      resolve('ok');
    })
  );
});

describe('socket.io adapter tests', () => {
  it('GET should work', async () => {
    const result = await send('get', '/hello');
    expect((result as { msg: string }).msg).toBe('hello get');
  });

  it('GET with query data should work', async () => {
    const result: any = await send('get', '/hello', { a: '1', b: '2' });
    expect(result.msg).toBe('hello get');
    expect(result.data.a).toBe('1');
    expect(result.data.b).toBe('2');
  });

  it('GET with auth API should work with token', async () => {
    io.emit('token', 'this is token');
    const result: any = await send('get', '/auth', { a: '1', b: '2' });
    io.emit('token', undefined);
    expect(result.msg).toBe('ok');
  });

  it('GET with auth API should throw error without token', async () => {
    let error!: Response;
    try {
      await send('get', '/auth');
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeUndefined();
    expect(error.status).toBe(401);
  });

  it('POST should work', async () => {
    const result = await send('post', '/hello');
    expect((result as { msg: string }).msg).toBe('hello post');
  });

  it('POST with query data should work', async () => {
    const result: any = await send('post', '/hello', { a: '1', b: '2' });
    expect(result.msg).toBe('hello post');
    expect(result.data.a).toBe('1');
    expect(result.data.b).toBe('2');
  });

  it('POST with auth API should work with token', async () => {
    io.emit('token', 'this is token');
    const result: any = await send('post', '/auth', { a: '1', b: '2' });
    io.emit('token', undefined);
    expect(result.msg).toBe('ok');
  });

  it('post with auth API should throw error without token', async () => {
    let error!: Response;
    try {
      await send('post', '/auth');
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeUndefined();
    expect(error.status).toBe(401);
  });

  it('GET with not exists path should throw request timeout error', async () => {
    let error!: Error;
    try {
      await send('get', '/not-found-path');
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeUndefined();
    expect(error.message).toBe('Request Timeout');
  });

  it('POST with not exists path should throw request timeout error', async () => {
    let error!: Error;
    try {
      await send('post', '/not-found-path');
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeUndefined();
    expect(error.message).toBe('Request Timeout');
  });

  it('POST with FormData should work', async () => {
    const formData = new FormData();
    formData.append('a', '1');
    formData.append('b', '2');
    const result: any = await send('post', '/hello', formData);
    expect(result.msg).toBe('hello post');
    expect(result.data.a).toBe('1');
    expect(result.data.b).toBe('2');
  });

  it('GET with not valid query data should throw error', async () => {
    let error!: any;
    try {
      await send('get', '/hello', { a: 'a', b: 'b', c: 'd' });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.status).toBe(400);
    const res = error;
    expect(res.errors[0].code).toBe('unrecognized_keys');
    expect(res.errors[1]).toBeUndefined();
  });

  it('POST with not valid data should throw error', async () => {
    let error!: any;
    try {
      await send('post', '/hello', { a: 'a', b: 'b', c: 'd' });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.status).toBe(400);
    const res = error;
    expect(res.errors[0].code).toBe('unrecognized_keys');
    expect(res.errors[1]).toBeUndefined();
  });
});

function send(method: string, path: string, data?: any) {
  return new Promise((resolve, reject) => {
    const msgId = getID(method, path);
    const timer = setTimeout(() => {
      delete QUEUES[msgId];
      reject(new Error('Request Timeout'));
    }, 2e3);
    QUEUES[msgId] = {
      resolve(res: any) {
        clearTimeout(timer);
        resolve(res);
      },
      reject(e: Error) {
        clearTimeout(timer);
        reject(e);
      },
    };
    io.emit(ProtocolTypes.request, {
      _id: msgId,
      payload: data instanceof FormData ? Object.fromEntries(data as unknown as any) : data,
    });
  });
}
