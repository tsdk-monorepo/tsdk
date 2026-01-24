import { execSync } from 'child_process';
import { getPkgManager, PackageManager } from './get-pkg-manager';

interface CommandConfig {
  pkg: PackageManager;
  npxCmd: string;
  installCmd: string;
  runCmd: string;
}

const DEFAULT_COMMANDS: CommandConfig = {
  pkg: 'npm',
  npxCmd: 'npx',
  installCmd: 'npm install',
  runCmd: 'npm run',
};

export function checkPackageManagerVersion(command: string): boolean {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
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
