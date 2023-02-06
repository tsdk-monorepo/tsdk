import glob = require('fast-glob');
import fsExtra from 'fs-extra';
import path from 'path';

import { config, ensureDir } from './config';

export async function removeFields() {
  if (config.removeFields?.length === 0) return;
  const pattern = path.join(ensureDir, `lib/**/*.${config.apiconfExt}.js`).replace(/\\/g, '/');

  const removeFields = config.removeFields || [
    'needAuth',
    'category',
    'name',
    'description',
    'type',
  ];

  const files = await glob(pattern);
  await Promise.all(
    files.map(async (file) => {
      let content = await fsExtra.readFile(file, 'utf8');
      removeFields.forEach((field) => {
        content = content.replace(new RegExp(`${field}:.*\n`), '');
        // content = content.replace(new RegExp(`${field}:.*`), '');
      });
      return fsExtra.writeFile(file, content);
    })
  );
}
