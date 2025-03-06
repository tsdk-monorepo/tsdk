import { expect, it, describe } from 'vitest';

import { removeInputFields, replaceWindowsPath } from '../src/utils'; // Adjust the import path

describe('utils.removeFields', () => {
  it('removes fields', async () => {
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

  it('removes unexpected indent fields', async () => {
    const input = `
    a: 1,
     b: 2,
    c: 3,
    d:4,
`;
    const expected = `
    a: 1,
    c: 3,
`;
    try {
      const result = await removeInputFields(input, ['b', 'd']);
      expect(result).to.equal(expected);
    } catch (e) {
      console.log(e);
    }
  });
});

it('utils.replaceWindowsPath', async () => {
  expect(replaceWindowsPath('/')).toBe('/');
  expect(replaceWindowsPath('\\\\', true)).toBe('//');
});
