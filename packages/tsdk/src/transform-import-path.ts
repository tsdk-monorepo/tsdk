import fs from 'fs';
import path from 'path';

import { aliasToRelativePath } from './alias';
import { config, ensureDir, getDeps, tsconfig } from './config';
import symbols from './symbols';
import { transformTypeormEntity } from './transform-typeorm-entity';

/** Handling import path */
export function processImportPath(_importString: string, _filePath: string) {
  let importString = _importString;

  const commentString = importString.trim().slice(0, 2);
  const hasComment = commentString === '//' || commentString === '/*';

  const filePath = path.dirname(_filePath);
  const isDoubleSemicolon = importString.indexOf('from "') > -1;
  const matched = importString.match(isDoubleSemicolon ? /from "(.*)";?/ : /from '(.*)';?/);

  if (matched) {
    // path alias check and replace path
    const fromPath = aliasToRelativePath({
      cwd: './',
      config: tsconfig,
      imports: [matched[1]],
      filePath: _filePath,
    })[0];

    importString = importString.replace(matched[1], fromPath);

    const arr = fromPath.split('/');
    let firstLevelPath = arr[0];

    if (firstLevelPath[0] !== '.') {
      if (firstLevelPath.startsWith('@')) {
        firstLevelPath = arr.slice(0, 2).join('/');
      }
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

    if (!hasComment) {
      const findDir =
        isEntityOrApiconf ||
        config.sharedDirs.some((dir) => {
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
  let res = await fs.promises.readFile(filePath, 'utf-8');

  if (isEntity) {
    res = config.entityLibName?.includes('typeorm') ? transformTypeormEntity(res, 'typeorm') : res;
    res = res.includes('@nestjs') ? transformTypeormEntity(res, '@nestjs') : res;
  }

  const result = res.split('\n');
  const imports: string[] = [];
  const otherContent: string[] = [];
  let importArr: string[] = [];
  let inMultilineComment = false;

  result.forEach((line) => {
    const trimmedLine = line.trim();

    // Track multi-line comments
    if (trimmedLine.startsWith('/*')) {
      inMultilineComment = true;
    }
    if (inMultilineComment) {
      otherContent.push(line);
      if (trimmedLine.endsWith('*/') || line.indexOf('*/') > -1) {
        inMultilineComment = false;
      }
      return;
    }

    // Skip single-line comments and empty lines when checking for imports
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine === '') {
      if (importArr.length > 0) {
        importArr.push(line);
      } else {
        otherContent.push(line);
      }
      return;
    }

    const inlineImport = line.indexOf("import '") > -1 || line.indexOf('import "') > -1;
    const hasImport = line.indexOf('import ') > -1;
    const hasFrom = line.indexOf(' from "') > -1 || line.indexOf(" from '") > -1;

    // Only process as import if line actually starts with 'import' (after trimming)
    const isActualImport = trimmedLine.startsWith('import ');

    if (inlineImport && isActualImport) {
      imports.push(line);
    } else if (hasImport && hasFrom && isActualImport) {
      imports.push(processImportPath(line, filePath));
    } else if (hasImport && isActualImport) {
      importArr.push(line);
    } else if (hasFrom && importArr.length > 0) {
      importArr.push(line);
      imports.push(processImportPath(importArr.join('\n'), filePath));
      importArr = [];
    } else if (importArr.length > 0) {
      importArr.push(line);
    } else {
      otherContent.push(line);
    }
  });

  // Handle any remaining import statements that weren't processed
  if (importArr.length > 0) {
    imports.push(processImportPath(importArr.join('\n'), filePath));
  }

  // Ensure proper line breaks between imports and other content
  const fileContent =
    imports.length > 0 && otherContent.length > 0
      ? imports.join('\n') + '\n' + otherContent.join('\n')
      : imports.join('\n') + otherContent.join('\n');

  return fileContent;
}
