import * as path from 'path';
import * as fsExtra from 'fs-extra';
import { execSync } from 'child_process';
import symbols from './symbols';

export async function runNestCommand() {
  const idx = process.argv.findIndex((i) => i === '--nest');
  const command = process.argv[idx + 1];

  // if (command === 'start' || command === 'build') {
  if (command === 'build') {
    // copy `tsdk/lib/nest-webpack.js` to `process.cwd()+/node_modules/nest-webpack.js`
    const webpackDistFile = path.resolve(
      process.cwd(),
      'node_modules',
      'nest-webpack.js'
    );
    await fsExtra.copy(
      path.resolve(__dirname, '../lib/nest-webpack.js'),
      webpackDistFile,
      { overwrite: true }
    );

    const names = process.argv.filter((i, index) => index > idx + 1);

    execSync(`node ${webpackDistFile} ${command} --names ${names.join(' ')}`, {
      stdio: 'inherit',
    });
  } else {
    console.log(
      symbols.warning,
      `\`tsdk --nest\` currently only support \`build\` command.`
    );
  }
}
