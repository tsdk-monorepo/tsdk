import fsExtra from 'fs-extra';
import path from 'path';

import { aliasToRelativePath } from './alias';
import { config, ensureDir, getDeps, tsconfig } from './config';
import symbols from './symbols';
import { transformTypeormEntity } from './transform-typeorm-entity';

/** Handling import path */
export function processImportPath(_importString: string, _filePath: string) {
  let importString = _importString;

  const commentString = importString.slice(0, 2);
  const hasComment = commentString === '//' || commentString === '/*';

  const arr = _filePath.split('/');
  arr.pop();
  const filePath = arr.join('/');
  const isDoubleSemicolon = importString.indexOf('from "') > -1;
  const matched = importString.match(isDoubleSemicolon ? /from "(.*)";/ : /from '(.*)';/);
  if (matched) {
    // path alias check and replace path
    const fromPath = aliasToRelativePath({
      cwd: './',
      config: tsconfig,
      imports: [matched[1]],
      filePath: _filePath,
    })[0];

    importString = _importString.replace(matched[1], fromPath);

    const firstLevelPath = fromPath.split('/')[0];

    if (firstLevelPath[0] !== '.') {
      const isShareLib = !!getDeps()[firstLevelPath];
      if (isShareLib) {
        return importString;
      } else {
        if (!hasComment) {
          console.warn(
            symbols.space,
            symbols.warning,
            `Warn: '${firstLevelPath}' not support. If you confirm '${firstLevelPath}' will use in the both side, please add this lib to the '${ensureDir}/package.json' dependencies`
          );
        }
      }
    }

    const finalPath = path.join(filePath, fromPath);
    const isEntityOrApiconf =
      importString.indexOf(`.${config.entityExt}`) > -1 ||
      importString.indexOf(`.${config.apiconfExt}`) > -1 ||
      importString.indexOf(`.${config.shareExt}`) > -1;

    // if (isEntityOrApiconf) {
    //   console.log(_importString);
    // }

    if (!hasComment) {
      const findDir =
        isEntityOrApiconf ||
        config.sharedDirs.find((dir) => {
          const currentShareDir = path.normalize(dir);
          return finalPath.indexOf(currentShareDir) === 0;
        });
      if (!findDir) {
        console.log(
          symbols.space,
          symbols.error,
          `Error: Don't import file from outside of shared dirs: '${importString}'`,
          _filePath
        );
      }
    }
  } else {
    console.warn(symbols.space, symbols.warning, `No match: ${importString}`);
  }
  return importString;
}

/** parse import alias path and transform */
export async function transformImportPath(filePath: string, isEntity?: boolean) {
  let res = await fsExtra.readFile(filePath, 'utf-8');

  if (isEntity) {
    res = config.entityLibName?.includes('typeorm') ? transformTypeormEntity(res, 'typeorm') : res;
    res = res.includes('@nestjs') ? transformTypeormEntity(res, '@nestjs') : res;
  }

  const result = res.split('\n');
  const imports: string[] = [];
  const otherContent: string[] = [];
  let importArr: string[] = [];
  result.forEach((i) => {
    const inlineImport = i.indexOf("import '") > -1 || i.indexOf('import "') > -1;
    const hasImport = i.indexOf('import ') > -1;
    const hasFrom = i.indexOf(' from "') > -1 || i.indexOf(" from '") > -1;

    if (inlineImport) {
      imports.push(i);
    } else if (hasImport && hasFrom) {
      imports.push(processImportPath(i, filePath));
    } else if (hasImport) {
      importArr.push(i);
    } else if (hasFrom) {
      importArr.push(i);
      imports.push(processImportPath(importArr.join(''), filePath));
      importArr = [];
    } else if (importArr.length > 0) {
      importArr.push(i);
    } else {
      otherContent.push(i);
    }
  });

  const fileContent = imports.join('\n') + otherContent.join('\n');

  return fileContent;
}
