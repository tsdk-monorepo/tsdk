import assert from 'assert';
import { expect, it, describe, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

import { sum } from '@/src/shared/utils';

describe('hooks', function () {
  beforeAll(function () {
    // runs once before the first test in this block
  });

  afterAll(function () {
    // runs once after the last test in this block
  });

  beforeEach(function () {
    // runs before each test in this block
  });

  afterEach(function () {
    // runs after each test in this block
  });
  // test cases
});

before('before', function before() {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
});

describe('Running TypeScript tests in ts-node runtime without compilation', () => {
  describe('baseline app module', function () {
    it('should return the same value that was passed', () => {
      assert.equal(sum(1, 2), 3);
      expect(sum(1, 1)).to.equal(2);
    });
  });
});
