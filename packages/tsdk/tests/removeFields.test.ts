import { expect } from 'chai';

import { removeInputFields } from '../src/utils'; // Adjust the import path

describe('_removeFields', () => {
  it('removes single-line field', async () => {
    const input = JSON.stringify(
      {
        a: 1,
        name: {
          a: 4,
          name: {
            e: 4,
          },
        },
        c: 'd',
      },
      null,
      2
    );
    const expected = JSON.stringify(
      {
        c: 'd',
      },
      null,
      2
    );
    const result = await removeInputFields(input, ['name', 'a']);
    expect(result).to.equal(expected);
  });
});
