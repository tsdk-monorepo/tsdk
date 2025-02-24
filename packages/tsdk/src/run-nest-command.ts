import { execSync } from 'child_process';
import fsExtra from 'fs-extra';
import path from 'path';

import symbols from './symbols';

export async function runNestCommand() {
  const idx = process.argv.findIndex((i) => i === '--nest');
  const command = process.argv[idx + 1];

  if (command === 'build') {
    const cwd = process.cwd();
    const webpackDistFile = path.posix.resolve(cwd, 'node_modules', 'nest-webpack.js');
    const copyFiles = ['nest-webpack.js', 'get-pkg-manager.js'];
    await Promise.all(
      copyFiles.map((filename) => {
        return fsExtra.copy(
          path.posix.resolve(__dirname, `../lib/${filename}`),
          path.posix.resolve(cwd, 'node_modules', filename),
          {
            overwrite: true,
          }
        );
      })
    );

    const names = process.argv.filter((i, index) => index > idx + 1);

    execSync(`node ${webpackDistFile} ${command} --names ${names.join(' ')}`, {
      stdio: 'inherit',
    });
  } else {
    console.log(symbols.warning, `\`tsdk --nest\` currently only support \`build\` command.`);
  }
}
