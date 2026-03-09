import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import * as prompts from '@clack/prompts';
import { parseArgv } from '../utils';

// ============================================================================
// Types
// ============================================================================

interface ModuleConfig {
  name: string;
  description?: string;
  files?: Array<{
    src: string;
    dest: string;
  }>;
  dependencies?: string[];
  routes?: Array<{
    path: string;
    file: string;
  }>;
  postInstall?: string;
}

// ============================================================================
// Main Entry
// ============================================================================

export async function addModule(argv: string[]) {
  // Check if in a project
  if (!fs.existsSync('package.json')) {
    prompts.log.error('Not in a project directory (package.json not found)');
    process.exit(1);
  }
  // Check if in a TypeScript project
  if (!fs.existsSync('tsconfig.json')) {
    prompts.log.error('Not in a TypeScript project directory (tsconfig.json not found)');
    process.exit(1);
  }
  // Check if in a tsdk project
  if (!fs.existsSync('tsdk.config.js')) {
    prompts.log.error('Not in a tsdk project directory (tsdk.config.js not found)');
    process.exit(1);
  }

  prompts.intro('📦 Add Module');
  const argvObj = parseArgv(argv);

  try {
    // 1. Get module repository
    const moduleRepo =
      argv[0] ||
      (await prompts.text({
        message: 'Module repository:',
        placeholder: 'user/repo or https://github.com/user/repo.git',
        validate: (v) => (v ? undefined : 'Required'),
      }));
    if (prompts.isCancel(moduleRepo)) exit();

    // 2. Download module to temp directory
    const spinner = prompts.spinner();
    spinner.start('Downloading module...');

    const tempDir = downloadModule(String(moduleRepo));

    spinner.stop('Module downloaded');

    // 3. Parse module.json
    const configPath = path.join(tempDir, 'module.json');
    if (!fs.existsSync(configPath)) {
      throw new Error('Invalid module: module.json not found');
    }

    const config: ModuleConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    // 4. Show module info
    prompts.log.info(`
Name: ${config.name}
${config.description ? `Description: ${config.description}` : ''}
`);

    // 5. Confirm installation
    const confirm = await prompts.confirm({
      message: `Install "${config.name}"?`,
      initialValue: true,
    });
    if (prompts.isCancel(confirm) || !confirm) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      exit();
    }

    // 6. Install module
    spinner.start('Installing module...');
    installModule(process.cwd(), tempDir, config);
    spinner.stop('Module installed');

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });

    prompts.outro(`✅ Module "${config.name}" installed
${config.postInstall ? `\n${config.postInstall}` : ''}`);
  } catch (error: any) {
    prompts.log.error(error.message);
    process.exit(1);
  }
}

// ============================================================================
// Module Download
// ============================================================================

function downloadModule(repo: string): string {
  const [repoPath, branch] = repo.split('#');

  let url = repoPath;
  if (!repoPath.startsWith('http')) {
    url = `https://github.com/${repoPath}.git`;
  }

  const tempDir = fs.mkdtempSync(path.join(process.cwd(), '.tsdk-module-'));

  const args = ['clone', '--depth', '1'];
  if (branch) args.push('--branch', branch);
  args.push(url, tempDir);

  try {
    execSync(`git ${args.join(' ')}`, { stdio: 'pipe' });

    // Remove .git
    const gitDir = path.join(tempDir, '.git');
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
    }

    return tempDir;
  } catch {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    throw new Error(`Failed to download module: ${repo}`);
  }
}

// ============================================================================
// Module Installation
// ============================================================================

function installModule(projectRoot: string, modulePath: string, config: ModuleConfig) {
  // 1. Copy files
  if (config.files) {
    config.files.forEach(({ src, dest }) => {
      const srcPath = path.join(modulePath, src);
      const destPath = path.join(projectRoot, dest);

      if (!fs.existsSync(srcPath)) {
        prompts.log.warn(`File not found: ${src}`);
        return;
      }

      fs.mkdirSync(path.dirname(destPath), { recursive: true });

      if (fs.statSync(srcPath).isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }

  // 2. Install dependencies
  if (config.dependencies && config.dependencies.length > 0) {
    const pkgPath = path.join(projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    pkg.dependencies = pkg.dependencies || {};

    config.dependencies.forEach((dep) => {
      const [name, version] = dep.split('@');
      if (!pkg.dependencies[name]) {
        pkg.dependencies[name] = version || 'latest';
      }
    });

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

    prompts.log.step('Installing dependencies...');
    execSync('npm install', { cwd: projectRoot, stdio: 'inherit' });
  }

  // 3. Register routes (if applicable)
  if (config.routes) {
    registerRoutes(projectRoot, config);
  }
}

function registerRoutes(root: string, config: ModuleConfig) {
  // Try to find main server file
  const candidates = ['server/main.ts', 'server/index.ts', 'src/main.ts', 'src/index.ts'];

  let mainFile: string | null = null;
  for (const candidate of candidates) {
    const fullPath = path.join(root, candidate);
    if (fs.existsSync(fullPath)) {
      mainFile = fullPath;
      break;
    }
  }

  if (!mainFile) {
    prompts.log.warn('Could not find main file to register routes');
    prompts.log.info(
      'Add routes manually:\n' + config.routes!.map((r) => `  app.use('${r.path}', ...)`).join('\n')
    );
    return;
  }

  let content = fs.readFileSync(mainFile, 'utf-8');

  // Add imports
  const imports = config
    .routes!.map((r) => {
      const name = path.basename(r.file, '.ts') + 'Router';
      return `import ${name} from '${r.file.replace(/\.ts$/, '.js')}'`;
    })
    .join('\n');

  // Add route registrations
  const routes = config
    .routes!.map((r) => {
      const name = path.basename(r.file, '.ts') + 'Router';
      return `app.use('${r.path}', ${name})`;
    })
    .join('\n  ');

  // Insert at marker or after last import
  if (content.includes('// TSDK_MODULES')) {
    content = content.replace(
      '// TSDK_MODULES',
      `${imports}\n// TSDK_MODULES\n\n  ${routes}\n  // TSDK_ROUTES`
    );
  } else {
    prompts.log.warn('No "// TSDK_MODULES" marker found in main file');
    prompts.log.info('Add manually:\n' + imports + '\n\n' + routes);
  }

  fs.writeFileSync(mainFile, content);
}

function exit() {
  prompts.cancel('Operation cancelled');
  process.exit(0);
}
