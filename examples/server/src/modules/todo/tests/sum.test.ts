import assert from 'assert';
import { expect, it, describe } from 'vitest';

import { sum } from '../../../shared/utils';

describe('Running TypeScript tests in ts-node runtime without compilation', () => {
  it('should return the same value that was passed', () => {
    assert.equal(sum(1, 2), 3);
    expect(sum(1, 1)).to.equal(2);
  });
});
