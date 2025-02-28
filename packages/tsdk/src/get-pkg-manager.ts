import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

interface LockFileConfig {
  lockFile: string;
  packageManager: PackageManager;
}

interface CommandConfig {
  pkg: PackageManager;
  npxCmd: string;
  installCmd: string;
  runCmd: string;
}

const LOCK_FILE_CONFIGS: LockFileConfig[] = [
  { lockFile: 'bun.lockb', packageManager: 'bun' },
  { lockFile: 'yarn.lock', packageManager: 'yarn' },
  { lockFile: 'pnpm-lock.yaml', packageManager: 'pnpm' },
  { lockFile: 'package-lock.json', packageManager: 'npm' },
];

const DEFAULT_COMMANDS: CommandConfig = {
  pkg: 'npm',
  npxCmd: 'npx',
  installCmd: 'npm install',
  runCmd: 'npm run',
};

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

export function getNpmCommand(baseDir: string): CommandConfig {
  const pkgManager = getPkgManager(baseDir);
  const commands: CommandConfig = { ...DEFAULT_COMMANDS, pkg: pkgManager };

  switch (pkgManager) {
    case 'bun':
      commands.npxCmd = 'bunx';
      commands.installCmd = 'bun install';
      commands.runCmd = 'bun run';
      break;

    case 'pnpm':
      commands.npxCmd = 'pnpm';
      commands.installCmd = 'pnpm install';
      commands.runCmd = 'pnpm';
      break;

    case 'yarn':
      if (checkPackageManagerVersion('yarn dlx')) {
        commands.npxCmd = 'yarn';
        commands.installCmd = 'yarn';
        commands.runCmd = 'yarn';
      }
      break;
  }

  return commands;
}
