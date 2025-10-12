import { expect, it } from 'vitest';

import { replaceWindowsPath } from '../src/utils'; // Adjust the import path

it('utils.replaceWindowsPath', async () => {
  expect(replaceWindowsPath('/')).toBe('/');
  expect(replaceWindowsPath('\\\\', true)).toBe('//');
});
