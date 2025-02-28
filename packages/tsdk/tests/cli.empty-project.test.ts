import fsExtra from 'fs-extra';
import { execSync } from 'child_process';
import { expect, it, describe, beforeEach, afterEach } from 'vitest';

beforeEach(async () => {
  // create folder test-project
  // run npm init in test-project and create tsconfig.json
  // Run bin/tsdk.js --sync should work exactly
  // run bin/tsdk.js --no-zod --no-vscode should work
  await fsExtra.remove('../../test-project');
  await fsExtra.ensureDir('../../test-project');
  await fsExtra.writeFile('../../test-project/tsconfig.json', '{}');
  execSync('npm init -y', { cwd: '../../test-project', stdio: 'inherit' });
  await new Promise((resolve) => setTimeout(resolve, 1e3));
});

afterEach(async () => {
  // await fsExtra.remove('../../test-project');
});

describe('tsdk cli tests in empty project', () => {
  it('Run `bin/tsdk.js --sync` should work exactly', async () => {
    execSync('node ../packages/tsdk/bin/tsdk.js --sync', {
      cwd: '../../test-project',
      stdio: 'inherit',
    });

    const snippetsShouldExists = await fsExtra.exists(
      '../../test-project/.vscode/tsdk.code-snippets'
    );
    expect(snippetsShouldExists).toBe(true);

    const zodShouldExists =
      JSON.parse(await fsExtra.readFile('../../test-project/package.json', 'utf-8')).dependencies
        .zod !== undefined;
    expect(zodShouldExists).toBe(true);
  });

  it('Run `bin/tsdk.js --sync --no-zod --no-vscode` should work exactly', async () => {
    execSync('node ../packages/tsdk/bin/tsdk.js --sync --no-zod --no-vscode', {
      cwd: '../../test-project',
      stdio: 'inherit',
    });

    const snippetsShouldExists = await fsExtra.exists(
      '../../test-project/.vscode/tsdk.code-snippets'
    );
    expect(snippetsShouldExists).toBe(false);

    const zodShouldExists =
      JSON.parse(await fsExtra.readFile('../../test-project/package.json', 'utf-8'))?.dependencies
        ?.zod !== undefined;
    expect(zodShouldExists).toBe(false);
  });
});
