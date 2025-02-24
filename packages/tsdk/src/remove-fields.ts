import glob from 'fast-glob';
import fsExtra from 'fs-extra';
import path from 'path';

import { config, ensureDir } from './config';

export async function removeFields() {
  if (!config.removeFields || config.removeFields.length === 0) return;

  const jsPattern = path.join(ensureDir, `lib/**/*.${config.apiconfExt}.js`).replace(/\\/g, '/');

  const removeFields = config.removeFields ?? ['needAuth', 'category', 'description', 'type'];

  const files = await glob([jsPattern]);
  await Promise.all(
    files.map(async (file) => {
      const content = await fsExtra.readFile(file, 'utf8');
      const arr = content.split('\n');
      const result: string[] = [];
      let nextIndex = -1;
      arr.forEach((line, index) => {
        const trimLine = line.trim();
        const isMatched = removeFields.find((field) => trimLine.startsWith(`${field}:`));
        if (isMatched) {
          // get the space count
          const spaceCount = line.indexOf(trimLine);
          // find next matched space count;
          nextIndex = arr.slice(index + 1).findIndex((nextLine) => {
            if (nextLine.startsWith('}')) return true;
            const spaceLength = nextLine.match(/^\s{1,}/)?.[0].length;
            if (spaceLength === spaceCount && /[a-zA-Z'"]/.test(nextLine[spaceCount])) return true;
            return false;
          });
          if (nextIndex > -1) {
            nextIndex += index + 1;
          }
        } else if (index >= nextIndex && line) {
          result.push(line);
        }
      });
      await fsExtra.writeFile(file, result.join('\n'));
    })
  );
}
