import glob from 'fast-glob';
import fsExtra from 'fs-extra';
import path from 'path';

import { config, ensureDir } from './config';
import { removeInputFields } from './utils';

export async function removeFields() {
  if (!config.removeFields || config.removeFields.length === 0) return;

  const jsPattern = path.posix.join(ensureDir, `lib/**/*.${config.apiconfExt}.js`);

  const fields = config.removeFields ?? ['needAuth', 'category', 'description', 'type'];

  const files = await glob([jsPattern]);
  await Promise.all(
    files.map(async (file) => {
      const content = await fsExtra.readFile(file, 'utf8');
      await fsExtra.writeFile(file, removeInputFields(content, fields));
    })
  );
}
