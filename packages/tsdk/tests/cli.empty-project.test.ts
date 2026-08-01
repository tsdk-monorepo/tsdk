import fsExtra from 'fs-extra';
import { execSync } from 'child_process';
import { expect, it, describe, beforeEach, afterEach } from 'vitest';

describe('tsdk cli tests in empty project', () => {
  beforeEach(async () => {
    // Ensure clean slate
    await fsExtra.remove('../../test-project');
    await fsExtra.ensureDir('../../test-project');

    // Create basic project structure
    await fsExtra.writeJson('../../test-project/tsconfig.json', {});
    await fsExtra.writeFile('../../test-project/tsconfig.json', '{}');
    execSync('npm init -y', { cwd: '../../test-project', stdio: 'inherit' });
  });

  afterEach(async () => {
    // Clean up with error suppression for robustness
    try {
      await fsExtra.remove('../../test-project');
    } catch (error) {
      console.warn('Cleanup warning:', error);
    }
  });

  it('should work with --sync flag (creates vscode snippets and installs zod)', async () => {
    try {
      execSync('node ../packages/tsdk/bin/tsdk.js --sync', {
        cwd: '../../test-project',
        stdio: 'pipe',
        encoding: 'utf-8',
      });
    } catch (error) {
      console.error('Command failed:', error.stdout || error.stderr);
      throw error;
    }

    // Check VSCode snippets exist
    const snippetsExists = await fsExtra.pathExists(
      '../../test-project/.vscode/tsdk.code-snippets'
    );
    expect(snippetsExists).toBe(true);

    // Check zod dependency exists
    const packageJson = await fsExtra.readJson('../../test-project/package.json');
    const zodExists = packageJson.dependencies?.zod !== undefined;
    expect(zodExists).toBe(true);
  });

  it('should work with --sync --no-zod --no-vscode flags', async () => {
    try {
      execSync('node ../packages/tsdk/bin/tsdk.js --sync --no-zod --no-vscode', {
        cwd: '../../test-project',
        stdio: 'pipe',
        encoding: 'utf-8',
      });
    } catch (error) {
      console.error('Command failed:', error.stdout || error.stderr);
      throw error;
    }

    // Check VSCode snippets do NOT exist
    const snippetsExists = await fsExtra.pathExists(
      '../../test-project/.vscode/tsdk.code-snippets'
    );
    expect(snippetsExists).toBe(false);

    // Check zod dependency does NOT exist
    const packageJson = await fsExtra.readJson('../../test-project/package.json');
    const zodExists = packageJson.dependencies?.zod !== undefined;
    expect(zodExists).toBe(false);
  });
});
