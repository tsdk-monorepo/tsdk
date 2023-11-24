import { execSync } from 'child_process';
import path from 'path';

import { config, packageFolder } from './config';

export async function runPrettier() {
  const rootDir = path.resolve(process.cwd(), config.monorepoRoot || './');
  const formatDir = path.resolve(process.cwd(), config.packageDir, packageFolder);

  try {
    // prettier 3.x
    execSync(`node ${rootDir}/node_modules/prettier/bin/prettier.cjs ${formatDir} --write`, {
      stdio: 'pipe',
    });
  } catch (e) {
    try {
      // prettier 2.x
      execSync(`node ${rootDir}/node_modules/prettier/bin-prettier ${formatDir} --write`, {
        stdio: 'pipe',
      });
    } catch (e) {
      //
    }
  }
}
