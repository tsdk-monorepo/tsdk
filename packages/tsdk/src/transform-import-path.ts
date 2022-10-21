import path from 'path';
import fsExtra from 'fs-extra';
import { aliasToRelativePath } from './alias';
import { transformTypeormEntity } from './transform-typeorm-entity';
import { config, ensureDir, getDeps, tsconfig } from './config';
import symbols from './symbols';

/** 处理引用路径 */
export function processImportPath(_importString: string, _filePath: string) {
  let importString = _importString;
  const arr = _filePath.split('/');
  const filename = arr.pop();
  const filePath = arr.join('/');
  const isDoubleSemicolon = importString.indexOf('from "') > -1;
  const matched = importString.match(isDoubleSemicolon ? /from "(.*)";/ : /from '(.*)';/);
  if (matched) {
    // path alias check and replace path
    let fromPath = aliasToRelativePath({
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
        console.warn(
          symbols.space,
          symbols.warning,
          `Warn: '${firstLevelPath}' not support. If you confirm '${firstLevelPath}' will use in the both side, please add this lib to the '${ensureDir}/package.json' dependencies`
        );
      }
    }

    const finalPath = path.join(filePath, fromPath);
    const isEntityOrApiconf =
      importString.indexOf(`.${config.entityExt}`) > -1 ||
      importString.indexOf(`.${config.apiconfExt}`) > -1;

    // if (isEntityOrApiconf) {
    //   console.log(_importString);
    // }

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
        `Error: Don\'t import file from outside of shared dirs: '${importString}'`,
        _filePath
      );
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
    res = transformTypeormEntity(res, config.entityLibName);
    res = transformTypeormEntity(res, '@nestjs');
  }

  const result = res.split('\n');
  const imports: string[] = [];
  const otherContent: string[] = [];
  let importArr: string[] = [];
  result.forEach((i) => {
    const hasImport = i.indexOf('import ') > -1;
    const hasFrom = i.indexOf(' from') > -1;
    if (hasImport && hasFrom) {
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
