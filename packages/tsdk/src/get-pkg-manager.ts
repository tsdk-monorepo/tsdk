import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface LockFileConfig {
  lockFile: string;
  packageManager: PackageManager;
}

const LOCK_FILE_CONFIGS: LockFileConfig[] = [
  { lockFile: 'bun.lock', packageManager: 'bun' },
  { lockFile: 'yarn.lock', packageManager: 'yarn' },
  { lockFile: 'pnpm-lock.yaml', packageManager: 'pnpm' },
  { lockFile: 'package-lock.json', packageManager: 'npm' },
];

function checkPackageManagerVersion(command: string): boolean {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function getPkgManager(baseDir: string): PackageManager {
  try {
    // Check for lock files
    for (const { lockFile, packageManager } of LOCK_FILE_CONFIGS) {
      if (fs.existsSync(path.join(baseDir, lockFile))) {
        return packageManager;
      }
    }

    // Check user agent
    const userAgent = process.env.npm_config_user_agent;
    if (userAgent) {
      if (userAgent.startsWith('yarn')) return 'yarn';
      if (userAgent.startsWith('pnpm')) return 'pnpm';
      if (userAgent.startsWith('bun')) return 'bun';
    }

    // Check installed package managers
    if (checkPackageManagerVersion('pnpm')) return 'pnpm';
    if (checkPackageManagerVersion('bun')) return 'bun';
    if (checkPackageManagerVersion('yarn')) return 'yarn';

    return 'npm';
  } catch {
    return 'npm';
  }
}
