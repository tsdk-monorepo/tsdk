import { buildSDK } from './compile-tsdk';
import { tsconfigExists, parsePkg, pkg } from './config';
import { getNpmCommand } from './get-pkg-manager';
import { runPrettier } from './prettier';
import { removeFields } from './remove-fields';
import { runNestCommand } from './run-nest-command';
import symbols from './symbols';
import { copyPermissionsJSON, deleteSDKFolder, syncAPI } from './sync-api';
import { addDepsIfNone, copyTsdkConfig, syncFiles } from './sync-files';

const cliCommands: Record<string, string> = {
  help: `
Usage
  $ tsdk

Options
  --help help
  --init initialize \`tsdk\` config file
  --sync sync files and generate api
  --sync --no-overwrite default is overwrite with template files(no overwrite for create custom files)
  --nest run nest command, only support build
  --version the version info

Examples
  $ tsdk --version
  $ tsdk --help
  $ tsdk --init
  $ tsdk --sync
  $ tsdk --sync --no-overwrite
  $
  $ tsdk --nest build
  $ tsdk --nest build [name] [name]
  $ tsdk --nest build all
`,
  init: `init \`tsdk\` config file`,
  sync: `generate api`,
  nest: `@nestjs/cli enchance`,
};

const validProjectMsg = `Please run \`tsdk\` in a valid TypeScript project's root directory.`;

async function handleCommand(params: string[]) {
  if (params.length === 0 || params[0] === '--help') {
    console.log(cliCommands.help);

    if (!tsconfigExists) {
      console.log(symbols.warning, validProjectMsg, '\n');
    }
  } else if (params[0] === '--version') {
    await parsePkg();
    console.log(`${pkg.name}@${pkg.version}`);
  } else if (!tsconfigExists) {
    console.log(`\nError: >> ${symbols.error} ${validProjectMsg}\n`);
  } else if (params[0] === `--init`) {
    await copyTsdkConfig();
    console.log(`${symbols.success} \`tsdk.config.js\` copied!`);
    console.log(
      `${symbols.info} You can edit and generate the SDK package with \`${
        getNpmCommand(process.cwd()).npxCmd
      } tsdk --sync\``
    );
    await addDepsIfNone();
  } else if (params[0] === `--sync`) {
    await deleteSDKFolder();
    await addDepsIfNone();
    const noOverwrite = params[1] === `--no-overwrite`;
    await syncFiles(noOverwrite);
    console.log('\n\n', symbols.bullet, 'build configs for generate APIs');
    await buildSDK(true);
    console.log(`${symbols.success} build configs for generate APIs`);
    await syncAPI();
    console.log('\n\n', symbols.bullet, 'build files');
    await buildSDK();
    console.log(`${symbols.success} build files\n`);
    await Promise.all([copyPermissionsJSON(), removeFields()]);
    console.log('\n\n', symbols.bullet, 'Prettier files');
    const prettierSuccess = await runPrettier();
    if (prettierSuccess) console.log(`${symbols.success} Prettier files\n`);
  } else if (params[0] === `--nest`) {
    runNestCommand();
  }
}

export async function run() {
  const params = process.argv.filter((i) => i.startsWith('--'));
  await handleCommand(params);
}

run();
