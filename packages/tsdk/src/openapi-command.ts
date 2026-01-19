import { execSync } from 'child_process';
import path from 'path';

import symbols from './symbols';
import { logger } from './log';

export async function runOpenapiToApiconfCommand() {
  const idx = process.argv.findIndex((i) => i === '--from-openapi');
  const restArgv = process.argv.slice(idx + 1);
  const openapiScript = path.join(__dirname, 'from-openapi.js');
  if (openapiScript) {
    const cmd = `node ${openapiScript} ${restArgv.join(' ')}`;
    logger.log(`${symbols.info} Run \`${cmd}\``);
    execSync(cmd, { stdio: 'inherit' });
  } else {
    logger.warn(
      symbols.warning,
      `\`tsdk --from-openapi\` currently only support \`build\` command.`
    );
  }
}

export async function runApiconfToOpenapiCommand() {
  const idx = process.argv.findIndex((i) => i === '--to-openapi');
  const restArgv = process.argv.slice(idx + 1);
  const openapiScript = path.join(__dirname, 'to-openapi.js');
  if (openapiScript) {
    const cmd = `node ${openapiScript} ${restArgv.join(' ')}`;
    logger.log(`${symbols.info} Run \`${cmd}\``);
    execSync(cmd, { stdio: 'inherit' });
  } else {
    logger.warn(symbols.warning, `\`tsdk --to-openapi\` currently only support \`build\` command.`);
  }
}
