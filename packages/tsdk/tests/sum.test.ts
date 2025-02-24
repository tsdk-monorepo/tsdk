import { expect, it, describe, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

beforeAll(() => {
  console.log('before test');
});

afterAll(() => {
  console.log('after test');
});

describe('tests', () => {
  it('test sum', () => {
    expect(1 + 1).to.equal(2);
  });
});
