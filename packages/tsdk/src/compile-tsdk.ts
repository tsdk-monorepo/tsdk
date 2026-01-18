import { execSync } from 'child_process';
import fsExtra from 'fs-extra';
import { config, ensureDir } from './config';
import { getNpmCommand } from './get-npm-command';
import { logger } from './log';

export async function buildSDK(needInstall = false) {
  const CMDs = getNpmCommand(process.cwd());
  if (needInstall) {
    const cmd = `${CMDs.installCmd}`;
    logger.info(`   Run \`${cmd}\` in dir: ${ensureDir}`);
    try {
      execSync(cmd, {
        cwd: ensureDir,
        stdio: 'pipe',
        encoding: 'utf-8',
        env: process.env,
      });
    } catch (error) {
      logger.error(
        `   Run \`${cmd}\` in \`compile-tsdk.ts\` error`,
        (error as any).stdout || (error as any).stderr
      );
      throw error;
    }
    const isNodeModulesExists = await fsExtra.exists(`${ensureDir}/node_modules`);
    if (!isNodeModulesExists) {
      logger.log(`\n    Run \`npm install\` in dir: ${ensureDir}`);
      try {
        execSync(`npm install`, {
          cwd: ensureDir,
          stdio: 'pipe',
          encoding: 'utf-8',
          env: process.env,
        });
      } catch (error) {
        logger.error('Command failed:', (error as any).stdout || (error as any).stderr);
        throw error;
      }
    }
  }
  if (config.moduleType === 'disabled') {
    logger.info(`   Ignore run tsc; because \`moduleType:'disabled'\``);
    return;
  }
  const tscBuild = !config.moduleType
    ? 'tsc:build'
    : config.moduleType === 'module'
      ? 'tsc:build:esm'
      : 'tsc:build:cjs';
  const cmd = `cd ${ensureDir} && ${CMDs.runCmd} ${tscBuild}`;
  logger.log(`   Run \`${cmd}\``);
  try {
    execSync(cmd, {
      stdio: 'pipe',
      encoding: 'utf-8',
      env: process.env,
    });
  } catch (error) {
    logger.error('Command failed:', (error as any).stdout || (error as any).stderr);
    throw error;
  }
}

export function buildSDKDoc() {
  try {
    execSync(`cd ${ensureDir} && ${getNpmCommand(process.cwd()).runCmd} doc:build`, {
      stdio: 'pipe',
      encoding: 'utf-8',
    });
  } catch (error) {
    logger.error('Command failed:', (error as any).stdout || (error as any).stderr);
    throw error;
  }
}
