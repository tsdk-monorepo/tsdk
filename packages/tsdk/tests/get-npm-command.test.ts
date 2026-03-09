import { describe, expect, it, vi } from 'vitest';
import { getNpmCommand } from '../src/get-npm-command';
import * as pkgManager from '../src/get-pkg-manager';
import { execSync } from 'child_process';

vi.mock('child_process');
vi.mock('../src/get-pkg-manager');

describe('getNpmCommand', () => {
  it('should return default npm commands', () => {
    vi.mocked(pkgManager.getPkgManager).mockReturnValue('npm');

    const result = getNpmCommand('/test');
    expect(result).toEqual({
      pkg: 'npm',
      npxCmd: 'npx',
      installCmd: 'npm install',
      runCmd: 'npm run',
    });
  });

  it('should return bun commands', () => {
    vi.mocked(pkgManager.getPkgManager).mockReturnValue('bun');

    const result = getNpmCommand('/test');
    expect(result).toEqual({
      pkg: 'bun',
      npxCmd: 'bunx',
      installCmd: 'bun install',
      runCmd: 'bun run',
    });
  });

  it('should return pnpm commands', () => {
    vi.mocked(pkgManager.getPkgManager).mockReturnValue('pnpm');

    const result = getNpmCommand('/test');
    expect(result).toEqual({
      pkg: 'pnpm',
      npxCmd: 'pnpm',
      installCmd: 'pnpm install',
      runCmd: 'pnpm',
    });
  });

  it('should return yarn commands for modern yarn', () => {
    vi.mocked(pkgManager.getPkgManager).mockReturnValue('yarn');
    vi.mocked(execSync).mockImplementation((cmd) => {
      if (cmd.includes('yarn dlx')) return Buffer.from('3.0.0');
      throw new Error('Command not found');
    });

    const result = getNpmCommand('/test');
    expect(result).toEqual({
      pkg: 'yarn',
      npxCmd: 'yarn',
      installCmd: 'yarn',
      runCmd: 'yarn',
    });
  });

  it('should return default yarn commands for classic yarn', () => {
    vi.mocked(pkgManager.getPkgManager).mockReturnValue('yarn');
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('Command not found');
    });

    const result = getNpmCommand('/test');
    expect(result).toEqual({
      pkg: 'yarn',
      npxCmd: 'npx',
      installCmd: 'npm install',
      runCmd: 'npm run',
    });
  });
});
