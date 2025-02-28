import { buildConfigs, buildSDK } from './compile-tsdk';
import { tsconfigExists, parsePkg } from './config';
import { getNpmCommand } from './get-pkg-manager';
import { runPrettier } from './prettier';
import { removeFields } from './remove-fields';
import { runNestCommand } from './run-nest-command';
import symbols from './symbols';
import { copyPermissionsJSON, deleteSDKFolder, syncAPI } from './sync-api';
import { addDepsIfNone, copyTsdkConfig, syncFiles } from './sync-files';
import { measureExecutionTime } from './utils';

const CLI_COMMANDS = {
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

const VALID_PROJECT_MSG = `Please run \`tsdk\` in a valid TypeScript project's root directory.`;

/**
 * Handles sync command with parallelization where possible
 * @param noOverwrite Whether to use no-overwrite mode
 */
async function handleSyncCommand(noOverwrite: boolean): Promise<void> {
  try {
    await measureExecutionTime('Delete SDK folder', () => deleteSDKFolder());
    await measureExecutionTime('Add dependencies if none', () => addDepsIfNone());
    await measureExecutionTime('Sync files', () => syncFiles(noOverwrite));

    await measureExecutionTime('Build SDK (configs)', () => buildConfigs(true));

    await measureExecutionTime('Sync API', () => syncAPI());

    await measureExecutionTime('Build SDK (files)', () => buildSDK());

    // Execute these tasks in parallel
    await measureExecutionTime('Post-processing', async () => {
      await Promise.all([
        measureExecutionTime('Copy permissions JSON', () => copyPermissionsJSON()),
        measureExecutionTime('Remove fields', () => removeFields()),
      ]);
    });

    const prettierSuccess = await measureExecutionTime('Run Prettier', () => runPrettier());
    if (prettierSuccess) console.log(`${symbols.success} Prettier files\n`);
  } catch (error) {
    console.error(`\n${symbols.error} Sync command failed:`, error);
    process.exit(1);
  }
}

/**
 * Handles CLI commands
 * @param params Command line parameters
 */
async function handleCommand(params: string[]): Promise<void> {
  try {
    if (params.length === 0 || params[0] === '--help') {
      console.log(CLI_COMMANDS.help);

      if (!tsconfigExists) {
        console.log(symbols.warning, VALID_PROJECT_MSG, '\n');
      }
      return;
    }

    if (params[0] === '--version') {
      const pkg = await measureExecutionTime('Parse package.json', parsePkg);
      console.log(`${pkg.name}@${pkg.version}`);
      return;
    }

    if (!tsconfigExists) {
      console.error(`\nError: >> ${symbols.error} ${VALID_PROJECT_MSG}\n`);
      process.exit(1);
      return;
    }

    switch (params[0]) {
      case '--init': {
        await measureExecutionTime('Copy `tsdk.config.js`', copyTsdkConfig);
        const npmCommand = getNpmCommand(process.cwd());
        console.log(
          `${symbols.info} You can edit and generate the SDK package with \`${npmCommand.npxCmd} tsdk --sync\``
        );
        await measureExecutionTime('Add dependencies if none', addDepsIfNone);
        break;
      }

      case '--sync': {
        const noOverwrite = params.includes('--no-overwrite');
        await handleSyncCommand(noOverwrite);
        break;
      }

      case '--nest':
        await measureExecutionTime('Run Nest command', runNestCommand);
        break;

      default:
        console.log(`\n${symbols.error} Unknown command: ${params[0]}`);
        console.log(CLI_COMMANDS.help);
        process.exit(1);
    }
  } catch (error) {
    console.error(`\n${symbols.error} Command execution failed:`, error);
    process.exit(1);
  }
}

/**
 * Main function to run the CLI
 */
export async function run(): Promise<void> {
  const startTime = Date.now();
  try {
    const params = process.argv.filter((i) => i.startsWith('--'));
    await handleCommand(params);
    const totalTime = Date.now() - startTime;
    console.log(`\n✅ Total execution time: ${(totalTime / 1000).toFixed(2)}s`);
  } catch (error) {
    console.error(`\n${symbols.error} Unexpected error:`, error);
    const totalTime = Date.now() - startTime;
    console.log(`\n❌ Failed after: ${(totalTime / 1000).toFixed(2)}s`);
    process.exit(1);
  }
}

// Execute the CLI
run();
