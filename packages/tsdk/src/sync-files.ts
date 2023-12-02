import { execSync } from 'child_process';
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
import { getNpmCommand } from './get-pkg-manager';
import symbols from './symbols';
import { transformImportPath } from './transform-import-path';

export async function syncFiles(noOverwrite = false) {
  await copySDK(noOverwrite);
  await parseDeps();
  await deleteFilesBeforeSync();
  await syncAddtionShareFiles();
  await syncAPIConf();
  await syncEntityFiles();
  await syncSharedFiles();
}

export async function copytsdkrc() {
  // copy .tsdkrc and remove packages/fe-sdk .tsdkrc
  await fsExtra.copy(
    path.join(__dirname, '../fe-sdk-template', './config/.tsdkrc.json'),
    path.join(process.cwd(), '.tsdkrc.json'),
    { overwrite: false }
  );
}

export async function addDepsIfNone() {
  const cwd = process.cwd();
  const pkgPath = path.resolve(cwd, 'package.json');
  const content = await fsExtra.readFile(pkgPath, 'utf8');
  const contentJSON = JSON.parse(content);
  const npmCMDs = await getNpmCommand(cwd);
  let needRunInstall = false;
  await Promise.all(
    [
      ['zod', '^3'],
      ['change-case', '^4.1.2'],
    ].map(async ([i, version]) => {
      if (!contentJSON.dependencies[i]) {
        contentJSON.dependencies[i] = version;
        await fsExtra.writeFile(pkgPath, JSON.stringify(contentJSON, null, 2));
        needRunInstall = true;
        console.log('');
        console.log(
          symbols.warning,
          `\`tsdk\` depends on \`${i}\`, so automatic add \`${i}\` to dependencies`
        );
        console.log(
          symbols.info,
          `You can run \`${npmCMDs.installCmd}\` to install new dependencies`
        );
        console.log('');
      }
      return 1;
    })
  );
  if (needRunInstall) {
    execSync(`${npmCMDs.installCmd}`);
  }
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

async function reconfigPkg() {
  // rename package name
  const pkgPath = path.resolve(process.cwd(), config.packageDir, packageFolder, 'package.json');
  const [content] = await Promise.all([fsExtra.readFile(pkgPath, 'utf-8')]);
  const pkgContent = JSON.parse(content);

  pkgContent.name = config.packageName;
  if (
    (Array.isArray(config.entityLibName)
      ? config.entityLibName
      : [config.entityLibName || 'typeorm']
    )?.find((item) => item === 'kysely')
  ) {
    pkgContent.dependencies.kysely = '^0.26.3';
  }
  const dataHookLib = config.dataHookLib?.toLowerCase();
  if (dataHookLib === 'swr') {
    pkgContent.dependencies.swr = '^2.2.4';
  } else if (dataHookLib === 'reactquery') {
    pkgContent.dependencies['@tanstack/react-query'] = '^5.10.0';
  }

  if (config.dependencies) {
    pkgContent.dependencies = {
      ...pkgContent.dependencies,
      ...config.dependencies,
    };
  }
  if (config.devDependencies) {
    pkgContent.devDependencies = {
      ...pkgContent.devDependencies,
      ...config.devDependencies,
    };
  }

  await Promise.all([fsExtra.writeFile(pkgPath, JSON.stringify(pkgContent, null, 2))]);

  await Promise.all([copyShared(), copySnippet()]);

  const content2 = await fsExtra.readFile('./package.json', 'utf-8');
  const pkgJSON = JSON.parse(content2);
  pkgJSON.scripts = {
    ...(pkgJSON.scripts || {}),
    'sync-sdk': pkgJSON.scripts?.['sync-sdk'] || `tsdk --sync`,
  };
  await fsExtra.writeFile('./package.json', JSON.stringify(pkgJSON, null, 2));
}

export async function copySDK(noOverwrite: boolean) {
  console.log(symbols.bullet, `init ${ensureDir}`);

  if (!isCurrentConfigExist) {
    await copytsdkrc();
  }

  const existPath = path.resolve(process.cwd(), config.packageDir, packageFolder, `package.json`);
  const isExist = await fsExtra.pathExists(existPath);

  if (isExist && noOverwrite) {
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
    { overwrite: true }
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

  files.sort();

  const indexContentMap: { [key: string]: string } = {};
  await Promise.all(
    files.map(async (file, idx) => {
      const filePath = path.join(ensureDir, file.replace(`${config.baseDir}/`, 'src/'));
      const content: string = await transformImportPath(file, isEntity);

      await fsExtra.ensureDir(path.dirname(filePath));

      let fromPath = path.relative(
        `${ensureDir}/src/`.replace(/\\/g, '/'),
        filePath.replace('.ts', '')
      );
      fromPath = path.normalize(fromPath);
      fromPath = fromPath.startsWith('.') ? fromPath : './' + fromPath;
      indexContentMap[file] = `export * from '${fromPath.replace(/\\/g, '/')}';\n`;
      return fsExtra.writeFile(filePath, content);
    })
  );
  const indexContent =
    files.length > 0 ? files.map((file) => indexContentMap[file]).join('') : getDefaultContent();

  await fsExtra.writeFile(path.join(ensureDir, `src/${ext}-refs.ts`), `${comment}${indexContent}`);
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

  const files = await glob([
    ...config.sharedDirs.map((i) => path.join(i, `**/*.ts`).replace(/\\/g, '/')),
    path.join(config.baseDir, `**/*.${config.shareExt || 'shared'}.ts`),
  ]);
  files.sort();

  const indexContentMap: { [key: string]: string } = {};
  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(ensureDir, file.replace(`${config.baseDir}/`, 'src/'));
      const content = await transformImportPath(file);

      await fsExtra.ensureDir(path.dirname(filePath));

      let fromPath = path.relative(
        `${ensureDir}/src/`.replace(/\\/g, '/'),
        filePath.replace('.ts', '')
      );
      fromPath = path.normalize(fromPath);
      fromPath = fromPath.startsWith('.') ? fromPath : './' + fromPath;
      if (fromPath.indexOf('tsdk-types') < 0) {
        indexContentMap[file] = `export * from '${fromPath.replace(/\\/g, '/')}';\n`;
      }
      return fsExtra.writeFile(filePath, content);
    })
  );
  const indexContent = files.map((file) => indexContentMap[file]).join('\n');
  await fsExtra.writeFile(
    path.join(ensureDir, `src`, `shared-refs.ts`),
    `${comment}${indexContent}`
  );

  console.log(symbols.success, `sync shared files`);
}
