import { execSync } from 'child_process';
import fsExtra from 'fs-extra';
import { ensureDir } from './config';
import { getNpmCommand } from './get-npm-command';

export async function buildSDK(needInstall = false) {
  const CMDs = getNpmCommand(process.cwd());
  if (needInstall) {
    const cmd = `${CMDs.installCmd}`;
    console.log(`   Run \`${cmd}\` in dir: ${ensureDir}`);
    try {
      execSync(cmd, {
        cwd: ensureDir,
        stdio: 'pipe',
        encoding: 'utf-8',
        env: process.env,
      });
    } catch (error) {
      console.log(
        `   Run \`${cmd}\` in \`compile-tsdk.ts\` error`,
        (error as any).stdout || (error as any).stderr
      );
      throw error;
    }
    const isNodeModulesExists = await fsExtra.exists(`${ensureDir}/node_modules`);
    if (!isNodeModulesExists) {
      console.log(`\n    Run \`npm install\` in dir: ${ensureDir}`);
      try {
        execSync(`npm install`, {
          cwd: ensureDir,
          stdio: 'pipe',
          encoding: 'utf-8',
          env: process.env,
        });
      } catch (error) {
        console.error('Command failed:', (error as any).stdout || (error as any).stderr);
        throw error;
      }
    }
  }
  const cmd = `cd ${ensureDir} && ${CMDs.runCmd} tsc:build`;

  try {
    execSync(cmd, {
      stdio: 'pipe',
      encoding: 'utf-8',
      env: process.env,
    });
  } catch (error) {
    console.error('Command failed:', (error as any).stdout || (error as any).stderr);
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
    console.error('Command failed:', (error as any).stdout || (error as any).stderr);
    throw error;
  }
}
