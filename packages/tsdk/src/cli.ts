import { buildSDK } from './compile-tsdk';
import { tsconfigExists, parsePkg, pkg } from './config';
import { removeFields } from './remove-fields';
import { runNestCommand } from './run-nest-command';
import symbols from './symbols';
import { copyPermissionsJSON, syncAPI } from './sync-api';
import { addDepsIfNone, copyTsdkrc, syncFiles } from './sync-files';

export async function run() {
  const params = process.argv.filter((i) => i.startsWith('--'));

  const commands: { [key: string]: any } = {
    help: `
Usage
  $ tsdk

Options
  --help help
  --init initialize \`tsdk\` config file
  --sync sync files and generate api
  --nest run nest command, only support build
  --version the verison info

Examples
  $ tsdk --version
  $ tsdk --help
  $ tsdk --init
  $ tsdk --sync
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

  if (params.length === 0 || params[0] === '--help') {
    console.log(commands.help);

    if (!tsconfigExists) {
      console.log(symbols.warning, validProjectMsg, '\n');
    }
  } else if (params[0] === '--version') {
    await parsePkg();
    console.log(`${pkg.name}@${pkg.version}`);
  } else if (params.length > 1) {
    console.log(symbols.error, 'only one parameter support');
  } else if (!tsconfigExists) {
    console.log('\n', 'Error: >> ', symbols.error, validProjectMsg, '\n');
  } else if (params[0] === `--init`) {
    await copyTsdkrc();
    console.log(symbols.success, '`.tsdkrc` copied!');
    console.log(symbols.info, 'You can edit and generate the SDK package with `npx tsdk --sync`');
    await addDepsIfNone();
  } else if (params[0] === `--sync`) {
    await addDepsIfNone();
    await syncFiles();
    console.log('\n\n', symbols.bullet, 'build configs for generate APIs');
    buildSDK();
    console.log(symbols.success, 'build configs for generate APIs');
    await syncAPI();
    console.log('\n\n', symbols.bullet, 'build files');
    buildSDK();
    console.log(symbols.success, 'build files\n');
    await copyPermissionsJSON();
    await removeFields();
  } else if (params[0] === `--nest`) {
    runNestCommand();
  }
}

run();
