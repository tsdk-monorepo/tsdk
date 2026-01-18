import { buildSDK } from './compile-tsdk';
import { tsconfigExists, parsePkg, config } from './config';
import { getNpmCommand } from './get-npm-command';
import { logger } from './log';
import { runOpenapiCommand } from './openapi-command';
import { runPrettier } from './prettier';
import { removeFields } from './remove-fields';
import { runNestCommand } from './run-nest-command';
import symbols from './symbols';
import { copyPermissionsJSON, deleteSDKFolder, syncAPI } from './sync-api';
import { addDepsIfNone, copyTsdkConfig, syncFiles } from './sync-files';
import { measureExecutionTime } from './utils';
import watcher from '@parcel/watcher';
import path from 'path';

// CLI command definitions
// Purpose: Define all CLI commands, their help text, and usage examples
// Each command should have clear, structured documentation

const CLI_COMMANDS = {
  help: `
Usage:
  $ tsdk [command] [options]

Commands:
  --help              Show this help message
  --version           Show version information
  --init              Initialize tsdk configuration file
  --sync              Sync files and generate API
  --watch             Watch mode for continuous sync
  --nest <command>    Run NestJS build commands
  --openapi <file>    Convert OpenAPI spec to apiconf.ts (Better use with -o <output dir>)

Options:
  --build             Run tsc build after sync (with --sync)
  --no-zod            Skip adding zod to dependencies (with --init or --sync)
  --no-vscode         Skip copying .vscode/ directory (with --sync)
  --no-overwrite      Preserve existing files, only create new ones (with --sync)
  --no-verbose        Only logs necessary information

Examples:
  $ tsdk --version
  $ tsdk --help
  $ tsdk --init
  $ tsdk --init --no-zod
  $ tsdk --sync
  $ tsdk --sync --build
  $ tsdk --sync --no-overwrite
  $ tsdk --sync --no-vscode --no-zod
  $ tsdk --sync --no-vscode --no-zod --no-verbose
  $ tsdk --watch
  $ tsdk --nest build
  $ tsdk --nest build <app-name>
  $ tsdk --nest build all
  $ tsdk --openapi openapi.yaml -o <ouput-dir>
  $ tsdk --openapi openapi.json -o <ouput-dir>
`,

  // Short descriptions for programmatic use
  init: 'Initialize tsdk configuration file',
  sync: 'Sync files and generate API code from configuration',
  watch: 'Watch for changes and auto-sync',
  nest: 'Run NestJS CLI commands (currently supports: build)',
  openapi: 'Convert OpenAPI specification (YAML or JSON) to TypeScript API configuration',
  version: 'Display tsdk version information',
} as const;

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
    const params = process.argv.filter((i) => i.startsWith('--'));
    await handleCommand(params);
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
        return watcher.subscribe(watchDir, async (err, events) => {
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
        });
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
async function handleCommand(params: string[]): Promise<void> {
  try {
    if (params.length === 0 || params[0] === '--help') {
      logger.info(CLI_COMMANDS.help);

      if (!tsconfigExists) logger.info(symbols.warning, VALID_PROJECT_MSG, '\n');
      return;
    }

    if (params[0] === '--version') {
      const pkg = await parsePkg();
      logger.info(`${pkg.name}@${pkg.version}`);
      return;
    }

    if (!tsconfigExists) {
      logger.error(`\nError: >> ${symbols.error} ${VALID_PROJECT_MSG}\n`);
      return process.exit(1);
    }

    switch (params[0]) {
      case '--init': {
        await copyTsdkConfig();
        const npmCommand = getNpmCommand(process.cwd());
        logger.info(
          `${symbols.info} You can edit and generate the SDK package with \`${npmCommand.npxCmd} tsdk --sync\``
        );
        await addDepsIfNone();
        break;
      }

      case '--sync': {
        const noOverwrite = params.includes('--no-overwrite');
        const withBuild = params.includes('--build');
        await handleSyncCommand(noOverwrite, withBuild);
        break;
      }

      case '--watch': {
        const noOverwrite = params.includes('--no-overwrite');
        const withBuild = params.includes('--build');
        await handleWatchCommand(noOverwrite, withBuild);
        break;
      }

      case '--nest':
        await runNestCommand();
        break;

      case '--openapi':
        await runOpenapiCommand();
        break;

      default:
        logger.info(`\n${symbols.error} Unknown command: ${params[0]}`);
        logger.info(CLI_COMMANDS.help);
        process.exit(1);
    }
  } catch (error) {
    logger.error(`\n${symbols.error} Command execution failed:`, error);
    process.exit(1);
  }
}
