import glob = require('fast-glob');
import fsExtra from 'fs-extra';
import path from 'path';

import {
  isCurrentConfigExist,
  comment,
  getDefaultContent,
  config,
  ensureDir,
  parseDeps,
  packageFolder,
} from './config';
import { deleteFilesBeforeSync } from './delete-files';
import symbols from './symbols';
import { transformImportPath } from './transform-import-path';

export async function syncFiles() {
  await copySDK();
  await parseDeps();
  await deleteFilesBeforeSync();
  await syncAddtionShareFiles();
  await syncAPIConf();
  await syncEntityFiles();
  await syncSharedFiles();
}

export async function copyTsdkrc() {
  // copy .tsdkrc and remove packages/fe-sdk .tsdkrc
  await fsExtra.copy(
    path.join(__dirname, '../fe-sdk-template', './config/.tsdkrc.json'),
    path.join(process.cwd(), '.tsdkrc.json'),
    { overwrite: false }
  );
}

export async function addDepsIfNone() {
  // check if have `zod` as dependencies
  // if don't have, add `zod` to dependencies
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  const content = await fsExtra.readFile(pkgPath, 'utf8');
  const contentJSON = JSON.parse(content);
  await Promise.all(
    [
      ['zod', '^3.19.1'],
      ['change-case', '^4.1.2'],
    ].map(async ([i, version]) => {
      if (!contentJSON.dependencies[i]) {
        contentJSON.dependencies[i] = version;
        await fsExtra.writeFile(pkgPath, JSON.stringify(contentJSON, null, 2));
        console.log('');
        console.log(
          symbols.warning,
          `\`tsdk\` depends on \`${i}\` for validate schema, so auto add \`${i}\` as dependencies`
        );
        console.log(
          symbols.info,
          'You can run `npm install` or `yarn` to install new dependencies'
        );
        console.log('');
      }
      return 1;
    })
  );
}

export async function copySnippet() {
  await fsExtra.copy(
    path.join(__dirname, '../fe-sdk-template', './config/.vscode'),
    path.resolve(process.cwd(), config.monorepoRoot || './', '.vscode'),
    { overwrite: false }
  );
}

export async function copyShared() {
  await fsExtra.copy(
    path.join(__dirname, '../fe-sdk-template', './src/shared/'),
    path.join(process.cwd(), config.baseDir, 'shared'),
    { overwrite: false }
  );
}

const defaultPackageScope = '@SCOPE-NAME';
const defaultPackagePrefix = `${defaultPackageScope}:registry`;

async function reconfigPkg() {
  // rename package name
  const pkgPath = path.resolve(process.cwd(), config.packageDir, packageFolder, 'package.json');
  const docPkgPath = path.resolve(
    process.cwd(),
    config.packageDir,
    packageFolder,
    'website',
    'package.json'
  );
  const [content, docContent] = await Promise.all([
    fsExtra.readFile(pkgPath, 'utf-8'),
    fsExtra.readFile(docPkgPath, 'utf-8'),
  ]);
  const pkgContent = JSON.parse(content);
  const docPkgContent = JSON.parse(docContent);

  pkgContent.name = config.packageName;
  docPkgContent.name = `${config.packageName}-docs`;
  const scope = config.packageName.split('/')[0];

  if (!scope[0].startsWith('@') || scope.length <= 1) {
    console.log(symbols.info, `Add scope name in \`.tsdkrc\` \`packageName\` field.`);
  }

  if (scope === defaultPackageScope) {
    console.log(symbols.warning, `Update package scope name in \`.tsdkrc\` \`packageName\` field.`);
  }

  if (pkgContent.publishConfig && pkgContent.publishConfig[defaultPackagePrefix]) {
    pkgContent.publishConfig[`${scope}:registry`] = pkgContent.publishConfig[defaultPackagePrefix];

    delete pkgContent.publishConfig[defaultPackagePrefix];
  }

  await Promise.all([
    fsExtra.writeFile(pkgPath, JSON.stringify(pkgContent, null, 2)),
    fsExtra.writeFile(docPkgPath, JSON.stringify(docPkgContent, null, 2)),
  ]);

  await Promise.all([copyShared(), copySnippet()]);

  const content2 = await fsExtra.readFile('./package.json', 'utf-8');
  const pkgJSON = JSON.parse(content2);
  pkgJSON.scripts = {
    ...(pkgJSON.scripts || {}),
    'sync-sdk': 'npx tsdk --sync',
  };
  await fsExtra.writeFile('./package.json', JSON.stringify(pkgJSON, null, 2));
}

export async function copySDK() {
  console.log(symbols.bullet, `init ${ensureDir}`);

  if (!isCurrentConfigExist) {
    await copyTsdkrc();
  }

  const existPath = path.resolve(process.cwd(), config.packageDir, packageFolder, `package.json`);
  const isExist = await fsExtra.pathExists(existPath);

  if (isExist) {
    await reconfigPkg();
    console.log(
      symbols.info,
      `skip init sdk: \`${path.resolve(
        process.cwd(),
        config.packageDir,
        packageFolder
      )}\` already exist`
    );
    return;
  }

  await fsExtra.ensureDir(ensureDir);
  console.log(symbols.success, `mkdir -p ${ensureDir}`);
  await fsExtra.copy(
    path.join(__dirname, '../fe-sdk-template'),
    path.resolve(process.cwd(), config.packageDir, packageFolder),
    { overwrite: false }
  );

  await reconfigPkg();

  await Promise.all(
    ['config'].map((folder) => {
      return fsExtra.remove(path.join(ensureDir, folder));
    })
  );

  console.log(symbols.success, `init ${ensureDir}`);
}

/** sync files base extension config */
export async function syncExtFiles(ext: string, isEntity = false) {
  console.log(symbols.bullet, `sync *.${ext}.ts files`);

  const pattern = path
    .join(`${path.join(...config.baseDir.split('/'))}`, `**`, `*.${ext}.ts`)
    .replace(/\\/g, '/');
  const files = await glob(pattern);

  console.log(symbols.info, `sync ${pattern} count ${files.length}`);

  let indexContent = getDefaultContent();
  await Promise.all(
    files.map(async (file, idx) => {
      if (idx === 0) {
        indexContent = '';
      }
      const filePath = path.join(ensureDir, file.replace(`${config.baseDir}/`, 'src/'));
      const content: string = await transformImportPath(file, isEntity);

      await fsExtra.ensureDir(path.dirname(filePath));

      let fromPath = path.relative(`${ensureDir}/src/`, filePath.replace('.ts', ''));
      fromPath = path.normalize(fromPath);
      fromPath = fromPath.startsWith('.') ? fromPath : './' + fromPath;
      indexContent += `export * from '${fromPath}';\n`;
      return fsExtra.writeFile(filePath, content);
    })
  );
  await fsExtra.writeFile(path.join(ensureDir, `src/${ext}-refs.ts`), `${comment}${indexContent}`);
  console.log(symbols.success, `sync *.${ext}.ts files`);
}

/** sync entity files  */
export async function syncEntityFiles() {
  return syncExtFiles(config.entityExt, true);
}

/** sync apiconf files */
export async function syncAPIConf() {
  return syncExtFiles(config.apiconfExt);
}

/** sync apiconf files */
export async function syncAddtionShareFiles() {
  return syncExtFiles(config.shareExt || 'shared');
}

/** sync shared files */
export async function syncSharedFiles() {
  console.log(symbols.bullet, `sync shared files`);

  const files = await glob(
    config.sharedDirs.map((i) => path.join(i, `**/*.ts`).replace(/\\/g, '/'))
  );
  let indexContent = '';
  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(ensureDir, file.replace(`${config.baseDir}/`, 'src/'));
      const content = await transformImportPath(file);

      await fsExtra.ensureDir(path.dirname(filePath));

      let fromPath = path.relative(`${ensureDir}/src/`, filePath.replace('.ts', ''));
      fromPath = path.normalize(fromPath);
      fromPath = fromPath.startsWith('.') ? fromPath : './' + fromPath;
      if (fromPath.indexOf('tsdk-types') < 0) {
        indexContent += `export * from '${fromPath}';\n`;
      }
      return fsExtra.writeFile(filePath, content);
    })
  );
  await fsExtra.writeFile(path.join(ensureDir, `src/shared-refs.ts`), `${comment}${indexContent}`);

  console.log(symbols.success, `sync shared files`);
}
