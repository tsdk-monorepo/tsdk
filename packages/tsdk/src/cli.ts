import { buildSDK } from './compile-tsdk';
import { tsconfigExists, parsePkg, config } from './config';
import { addModule } from './create/add-module';
import { createTemplate } from './create/create-template';
import { getNpmCommand } from './get-npm-command';
import { logger } from './log';
import { runOpenapiToApiconfCommand, runApiconfToOpenapiCommand } from './openapi-command';
import { runPrettier } from './prettier';
import { removeFields } from './remove-fields';
import { runNestCommand } from './run-nest-command';
import symbols from './symbols';
import { copyPermissionsJSON, deleteSDKFolder, syncAPI } from './sync-api';
import { addDepsIfNone, copyTsdkConfig, syncFiles } from './sync-files';
import { ignorePatterns, measureExecutionTime } from './utils';
import watcher from '@parcel/watcher';
import path from 'path';

// CLI command definitions
// Purpose: Define all CLI commands, their help text, and usage examples
// Each command should have clear, structured documentation
const CLI_COMMANDS = {
  help: `
${bold('tsdk')} - TypeScript Development Kit

${bold('USAGE')}
  ${dim('$')} tsdk ${yellow('[command]')} ${cyan('[options]')}

${bold('COMMANDS')}
  ${yellow('create')} ${cyan('[name]')}           Create a new project from Git template
  ${yellow('add')} ${cyan('<module>')}            Add a module to current project
  ${yellow('init')}                      Initialize tsdk configuration file
  ${yellow('sync')}                      Sync files and generate API
  ${yellow('watch')}                     Watch mode for continuous sync
  ${yellow('nest')} ${cyan('<command>')}          Run NestJS build commands
  ${yellow('from-openapi')} ${cyan('<file>')}     Convert OpenAPI spec to *.apiconf.ts
  ${yellow('to-openapi')}                Convert *.apiconf.ts to OpenAPI spec

${bold('OPTIONS')}
  ${cyan('--help, -h')}                 Show this help message
  ${cyan('--version, -v')}              Show version information
  ${cyan('--build')}                    Run tsc build after sync ${dim('(with --sync)')}
  ${cyan('--no-zod')}                   Skip adding zod to dependencies
  ${cyan('--no-vscode')}                Skip copying .vscode/ directory ${dim('(with --sync)')}
  ${cyan('--no-overwrite')}             Preserve existing files, only create new ones
  ${cyan('--no-verbose')}               Only log necessary information
  ${cyan('-o, --output')} ${yellow('<dir>')}        Output directory ${dim('(with --from-openapi)')}
  ${cyan('-t, --template')} ${yellow('<repo>')}     Git repository for template ${dim('(with create)')}

${bold('EXAMPLES')}
  ${dim('# Project scaffolding')}
  ${dim('$')} tsdk create my-app ${cyan('--template')} user/react-template
  ${dim('$')} tsdk create backend ${cyan('-t')} company/express-starter
  ${dim('$')} tsdk add user/auth-module
  ${dim('$')} tsdk add https://github.com/user/payment-module.git

  ${dim('# Configuration & sync')}
  ${dim('$')} tsdk init
  ${dim('$')} tsdk init ${cyan('--no-zod')}
  ${dim('$')} tsdk sync
  ${dim('$')} tsdk sync ${cyan('--build')}
  ${dim('$')} tsdk sync ${cyan('--no-overwrite --no-vscode')}
  ${dim('$')} tsdk watch

  ${dim('# NestJS integration')}
  ${dim('$')} tsdk nest build
  ${dim('$')} tsdk nest build ${yellow('<app-name>')}
  ${dim('$')} tsdk nest build all

  ${dim('# OpenAPI conversion')}
  ${dim('$')} tsdk to-openapi
  ${dim('$')} tsdk from-openapi openapi.yaml ${cyan('-o')} ${yellow('./src/api')}
  ${dim('$')} tsdk from-openapi spec.json ${cyan('--output')} ${yellow('./generated')}

${bold('TEMPLATES & MODULES')}
  Templates and modules are sourced from Git repositories:
  • ${cyan('user/repo')}              GitHub short form
  • ${cyan('user/repo#branch')}       Specific branch
  • ${cyan('https://...')}            Full Git URL

  Create your own:
  • Templates: Any Git repo with a valid project structure
  • Modules: Git repo with ${yellow('module.json')} at root

${dim('Documentation:')} https://github.com/tsdk-monorepo/tsdk
${dim('Report issues:')} https://github.com/tsdk-monorepo/tsdk/issues
`,

  // Short descriptions for programmatic use
  create: 'Create a new project from Git template',
  add: 'Add a module from Git repository to current project',
  init: 'Initialize tsdk configuration file',
  sync: 'Sync files and generate API code from configuration',
  watch: 'Watch for changes and auto-sync',
  nest: 'Run NestJS CLI commands (currently supports: build)',
  'from-openapi': 'Convert OpenAPI specification (YAML or JSON) to TypeScript API configuration',
  'to-openapi': 'Convert TypeScript API configuration to OpenAPI specification (YAML or JSON)',
  version: 'Display tsdk version information',
} as const;

// Color helpers (if not already imported from picocolors)
function bold(str: string) {
  return `\x1b[1m${str}\x1b[0m`;
}
function dim(str: string) {
  return `\x1b[2m${str}\x1b[0m`;
}
function yellow(str: string) {
  return `\x1b[33m${str}\x1b[0m`;
}
function cyan(str: string) {
  return `\x1b[36m${str}\x1b[0m`;
}

// Map old flags to new commands
const LEGACY_MAPPING: Record<string, CommandKey> = {
  '--init': 'init',
  '--sync': 'sync',
  '--watch': 'watch',
  '--nest': 'nest',
  '--from-openapi': 'from-openapi',
  '--to-openapi': 'to-openapi',
  '--help': 'help',
  '-h': 'help',
  '--version': 'version',
  '-v': 'version',
};

export type CommandKey = keyof typeof CLI_COMMANDS;
/**
 * Normalizes arguments to ensure compatibility between
 * old style (flags) and new style (commands).
 */
export function resolveCommand(args: string[]): { command: CommandKey; args: string[] } {
  const primaryInput = args[0];

  // 1. Handle empty input
  if (!primaryInput) {
    return { command: 'help', args: [] };
  }

  // 2. Check if it's a known new-style command
  if (primaryInput in CLI_COMMANDS && primaryInput !== 'help') {
    return {
      command: primaryInput as CommandKey,
      args: args.slice(1),
    };
  }

  // 3. Check legacy mapping (Old Style conversion)
  if (LEGACY_MAPPING[primaryInput]) {
    // If user typed 'tsdk --sync', we treat it as 'tsdk sync'
    return {
      command: LEGACY_MAPPING[primaryInput],
      args: args.slice(1),
    };
  }

  // 4. Fallback for unknown commands
  return { command: 'help', args: [] };
}

// Validate that a command exists
function isValidCommand(cmd: string): cmd is keyof typeof CLI_COMMANDS {
  return cmd in CLI_COMMANDS;
}

// Get command description
function getCommandDescription(cmd: keyof typeof CLI_COMMANDS): string {
  return CLI_COMMANDS[cmd];
}

export { CLI_COMMANDS, isValidCommand, getCommandDescription };

const VALID_PROJECT_MSG = `Please run \`tsdk\` in a valid TypeScript project! Check: https://tsdk.dev/docs/start-a-typescript-project`;

/**
 * Main function to run the CLI
 */
export async function run(): Promise<void> {
  const startTime = Date.now();
  try {
    const tsdkIdx = process.argv.findIndex(
      (item) => item.endsWith('tsdk') || item.endsWith('tsdk.js')
    );
    const rawArgs = process.argv.filter((item, idx) => idx > tsdkIdx);
    // Normalize args using our compatibility layer
    const { command, args: commandArgs } = resolveCommand(rawArgs);
    await handleCommand(command, commandArgs);
    if (['create', 'watch'].includes(command)) return;
    const totalTime = Date.now() - startTime;
    logger.log(`\n✅ Total execution time: ${(totalTime / 1000).toFixed(2)}s`);
  } catch (error) {
    logger.error(`\n${symbols.error} Unexpected error:`);
    logger.error(error);
    const totalTime = Date.now() - startTime;
    logger.error(`\n❌ Failed after: ${(totalTime / 1000).toFixed(2)}s`);
    process.exit(1);
  }
}

// Execute the CLI
run();

/**
 * Handles sync command with parallelization where possible
 * @param noOverwrite Whether to use no-overwrite mode
 * @param needBuild Run build
 */
async function handleSyncCommand(
  noOverwrite: boolean,
  needBuild = false,
  prettier = true
): Promise<void> {
  try {
    await measureExecutionTime(`Delete SDK ${config.baseDir} folder`, () => deleteSDKFolder());
    await measureExecutionTime('Add dependencies if none', () => addDepsIfNone());

    const result = await measureExecutionTime('Sync files', () => syncFiles(noOverwrite));

    await measureExecutionTime('Generating API', () =>
      syncAPI(result?.apiconfs || [], result?.types || [])
    );
    if (needBuild) {
      await measureExecutionTime('Build SDK', () => buildSDK(true));
    }

    const removeFieldsValue = config.removeFields ?? ['needAuth'];
    // Execute these tasks in parallel
    await measureExecutionTime('Post-processing', async () => {
      await Promise.all([
        measureExecutionTime('Copy permissions JSON', () => copyPermissionsJSON(), '    '),
        removeFieldsValue.length > 0
          ? measureExecutionTime('Remove fields', () => removeFields(), '    ')
          : Promise.resolve(1),
      ]);
    });

    if (prettier) {
      const prettierSuccess = await measureExecutionTime('Run Prettier', () => runPrettier());
      if (prettierSuccess) logger.log(`${symbols.success} Prettier files\n`);
    }
  } catch (error) {
    logger.error(`\n${symbols.error} Sync command failed:`);
    logger.error(error);
    process.exit(1);
  }
}

/**
 * Watch mode implementation using @parcel/watcher
 * Monitors apiconf files and triggers sync on changes
 * @param noOverwrite Whether to use no-overwrite mode
 * @param needBuild Run build after each sync
 */
async function handleWatchCommand(noOverwrite: boolean, needBuild = false): Promise<void> {
  logger.info(`${symbols.info} Starting watch mode...`);

  // Run initial sync
  logger.info(`${symbols.info} Running initial sync...`);
  let DEBOUNCE_MS = 300;
  const start = Date.now();
  await handleSyncCommand(noOverwrite, needBuild, false);
  DEBOUNCE_MS = Math.max(DEBOUNCE_MS, Date.now() - start + 50);
  const pattern = path.join(...config.baseDir.split('/'));
  // Determine watch directories from config
  const watchDirs: string[] = [];
  const dirs = [pattern, ...(config.sharedDirs || [])];

  // Convert to absolute paths
  const absoluteDirs = dirs.map((dir) =>
    path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir)
  );
  // Remove subdirectories if parent is already watched
  const filteredDirs = absoluteDirs.filter((dir, index, array) => {
    // Check if any OTHER directory is a parent of this one
    return !array.some((otherDir, otherIndex) => {
      if (index === otherIndex) return false;
      // Is otherDir a parent of dir?
      const relative = path.relative(otherDir, dir);
      return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
    });
  });
  watchDirs.push(...filteredDirs);

  logger.info(`${symbols.info} Watching for changes in:`);
  watchDirs.forEach((dir) => logger.info(`  - ${dir}`));
  logger.info(`\n${symbols.info} Press Ctrl+C to stop`);

  // Build file extension patterns from config
  const { apiconfExt, entityExt, shareExt } = config;

  // Track last sync time to debounce rapid changes
  let lastSyncTime = Date.now();
  let syncTimeout: NodeJS.Timeout | null = null;

  /**
   * Check if file matches watched extensions
   * Matches patterns like: *.apiconf.ts, *.entity.ts, *.shared.ts
   * shareExt uses pattern: *.{shareExt}.* (e.g., *.shared.ts, *.shared.json)
   */
  function isRelevantFile(filePath: string): boolean {
    const fileName = path.basename(filePath);

    // Check apiconf pattern: *.apiconf.ts
    const apiconfPattern = `.${apiconfExt}.ts`;
    if (fileName.endsWith(apiconfPattern)) return true;

    // Check entity pattern: *.entity.ts
    const entityPattern = `.${entityExt}.ts`;
    if (fileName.endsWith(entityPattern)) return true;

    // Check shareExt pattern: *.{shareExt}.{ext}
    // Match files like: *.shared.ts, *.shared.json, *.shared.jpg
    // Split on last dot to get the final extension
    const parts = fileName.split('.');
    if (parts.length >= 3) {
      // Check if second-to-last part matches shareExt
      const secondToLast = parts[parts.length - 2];
      if (secondToLast === shareExt) return true;
    }

    return false;
  }

  try {
    // Subscribe to all watch directories
    const subscriptions = await Promise.all(
      watchDirs.map(async (watchDir) => {
        return watcher.subscribe(
          watchDir,
          async (err, events) => {
            if (err) {
              logger.error(`\n${symbols.error} Watch error in ${watchDir}:`, err);
              return;
            }

            // Filter for relevant file changes based on configured extensions
            const relevantChanges = events.filter((event) => isRelevantFile(event.path));

            if (relevantChanges.length === 0) return;

            // Log detected changes
            logger.info(`\n${symbols.info} Detected changes:`);
            relevantChanges.forEach((event) => {
              const relativePath = path.relative(process.cwd(), event.path);
              logger.info(`  ${event.type}: ${relativePath}`);
            });

            // Debounce: wait for changes to settle before syncing
            if (syncTimeout) clearTimeout(syncTimeout);

            syncTimeout = setTimeout(async () => {
              const now = Date.now();
              const timeSinceLastSync = now - lastSyncTime;

              if (timeSinceLastSync < DEBOUNCE_MS) return;

              lastSyncTime = now;
              logger.info(`${symbols.info} Syncing changes...`);
              let spendTime = 0;
              try {
                await handleSyncCommand(noOverwrite, needBuild, false);
                spendTime = Date.now() - lastSyncTime;
                logger.info(
                  `${symbols.success}Sync complete in ${spendTime}ms. Watching for changes...\n`
                );
              } catch (error) {
                spendTime = Date.now() - lastSyncTime;
                logger.error(`${symbols.error} Sync failed:`, error);
                logger.log(`${symbols.info} Continuing to watch for changes...\n`);
              }
              DEBOUNCE_MS = Math.max(DEBOUNCE_MS, spendTime + 50);
            }, DEBOUNCE_MS);
          },
          { ignore: ignorePatterns }
        );
      })
    );

    // Handle graceful shutdown
    const cleanup = async () => {
      logger.info(`\n\n${symbols.info} Shutting down watch mode...`);
      if (syncTimeout) clearTimeout(syncTimeout);
      await Promise.all(subscriptions.map((sub) => sub.unsubscribe()));
      logger.info(`${symbols.success} Watch mode stopped\n`);
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    // Keep process alive
    await new Promise(() => {});
  } catch (error) {
    logger.error(`\n${symbols.error} Failed to start watch mode:`, error);
    process.exit(1);
  }
}

/**
 * Handles CLI commands
 * @param params Command line parameters
 */
async function handleCommand(command: string, commandArgs: string[]): Promise<void> {
  const params = commandArgs;
  try {
    if (command === 'help') {
      logger.info(CLI_COMMANDS.help);

      if (!tsconfigExists) logger.info(symbols.warning, VALID_PROJECT_MSG, '\n');
      return;
    }

    if (command === 'version') {
      const pkg = await parsePkg();
      logger.info(`${pkg.name}@${pkg.version}`);
      return;
    }

    if (!tsconfigExists) {
      logger.error(`\nError: >> ${symbols.error} ${VALID_PROJECT_MSG}\n`);
      return process.exit(1);
    }

    switch (command) {
      case 'create':
        createTemplate(commandArgs);
        break;

      case 'add':
        addModule(commandArgs);
        break;
      case 'init': {
        await copyTsdkConfig();
        const npmCommand = getNpmCommand(process.cwd());
        logger.info(
          `${symbols.info} You can edit and generate the SDK package with \`${npmCommand.npxCmd} tsdk --sync\``
        );
        await addDepsIfNone();
        break;
      }

      case 'sync': {
        const noOverwrite = params.includes('--no-overwrite');
        const withBuild = params.includes('--build');
        await handleSyncCommand(noOverwrite, withBuild);
        break;
      }

      case 'watch': {
        const noOverwrite = params.includes('--no-overwrite');
        const withBuild = params.includes('--build');
        await handleWatchCommand(noOverwrite, withBuild);
        break;
      }

      case 'nest':
        await runNestCommand();
        break;

      case 'from-openapi':
        await runOpenapiToApiconfCommand();
        break;

      case 'to-openapi':
        await runApiconfToOpenapiCommand();
        break;

      default:
        logger.info(`\n${symbols.error} Unknown command: ${command}`);
        logger.info(CLI_COMMANDS.help);
        process.exit(1);
    }
  } catch (error) {
    logger.error(`\n${symbols.error} Command execution failed:`, error);
    process.exit(1);
  }
}
