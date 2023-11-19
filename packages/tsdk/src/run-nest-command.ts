import { execSync } from 'child_process';
import fsExtra from 'fs-extra';
import path from 'path';

import symbols from './symbols';

export async function runNestCommand() {
  const idx = process.argv.findIndex((i) => i === '--nest');
  const command = process.argv[idx + 1];

  if (command === 'build') {
    const cwd = process.cwd();
    const webpackDistFile = path.resolve(cwd, 'node_modules', 'nest-webpack.js');
    const pkgManagerDistFile = path.resolve(cwd, 'node_modules', 'get-pkg-manager.js');
    await Promise.all([
      fsExtra.copy(path.resolve(__dirname, '../lib/nest-webpack.js'), webpackDistFile, {
        overwrite: true,
      }),
      fsExtra.copy(path.resolve(__dirname, '../lib/get-pkg-manager.js'), pkgManagerDistFile, {
        overwrite: true,
      }),
    ]);

    const names = process.argv.filter((i, index) => index > idx + 1);

    execSync(`node ${webpackDistFile} ${command} --names ${names.join(' ')}`, {
      stdio: 'inherit',
    });
  } else {
    console.log(symbols.warning, `\`tsdk --nest\` currently only support \`build\` command.`);
  }
}
