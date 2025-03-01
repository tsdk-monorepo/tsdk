import { execSync } from 'child_process';
import fsExtra from 'fs-extra';
import { ensureDir } from './config';
import { getNpmCommand } from './get-pkg-manager';

export async function buildConfigs(needInstall = false) {
  const CMDs = getNpmCommand(process.cwd());
  if (needInstall) {
    const cmd = `${CMDs.installCmd}`;
    console.log(`Run \`${cmd}\` in dir: ${ensureDir}`);
    execSync(cmd, {
      cwd: ensureDir,
      stdio: 'inherit',
    });
    const isNodeModulesExists = await fsExtra.exists(`${ensureDir}/node_modules`);
    if (!isNodeModulesExists) {
      console.log(`\nRun \`npm install\` in dir: ${ensureDir}`);
      execSync(`npm install`, {
        cwd: ensureDir,
        stdio: 'inherit',
      });
    }
    execSync(`${CMDs.runCmd} tsc:build:cjs`, {
      cwd: ensureDir,
      stdio: 'inherit',
    });
  }
}

export async function buildSDK(needInstall = false) {
  const CMDs = getNpmCommand(process.cwd());
  execSync(
    `cd ${ensureDir} ${needInstall ? `&& ${CMDs.installCmd} ` : ``}&& ${CMDs.runCmd} tsc:build`,
    {
      stdio: 'inherit',
    }
  );
}

export function buildSDKDoc() {
  execSync(`cd ${ensureDir} && ${getNpmCommand(process.cwd()).runCmd} doc:build`, {
    stdio: 'inherit',
  });
}
