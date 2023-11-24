import { execSync } from 'child_process';

import { ensureDir } from './config';
import { getNpmCommand } from './get-pkg-manager';

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
