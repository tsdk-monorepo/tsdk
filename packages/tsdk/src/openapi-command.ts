import { execSync } from 'child_process';
import path from 'path';

import symbols from './symbols';
import { logger } from './log';

export async function runOpenapiCommand() {
  const idx = process.argv.findIndex((i) => i === '--openapi');
  const restArgv = process.argv.slice(idx + 1);
  const openapiScript = path.join(__dirname, 'openapi.js');
  if (openapiScript) {
    const cmd = `node ${openapiScript} ${restArgv.join(' ')}`;
    logger.log(`${symbols.info} Run \`${cmd}\``);
    execSync(cmd, { stdio: 'inherit' });
  } else {
    logger.warn(symbols.warning, `\`tsdk --openapi\` currently only support \`build\` command.`);
  }
}
