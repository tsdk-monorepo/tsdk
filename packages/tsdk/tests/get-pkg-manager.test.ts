import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { getPkgManager } from '../src/get-pkg-manager';
import fs from 'fs';
import { execSync } from 'child_process';

vi.mock('fs');
vi.mock('child_process');

describe('getPkgManager', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    delete process.env.npm_config_user_agent;
  });

  it('should detect bun from lock file', () => {
    vi.mocked(fs.existsSync).mockImplementation((path) => (path as string).includes('bun.lock'));
    expect(getPkgManager('/test')).toBe('bun');
  });

  it('should detect yarn from lock file', () => {
    vi.mocked(fs.existsSync).mockImplementation((path) => (path as string).includes('yarn.lock'));
    expect(getPkgManager('/test')).toBe('yarn');
  });

  it('should detect pnpm from lock file', () => {
    vi.mocked(fs.existsSync).mockImplementation((path) =>
      (path as string).includes('pnpm-lock.yaml')
    );
    expect(getPkgManager('/test')).toBe('pnpm');
  });

  it('should detect npm from lock file', () => {
    vi.mocked(fs.existsSync).mockImplementation((path) =>
      (path as string).includes('package-lock.json')
    );
    expect(getPkgManager('/test')).toBe('npm');
  });

  it('should detect package manager from user agent', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    process.env.npm_config_user_agent = 'yarn/1.22.0';
    expect(getPkgManager('/test')).toBe('yarn');

    process.env.npm_config_user_agent = 'pnpm/7.0.0';
    expect(getPkgManager('/test')).toBe('pnpm');

    process.env.npm_config_user_agent = 'bun/1.0.0';
    expect(getPkgManager('/test')).toBe('bun');
  });

  it('should detect installed package managers', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    delete process.env.npm_config_user_agent;

    vi.mocked(execSync).mockImplementation((cmd) => {
      if (cmd.includes('pnpm')) return Buffer.from('7.0.0');
      throw new Error('Command not found');
    });

    expect(getPkgManager('/test')).toBe('pnpm');
  });

  it('should fallback to npm when no other manager is detected', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    delete process.env.npm_config_user_agent;
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('Command not found');
    });

    expect(getPkgManager('/test')).toBe('npm');
  });
});
