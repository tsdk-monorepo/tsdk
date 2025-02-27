import glob from 'fast-glob';
import fs from 'fs';
import path from 'path';

import { config, ensureDir } from './config';
import { replaceWindowsPath } from './utils';

export async function removeFields() {
  if (!config.removeFields || config.removeFields.length === 0) return;

  const jsPattern = replaceWindowsPath(path.join(ensureDir, `lib/**/*.${config.apiconfExt}.js`));
  const jsPatternForEsm = replaceWindowsPath(
    path.join(ensureDir, `esm/**/*.${config.apiconfExt}.js`)
  );

  const removeFields = config.removeFields ?? ['needAuth', 'category', 'description', 'type'];

  const files = await glob([jsPattern, jsPatternForEsm]);
  await Promise.all(
    files.map(async (file) => {
      const content = await fs.promises.readFile(file, 'utf8');
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
      await fs.promises.writeFile(file, result.join('\n'));
    })
  );
}
