import { execSync } from 'child_process';
import fsExtra from 'fs-extra';
import { ensureDir } from './config';
import { getNpmCommand } from './get-npm-command';

export async function buildSDK(needInstall = false) {
  const CMDs = getNpmCommand(process.cwd());
  if (needInstall) {
    const cmd = `${CMDs.installCmd}`;
    console.log(`Run \`${cmd}\` in dir: ${ensureDir}`);
    execSync(cmd, {
      cwd: ensureDir,
      stdio: 'inherit',
      env: process.env,
    });
    const isNodeModulesExists = await fsExtra.exists(`${ensureDir}/node_modules`);
    if (!isNodeModulesExists) {
      console.log(`\nRun \`npm install\` in dir: ${ensureDir}`);
      execSync(`npm install`, {
        cwd: ensureDir,
        stdio: 'inherit',
        env: process.env,
      });
    }
  }
  const cmd = `cd ${ensureDir} && ${CMDs.runCmd} tsc:build`;
  execSync(cmd, {
    stdio: 'inherit',
    env: process.env,
  });
}

export function buildSDKDoc() {
  execSync(`cd ${ensureDir} && ${getNpmCommand(process.cwd()).runCmd} doc:build`, {
    stdio: 'inherit',
  });
}
