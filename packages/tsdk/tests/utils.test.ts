import { expect, it } from 'vitest';

import { replaceWindowsPath, parseArgv } from '../src/utils'; // Adjust the import path

it('utils.replaceWindowsPath', async () => {
  expect(replaceWindowsPath('/')).toBe('/');
  expect(replaceWindowsPath('\\\\', true)).toBe('//');
});

it('utils.parseArgv - basic long and short options', () => {
  const argv = ['create', 'my-app', '--template', 'user/react-template', '-t', 'user/vue-template'];
  const result = parseArgv(argv);

  expect(result.template).toBe('user/react-template');
  expect(result.t).toBe('user/vue-template');
});

it('utils.parseArgv - boolean flags', () => {
  const argv = ['create', 'my-app', '--no-overwrite', '-f'];
  const result = parseArgv(argv);

  expect(result['no-overwrite']).toBe(true);
  expect(result.f).toBe(true);
});

it('utils.parseArgv - missing value treated as boolean', () => {
  const argv = ['--flag', '--option', '-x'];
  const result = parseArgv(argv);

  expect(result.flag).toBe(true);
  expect(result.option).toBe(true);
  expect(result.x).toBe(true);
});

it('utils.parseArgv - values after options', () => {
  const argv = ['--name', 'app', '-v', '1.0.0'];
  const result = parseArgv(argv);

  expect(result.name).toBe('app');
  expect(result.v).toBe('1.0.0');
});

it('utils.parseArgv - ignore non-option arguments', () => {
  const argv = ['create', 'my-app', '--template', 'user/react-template'];
  const result = parseArgv(argv);

  expect(result.template).toBe('user/react-template');
  expect(result.create).toBeUndefined();
  expect(result['my-app']).toBeUndefined();
});
