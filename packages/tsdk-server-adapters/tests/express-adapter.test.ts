import { it, beforeAll, afterAll, describe, expect } from 'vitest';

import http from 'http';
import { app } from './servers/express-adapter.app';

const server = http.createServer(app);
const port = 7001;

beforeAll(async () => {
  await new Promise((resolve) =>
    server.listen(port, () => {
      resolve('ok');
    })
  );
});

afterAll(async () => {
  await new Promise((resolve) =>
    server.close(() => {
      resolve('ok');
    })
  );
});

describe('express adapter tests', () => {
  it('GET should work', async () => {
    const result = await fetch(`http://localhost:${port}/api/user/hello`).then((res) => res.json());
    expect(result.msg).toBe('hello get');
  });

  it('GET with query data should work', async () => {
    const result = await fetch(`http://localhost:${port}/api/user/hello?a=1&b=2`).then((res) =>
      res.json()
    );
    expect(result.msg).toBe('hello get');
    expect(result.data.a).toBe('1');
    expect(result.data.b).toBe('2');
  });

  it('GET with auth API should work with token', async () => {
    const result = await fetch(`http://localhost:${port}/api/user/auth`, {
      headers: {
        authorization: 'this is token',
      },
    })
      .then((res) => (res.ok ? res : Promise.reject(res)))
      .then((res) => res.json());
    expect(result.msg).toBe('ok');
  });

  it('GET with auth API should throw error without token', async () => {
    let error!: Response;
    try {
      await fetch(`http://localhost:${port}/api/user/auth`)
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json());
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeUndefined();
    expect(error.status).toBe(401);
  });

  it('POST should work', async () => {
    const result = await fetch(`http://localhost:${port}/api/user/hello`, { method: 'post' }).then(
      (res) => res.json()
    );
    expect(result.msg).toBe('hello post');
  });

  it('POST with data should work', async () => {
    const result = await fetch(`http://localhost:${port}/api/user/hello`, {
      method: 'post',
      body: JSON.stringify({ a: '1', b: '2' }),
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => res.json());
    expect(result.msg).toBe('hello post');
    expect(result.data.a).toBe('1');
    expect(result.data.b).toBe('2');
  });

  it('POST with auth API should work with token', async () => {
    const result = await fetch(`http://localhost:${port}/api/user/auth`, {
      method: 'post',
      headers: {
        authorization: 'this is token',
      },
    })
      .then((res) => (res.ok ? res : Promise.reject(res)))
      .then((res) => res.json());
    expect(result.msg).toBe('ok');
  });

  it('POST with auth API should throw error without token', async () => {
    let error!: Response;
    try {
      await fetch(`http://localhost:${port}/api/user/auth`, { method: 'post' })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json());
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeUndefined();
    expect(error.status).toBe(401);
  });

  it('GET with not exists path should throw 404 error', async () => {
    let error!: Response;
    try {
      await fetch(`http://localhost:${port}/api/user/not-found-path`, { method: 'get' })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json());
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeUndefined();
    expect(error.status).toBe(404);
  });

  it('POST with not exists path should throw 404 error', async () => {
    let error!: Response;
    try {
      await fetch(`http://localhost:${port}/api/user/not-found-path`, { method: 'post' })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json());
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeUndefined();
    expect(error.status).toBe(404);
  });
});
