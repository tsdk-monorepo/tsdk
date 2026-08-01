import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';
import * as prompts from '@clack/prompts';
import * as tar from 'tar';
import { parseArgv } from '../utils';
import { getNpmCommand } from '../get-npm-command';

// ============================================================================
// Built-in Templates
// ============================================================================

const BUILTIN_TEMPLATES = {
  'basic-sdk-export': {
    name: 'SDK Export',
    description: 'Minimal TypeScript SDK export',
  },
  'basic-fullstack': {
    name: 'Full Stack',
    description: 'Type-safe full stack setup',
  },
} as const;

type BuiltinTemplate = keyof typeof BUILTIN_TEMPLATES;

function isBuiltinTemplate(name: string): name is BuiltinTemplate {
  return name in BUILTIN_TEMPLATES;
}

// ============================================================================
// Main Entry
// ============================================================================

export async function createTemplate(argv: string[]) {
  prompts.intro('🚀 Create TSDK Project');
  const argvObj = parseArgv(argv);

  try {
    // 1. Get project name
    const projectName =
      argv[0] ||
      (await prompts.text({
        message: 'Project name:',
        defaultValue: 'my-project',
        placeholder: 'my-project or "." for current directory',
        validate: (v) => (v ? undefined : 'Required'),
      }));
    if (prompts.isCancel(projectName)) exit();

    // 2. Get template source
    let template = argvObj.template || argvObj.t;

    if (!template) {
      const builtinOptions = Object.entries(BUILTIN_TEMPLATES).map(([key, val]) => ({
        value: key,
        label: val.name,
        hint: val.description,
      }));

      const templateChoice = await prompts.select({
        message: 'Select a template:',
        options: [
          ...builtinOptions,
          {
            value: 'custom',
            label: 'Custom template',
            hint: 'NPM package, Git repo, or local path',
          },
        ],
      });
      if (prompts.isCancel(templateChoice)) exit();

      if (templateChoice === 'custom') {
        template = (await prompts.text({
          message: 'Template source:',
          placeholder: 'npm-package, user/repo, or local/path',
          validate: (v) => (v ? undefined : 'Required'),
        })) as string;
        if (prompts.isCancel(template)) exit();
      } else {
        template = templateChoice as string;
      }
    }

    // 3. Resolve Target Directory
    const targetDir = path.resolve(String(projectName).trim());
    const targetDirName = path.basename(targetDir);

    if (fs.existsSync(targetDir) && !isEmpty(targetDir)) {
      if (!argvObj.overwrite) {
        const action = await prompts.select({
          message: `"${targetDirName}" is not empty:`,
          options: [
            { label: 'Cancel', value: 'cancel' },
            { label: 'Remove and continue', value: 'remove' },
          ],
        });
        if (prompts.isCancel(action) || action === 'cancel') exit();
        if (action === 'remove') emptyDir(targetDir);
      } else {
        emptyDir(targetDir);
      }
    }

    // 4. Download Template
    const spinner = prompts.spinner();
    const templateSource = String(template);

    // Check if builtin first
    if (isBuiltinTemplate(templateSource)) {
      spinner.start('Creating built-in template...');
      copyBuiltinTemplate(templateSource, targetDir);
      spinner.stop('Template created');
    } else {
      // Template resolution logic
      const isLocal =
        fs.existsSync(templateSource) ||
        templateSource.startsWith('.') ||
        templateSource.startsWith('/');
      const isUrl = /^(https?|git|ssh):/.test(templateSource);
      const isScopedNpm = templateSource.startsWith('@');
      const isGitShorthand = !isLocal && !isUrl && !isScopedNpm && templateSource.includes('/');

      if (isLocal) {
        spinner.start('Copying local template...');
        copyLocalTemplate(templateSource, targetDir);
        spinner.stop('Template created');
      } else if (isUrl || isGitShorthand) {
        spinner.start('Cloning Git template...');
        cloneGitTemplate(templateSource, targetDir);
        spinner.stop('Template created');
      } else {
        spinner.start('Downloading NPM template...');
        await downloadNpmTemplate(templateSource, targetDir);
        spinner.stop('Template created');
      }
    }

    // 5. Update package.json
    updatePackageName(targetDir, targetDirName);

    const CMDs = getNpmCommand(process.cwd());

    prompts.outro(`✅ Project created at ${targetDir}

Next steps:
  cd ${projectName === '.' ? '' : targetDirName}
  ${CMDs.installCmd}
  ${CMDs.runCmd} dev`);
  } catch (error: any) {
    prompts.log.error(error.message);
    process.exit(1);
  }
}

function copyBuiltinTemplate(template: BuiltinTemplate, targetDir: string) {
  // Get the installed package location
  const templateDir = path.join(__dirname, '../../templates', template);
  copyLocalTemplate(templateDir, targetDir);
}

// ============================================================================
// NPM Operations
// ============================================================================

async function downloadNpmTemplate(pkgName: string, targetDir: string) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tsdk-template-'));

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  try {
    const packResult = execSync(`npm pack ${pkgName}`, {
      cwd: tempDir,
      stdio: 'pipe',
      encoding: 'utf-8',
    });

    const tarballName = packResult.trim();
    const tarballPath = path.join(tempDir, tarballName);

    await tar.x({
      file: tarballPath,
      cwd: targetDir,
      strip: 1,
    });
  } catch (error) {
    throw new Error(`Failed to download NPM template "${pkgName}". Check the name or version.`);
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      /* ignore cleanup errors */
    }
  }
}

// ============================================================================
// Git Operations
// ============================================================================

function cloneGitTemplate(repo: string, targetDir: string) {
  const [repoPath, branch] = repo.split('#');

  let url = repoPath;
  if (!repoPath.startsWith('http') && !repoPath.startsWith('git') && !repoPath.startsWith('ssh')) {
    url = `https://github.com/${repoPath}.git`;
  }

  const args = ['clone', '--depth', '1'];
  if (branch) args.push('--branch', branch);
  args.push(url, targetDir);

  try {
    execSync(`git ${args.join(' ')}`, { stdio: 'pipe' });
    const gitDir = path.join(targetDir, '.git');
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
    }
  } catch (error) {
    throw new Error(`Failed to clone git template: ${repo}`);
  }
}

// ============================================================================
// Local Operations
// ============================================================================

function copyLocalTemplate(src: string, dest: string) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.name === '.git' || entry.name === 'node_modules') continue;

    if (entry.isDirectory()) {
      copyLocalTemplate(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ============================================================================
// Utils
// ============================================================================

function updatePackageName(projectDir: string, name: string) {
  const pkgPath = path.join(projectDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.name = toValidPackageName(name);
  pkg.version = '0.0.0';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function isEmpty(dir: string): boolean {
  try {
    const files = fs.readdirSync(dir);
    return files.length === 0 || (files.length === 1 && files[0] === '.git');
  } catch (e) {
    return true;
  }
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') continue;
    fs.rmSync(path.join(dir, file), { recursive: true, force: true });
  }
}

function toValidPackageName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-');
}

function exit() {
  prompts.cancel('Operation cancelled');
  process.exit(0);
}
