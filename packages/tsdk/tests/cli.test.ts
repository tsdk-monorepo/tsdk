import fsExtra from 'fs-extra';
import { execSync } from 'child_process';
import { expect, it, describe, beforeEach } from 'vitest';

beforeEach(async () => {
  // delete root/.vscode/tsdk.code-snippets
  // delete root/examples/server/fe-sdk-demo
  // rename root/examples/server/tsdk.config.js to root/examples/server/temp.tsdk.config.js
  // run `tsdk --init`
  // check root/.vscode/tsdk.code-snippets and it should exists
  // check root/examples/server/tsdk.config.js and it should exists
  // check root/examples/server/fe-sdk-demo/package.json should exists
  // run `tsdk --sync` should work

  await Promise.all(
    ['../../.vscode/tsdk.code-snippets', '../../examples/server/fe-sdk-demo'].map((i) =>
      fsExtra.remove(i)
    )
  );
  const result = await Promise.all(
    ['../../.vscode/tsdk.code-snippets', '../../examples/server/fe-sdk-demo'].map((i) =>
      fsExtra.exists(i)
    )
  );
  expect(result[0]).toBe(false);
  expect(result[1]).toBe(false);
  const isTempConfigExists = await fsExtra.exists('../../examples/server/temp.tsdk.config.js');
  if (isTempConfigExists) {
    await fsExtra.remove('../../examples/server/tsdk.config.js');
    await fsExtra.move(
      '../../examples/server/temp.tsdk.config.js',
      '../../examples/server/tsdk.config.js'
    );
  }
  await fsExtra.move(
    '../../examples/server/tsdk.config.js',
    '../../examples/server/temp.tsdk.config.js'
  );

  const isTsdkConfigExists = await fsExtra.exists('../../examples/server/tsdk.config.js');
  expect(isTsdkConfigExists).toBe(false);
});

describe('tsdk cli tests', () => {
  it('`tsdk --sync --no-vscode` should work', async () => {
    // restore
    await fsExtra.move(
      '../../examples/server/temp.tsdk.config.js',
      '../../examples/server/tsdk.config.js',
      { overwrite: true }
    );

    execSync('node ../../packages/tsdk/bin/tsdk.js --sync --no-vscode', {
      cwd: '../../examples/server',
    });

    const isTsdkConfigExists = await fsExtra.exists('../../examples/server/tsdk.config.js');
    expect(isTsdkConfigExists).toBe(true);

    const isVscodeSnippetExists = await fsExtra.exists('../../.vscode/tsdk.code-snippets');
    expect(isVscodeSnippetExists).toBe(false);
  });

  it('`tsdk --init --no-vscode` should work', async () => {
    execSync('node ../../packages/tsdk/bin/tsdk.js --init --no-vscode', {
      cwd: '../../examples/server',
    });

    const isTsdkConfigExists = await fsExtra.exists('../../examples/server/tsdk.config.js');
    expect(isTsdkConfigExists).toBe(true);

    const isVscodeSnippetExists = await fsExtra.exists('../../.vscode/tsdk.code-snippets');
    expect(isVscodeSnippetExists).toBe(false);
  });

  it('`tsdk --init` and `tsdk --sync` should work', async () => {
    execSync('node ../../packages/tsdk/bin/tsdk.js --init', {
      cwd: '../../examples/server',
    });
    // restore
    await fsExtra.move(
      '../../examples/server/temp.tsdk.config.js',
      '../../examples/server/tsdk.config.js',
      { overwrite: true }
    );
    //
    execSync('node ../../packages/tsdk/bin/tsdk.js --init', {
      cwd: '../../examples/server',
    });

    const isVscodeSnippetExists = await fsExtra.exists('../../.vscode/tsdk.code-snippets');
    expect(isVscodeSnippetExists).toBe(false);

    execSync('node ../../packages/tsdk/bin/tsdk.js --sync', {
      cwd: '../../examples/server',
    });

    const isVscodeSnippetExists2 = await fsExtra.exists('../../.vscode/tsdk.code-snippets');
    expect(isVscodeSnippetExists2).toBe(true);
  });
});
