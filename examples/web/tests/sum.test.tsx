import { beforeAll, afterAll, expect, describe, test } from 'vitest';

beforeAll(() => {
  console.log('before test');
});

afterAll(() => {
  console.log('after test');
});

describe('tests', () => {
  test('test sum', () => {
    expect(1 + 1).to.equal(2);
  });
});
