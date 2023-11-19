import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

export function getPkgManager(baseDir: string): PackageManager {
  try {
    for (const { lockFile, packageManager } of [
      { lockFile: 'yarn.lock', packageManager: 'yarn' },
      { lockFile: 'pnpm-lock.yaml', packageManager: 'pnpm' },
      { lockFile: 'package-lock.json', packageManager: 'npm' },
    ]) {
      if (fs.existsSync(path.join(baseDir, lockFile))) {
        return packageManager as PackageManager;
      }
    }
    const userAgent = process.env.npm_config_user_agent;
    if (userAgent) {
      if (userAgent.startsWith('yarn')) {
        return 'yarn';
      } else if (userAgent.startsWith('pnpm')) {
        return 'pnpm';
      }
    }
    try {
      execSync('yarn --version', { stdio: 'ignore' });
      return 'yarn';
    } catch {
      execSync('pnpm --version', { stdio: 'ignore' });
      return 'pnpm';
    }
  } catch {
    return 'npm';
  }
}

export function getNpmCommand(baseDir: string) {
  const pkgManager = getPkgManager(baseDir);
  const commandMap = {
    pkg: pkgManager,
    npxCmd: 'npx',
    installCmd: 'npm install',
    runCmd: 'npm run',
  };
  if (pkgManager === 'pnpm') {
    commandMap.npxCmd = 'pnpm';
    commandMap.installCmd = 'pnpm install';
    commandMap.runCmd = 'pnpm';
  } else if (pkgManager === 'yarn') {
    try {
      execSync('yarn dlx --help', { stdio: 'ignore' });
      commandMap.npxCmd = 'yarn';
      commandMap.installCmd = 'yarn';
      commandMap.runCmd = 'yarn';
    } catch {}
  }

  return commandMap;
}
