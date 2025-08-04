import { execSync } from 'child_process';
import glob from 'fast-glob';
import fsExtra from 'fs-extra';
import fs from 'fs';
import path from 'path';

import {
  isConfigExist,
  comment,
  getDefaultContent,
  config,
  ensureDir,
  parseDeps,
  packageFolder,
} from './config';
import { getNpmCommand } from './get-npm-command';
import symbols from './symbols';
import { transformImportPath } from './transform-import-path';
import { replaceWindowsPath, measureExecutionTime } from './utils';
import { extractApiconfs } from './extract-apiconfs';

export async function syncFiles(noOverwrite = false) {
  const indent = '   ';
  await measureExecutionTime(`Init ${ensureDir}`, () => copySDK(noOverwrite), indent);
  await measureExecutionTime(`Parse deps`, () => parseDeps(), indent);
  await measureExecutionTime(
    `sync *.${config.shareExt || 'share'}.ts files`,
    () => syncAdditionalSharedFiles(),
    indent
  );
  const [apiconfs] = await Promise.all([
    measureExecutionTime(`Sync *.${config.apiconfExt}.ts`, () => syncAPIConf(), indent),
    measureExecutionTime(`Sync *.${config.entityExt}.ts`, () => syncEntityFiles(), indent),
  ]);
  await measureExecutionTime(
    `Sync shared folders: ${config.sharedDirs.join(', ')}`,
    () => syncSharedFolders(),
    indent
  );
  return apiconfs;
}

export async function copyTsdkConfig() {
  // copy tsdk.config.js and remove packages/fe-sdk/tsdk.config.js
  await fsExtra.copy(
    path.join(__dirname, '../fe-sdk-template', './config/tsdk.config.js'),
    path.join(process.cwd(), 'tsdk.config.js'),
    { overwrite: false }
  );
}

export async function addDepsIfNone() {
  if (process.argv.find((i) => i.indexOf('--no-zod') > -1)) return Promise.resolve(0);
  const cwd = process.cwd();
  const pkgPath = path.resolve(cwd, 'package.json');
  const content = await fs.promises.readFile(pkgPath, 'utf8');
  const contentJSON = JSON.parse(content);
  const npmCMDs = await getNpmCommand(cwd);
  let needRunInstall = false;

  const validationLib = config.validationLib || 'zod';

  await Promise.all(
    [vLibs[validationLib], ['@standard-schema/spec', '^1.0.0']].map(
      async ([dependency, version]) => {
        if (!contentJSON.dependencies) contentJSON.dependencies = {};
        if (!contentJSON.dependencies[dependency]) {
          contentJSON.dependencies[dependency] = version;
          await fs.promises.writeFile(pkgPath, JSON.stringify(contentJSON, null, 2));
          needRunInstall = true;
          console.log('');
          console.log(
            `    ${symbols.warning}`,
            `\`tsdk\` depends on \`${dependency}\`, so automatically adding \`${dependency}\` to dependencies`
          );
          // console.log(
          //   symbols.info,
          //   `You can run \`${npmCMDs.installCmd}\` to install new dependencies`
          // );
          console.log('');
        }
        return 1;
      }
    )
  );

  if (needRunInstall) {
    execSync(`${npmCMDs.installCmd}`, { stdio: 'inherit', env: process.env });
  }
}

export async function copySnippet() {
  if (process.argv.find((i) => i.indexOf('--no-vscode') > -1)) return Promise.resolve(0);
  const vscodeFilePath = path.resolve(process.cwd(), config.monorepoRoot || './', '.vscode');
  await fsExtra.copy(
    path.join(__dirname, '../fe-sdk-template', './config/.vscode'),
    vscodeFilePath,
    { overwrite: false }
  );

  // overwrite snippets
  const validationLib = config.validationLib || 'zod';
  const imports = {
    zod: `import { z } from 'zod/v4';`,
    valibot: `import * as v from 'valibot';`,
    arktype: `import { type } from "arktype"`,
  } as const;
  const currentImport = imports[validationLib];
  const snippetPath = path.join(vscodeFilePath, 'tsdk.code-snippets');
  const content = await fs.promises.readFile(snippetPath, 'utf-8');
  await fs.promises.writeFile(snippetPath, content.replace(imports.zod, currentImport));
}

export async function copyShared() {
  await fsExtra.copy(
    path.join(__dirname, '../fe-sdk-template', './src/shared/'),
    path.join(process.cwd(), config.baseDir, 'shared'),
    { overwrite: false }
  );
}

/** Validation libs */
const vLibs = {
  zod: ['zod', '^4'],
  valibot: ['valibot', '^1.1.0'],
  arktype: ['arktype', '^2.1.20'],
} as const;

async function reconfigPkg() {
  // rename package name
  const pkgPath = path.resolve(process.cwd(), config.packageDir, packageFolder, 'package.json');
  const [content] = await Promise.all([fs.promises.readFile(pkgPath, 'utf-8')]);
  const pkgContent = JSON.parse(content);

  pkgContent.name = config.packageName;

  if (
    (Array.isArray(config.entityLibName)
      ? config.entityLibName
      : [config.entityLibName || 'typeorm']
    )?.find((item) => item === 'kysely')
  ) {
    pkgContent.dependencies.kysely = '^0.28.0';
  }

  const validationLib = config.validationLib || 'zod';
  pkgContent.dependencies[validationLib] = vLibs[validationLib][1];

  const _hookLibs = (
    Array.isArray(config.dataHookLib) ? config.dataHookLib : [config.dataHookLib || 'SWR']
  ).map((i) => (i as string).toLowerCase());

  const hookLibs = Array.from(new Set(_hookLibs));

  const isSWR = hookLibs?.includes('swr');
  const isReactQuery = hookLibs?.includes('reactquery');
  const isVueQuery = hookLibs?.includes('vuequery');
  const isSolidQuery = hookLibs?.includes('solidquery');
  const isSvelteQuery = hookLibs?.includes('sveltequery');

  if (isSWR) {
    pkgContent.dependencies.swr = '^2.3.3';
  }
  if (isReactQuery) {
    pkgContent.dependencies['@tanstack/react-query'] = '^5.74.3';
  }
  if (isVueQuery) {
    pkgContent.dependencies['@tanstack/vue-query'] = '^5.74.3';
  }
  if (isSolidQuery) {
    pkgContent.dependencies['@tanstack/solid-query'] = '^5.74.3';
  }
  if (isSvelteQuery) {
    pkgContent.dependencies['@tanstack/svelte-query'] = '^5.74.3';
  }

  //

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

  if (config.scripts) {
    pkgContent.scripts = {
      ...pkgContent.scripts,
      ...config.scripts,
    };
  }

  await Promise.all([
    fs.promises.writeFile(pkgPath, JSON.stringify(pkgContent, null, 2)),
    copyShared(),
    copySnippet(),
  ]);

  const content2 = await fs.promises.readFile('./package.json', 'utf-8');
  const pkgJSON = JSON.parse(content2);
  pkgJSON.scripts = {
    ...(pkgJSON.scripts || {}),
    'sync-sdk': pkgJSON.scripts?.['sync-sdk'] || `tsdk --sync`,
  };
  await fs.promises.writeFile('./package.json', JSON.stringify(pkgJSON, null, 2));
}

export async function copySDK(noOverwrite: boolean) {
  if (!isConfigExist) await copyTsdkConfig();

  const existPath = path.resolve(process.cwd(), config.packageDir, packageFolder, `package.json`);
  const isExist = await fsExtra.pathExists(existPath);

  if (isExist && noOverwrite) {
    await reconfigPkg();
    console.log(
      symbols.info,
      `Skip init sdk: \`${path.resolve(
        process.cwd(),
        config.packageDir,
        packageFolder
      )}\` already exists`
    );
    return;
  }

  await fsExtra.ensureDir(ensureDir);
  console.log(`   ${symbols.success} mkdir -p ${ensureDir}`);
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
}

/** sync files base extension config */
export async function syncExtFiles(ext: string, isEntity = false) {
  const isApiconf = ext === config.apiconfExt;
  const pattern = replaceWindowsPath(
    path.join(`${path.join(...config.baseDir.split('/'))}`, `**`, `*.${ext}.ts`)
  );
  const files = await glob(pattern);

  files.sort();

  const indexContentMap: { [key: string]: string } = {};
  const apiconfs: {
    method: string;
    path: string;
    name: string;
    type: string;
    description: string;
    category: string;
  }[] = [];
  const types = new Set<string>();
  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(ensureDir, file.replace(`${config.baseDir}/`, 'src/'));
      const content: string = await transformImportPath(file, isEntity);

      if (isApiconf) {
        // Get the configs and push to `apiconfs`
        const extractResult = extractApiconfs(content);
        if (extractResult.length > 0) {
          extractResult.forEach((item) => {
            if (item.type) {
              types.add(item.type);
            }
            apiconfs.push(item);
          });
        }
      }

      await fsExtra.ensureDir(path.dirname(filePath));

      let fromPath = path.relative(
        replaceWindowsPath(`${ensureDir}/src/`),
        filePath.replace('.ts', '')
      );
      fromPath = path.normalize(fromPath);
      fromPath = fromPath.startsWith('.') ? fromPath : './' + fromPath;
      indexContentMap[file] = `export * from '${replaceWindowsPath(fromPath)}';\n`;
      await fs.promises.writeFile(filePath, content);
      return filePath;
    })
  );

  const indexContent =
    files.length > 0 ? files.map((file) => indexContentMap[file]).join('') : getDefaultContent();

  await fs.promises.writeFile(
    path.join(ensureDir, `src/${ext}-refs.ts`),
    `${comment}${indexContent}`
  );

  if (isApiconf) {
    return { apiconfs, types: Array.from(types), files };
  }
}

/** sync entity files  */
export async function syncEntityFiles() {
  return syncExtFiles(config.entityExt, true);
}

/** sync apiconf files */
export async function syncAPIConf() {
  return syncExtFiles(config.apiconfExt);
}

/** sync additional shared files */
export async function syncAdditionalSharedFiles() {
  return syncExtFiles(config.shareExt || 'shared');
}

/** sync shared files */
export async function syncSharedFolders() {
  const files = await glob([
    ...config.sharedDirs.map((i) => replaceWindowsPath(path.join(i, `**/*.*`))),
    replaceWindowsPath(path.join(config.baseDir, `**/*.${config.shareExt || 'shared'}.*`)),
  ]);
  files.sort();

  const indexContentMap: { [key: string]: string } = {};
  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(ensureDir, file.replace(`${config.baseDir}/`, 'src/'));
      const content = await transformImportPath(file);
      await fsExtra.ensureDir(path.dirname(filePath));

      let fromPath = path.relative(
        replaceWindowsPath(`${ensureDir}/src/`),
        filePath.replace('.ts', '')
      );
      fromPath = path.normalize(fromPath);
      fromPath = fromPath.startsWith('.') ? fromPath : './' + fromPath;
      if (fromPath.indexOf('tsdk-types') < 0 && filePath.endsWith('.ts')) {
        indexContentMap[file] = `export * from '${replaceWindowsPath(fromPath)}';\n`;
      }
      return fs.promises.writeFile(filePath, content);
    })
  );

  const indexContent = Object.values(indexContentMap).join('');
  await fs.promises.writeFile(
    path.join(ensureDir, `src`, `shared-refs.ts`),
    `${comment}${indexContent}`
  );
}
