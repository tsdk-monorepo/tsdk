import { execSync } from 'child_process';
import fsExtra from 'fs-extra';
import path from 'path';

import symbols from './symbols';
import { logger } from './log';

export async function runNestCommand() {
  const idx = process.argv.findIndex((i) => i === '--nest' || i === 'nest');
  const command = process.argv[idx + 1];

  if (command === 'build') {
    const cwd = process.cwd();
    const webpackDistFile = path.resolve(cwd, 'node_modules', 'nest-webpack.js');
    const copyFiles = ['nest-webpack.js', 'get-pkg-manager.js', 'get-npm-command.js'];
    await Promise.all(
      copyFiles.map((filename) => {
        return fsExtra.copy(
          path.resolve(__dirname, `../lib/${filename}`),
          path.resolve(cwd, 'node_modules', filename),
          {
            overwrite: true,
          }
        );
      })
    );

    const names = process.argv.filter((i, index) => index > idx + 1);

    try {
      execSync(`node ${webpackDistFile} ${command} --names ${names.join(' ')}`, {
        stdio: 'inherit',
        encoding: 'utf-8',
      });
    } catch (error) {
      logger.error('Command failed:', (error as any).stdout || (error as any).stderr);
      throw error;
    }
  } else {
    logger.log(symbols.warning, `\`tsdk nest\` currently only support \`build\` command.`);
  }
}
