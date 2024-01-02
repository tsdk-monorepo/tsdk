import { execSync } from 'child_process';
import fsExtra from 'fs-extra';
import path from 'path';
import ts from 'typescript';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

import { getNpmCommand } from './get-pkg-manager';

export const tsdkConfigFilePath = path.join(process.cwd(), 'tsdk.config.js');

const defaultMainName = 'default';
const distProjects = 'dist-projects';

// npx tsdk --nest build
// npx tsdk --nest build [name] [name]
// npx tsdk --nest build all

async function run() {
  const idx = process.argv.findIndex((i) => i === '--names');
  const command = process.argv[idx - 1];
  const _names = process.argv.filter((item, index) => index > idx);

  const { projects } = await getNestProjectsConfig();

  const names = _names.find((i) => i === 'all') ? Object.keys(projects) : _names;

  if (names.length === 0) {
    names.push(defaultMainName);
  }

  const cwd = process.cwd();

  if (command === 'build') {
    const tsconfig = ts.readConfigFile(path.resolve(cwd, 'tsconfig.json'), ts.sys.readFile).config;
    const outDir = path.normalize(tsconfig.compilerOptions.outDir);
    const include = tsconfig.include || [];
    const sourceMap = tsconfig.compilerOptions.sourceMap;

    // remove dist folder before build
    await Promise.all([
      fsExtra.remove(path.resolve(cwd, distProjects)),
      fsExtra.remove(path.resolve(cwd, outDir)),
    ]);

    console.log(`\n[${command}]: ${names.join(', ')}`);

    await copyProdPackageJSON(path.resolve(cwd, distProjects), undefined, 'default-root');
    const npmCMDs = getNpmCommand(cwd);
    await Promise.all(
      names.map((name) => {
        if (!projects[name]) {
          const msg = `\`${name}\` not exists in \`nest-cli.json\``;
          console.warn(msg);
          throw new Error(msg);
        }

        return new Promise((resolve, reject) => {
          setTimeout(async () => {
            console.log(
              `\n[${command} ${name}] Run: \`${npmCMDs.runCmd} nest ${command} ${name}\`\n`
            );
            try {
              execSync(`${npmCMDs.runCmd} nest ${command} ${name}`, { stdio: 'inherit' });
              console.log(
                `[${command} ${name}] Success: \`${npmCMDs.runCmd} nest ${command} ${name}\` and start webpack build`
              );
            } catch (e) {
              console.log(
                `[${command} ${name}] Run: \`${npmCMDs.runCmd} nest ${command} ${name}\` error: `,
                e
              );
              console.log('\n');
              reject(e);
              return;
            }
            const nestProjectConfig = projects[name];
            const nodeExternalsParams = nestProjectConfig.nodeExternalsParams;

            try {
              const output = {
                ...nestProjectConfig.output,
                filename: path.basename(nestProjectConfig.entryFile).replace('.ts', '') + '.js',
                path: path.resolve(cwd, distProjects, `dist-${name}`),
              };

              if (include.length === 0) {
                nestProjectConfig.entryFile = path.join(
                  nestProjectConfig.sourceRoot,
                  path.basename(nestProjectConfig.entryFile)
                );
              }

              let entry = path.resolve(
                cwd,
                outDir,
                nestProjectConfig.entryFile.replace('.ts', '.js')
              );

              const entryExists = await fsExtra.pathExists(
                entry.indexOf('.js') > -1 ? entry : entry + '.js'
              );
              if (!entryExists) {
                const errorMsg = `[${command} ${name}] Entry not found: \`${entry}\``;
                console.log(`\n${errorMsg}`);
                const tmpEntry =
                  entry.indexOf('src') > -1
                    ? path.normalize(
                        path
                          .resolve(cwd, outDir, nestProjectConfig.entryFile.replace('.ts', '.js'))
                          .replace('src', '')
                      )
                    : path.resolve(
                        cwd,
                        outDir,
                        'src',
                        nestProjectConfig.entryFile.replace('.ts', '.js')
                      );
                const tmpEntryExists = await fsExtra.pathExists(
                  tmpEntry.indexOf('.js') > -1 ? tmpEntry : tmpEntry + '.js'
                );
                if (tmpEntryExists) {
                  entry = tmpEntry;
                } else {
                  throw new Error(`${errorMsg}`);
                }
              }

              await webpackBuild({
                name,
                entry,
                mode: nestProjectConfig.mode || 'production',
                target: nestProjectConfig.target || 'node',
                ...(nestProjectConfig.externals ? { externals: nestProjectConfig.externals } : {}),
                nodeExternalsParams,
                devtool: sourceMap ? 'source-map' : nestProjectConfig.devtool, // nestProjectConfig.devtool, 'source-map'
                output,
              });
              console.log(
                `\n[${command} ${name}] Success webpack build, output: ./${path.join(
                  distProjects,
                  `dist-${name}`,
                  output.filename
                )}`
              );
              await copyProdPackageJSON(
                path.join(cwd, distProjects, `dist-${name}`),
                JSON.stringify(
                  {
                    ...pkgContent,
                    name: pkgContent.name + '-' + name,
                    scripts: {
                      start: 'cross-env NODE_ENV=production node ./main',
                    },
                  },
                  null,
                  2
                ),
                name
              );

              resolve(nestProjectConfig);
            } catch (e) {
              console.log(`[${command} ${name}] Webpack build error: `, e);
              reject(e);
            }
          }, 0);
        });
      })
    );
  }
}

run().catch((e) => {
  console.log(e);
});

type NestProjectsConfig = {
  [key: string]: webpack.Configuration & {
    type: string;
    root: string;
    sourceRoot: string;
    entryFile: string;
    compilerOptions: {
      tsConfigPath: string;
    };
    /** webpack-node-externals params  */
    nodeExternalsParams?: any;
  };
};

async function getNestProjectsConfig() {
  const cwd = process.cwd();
  const nestjsFilepath = path.resolve(
    cwd,
    require(tsdkConfigFilePath).monorepoRoot || './',
    'node_modules/@nestjs/cli/package.json'
  );
  const nestjsFilepathExists = await fsExtra.pathExists(nestjsFilepath);
  if (!nestjsFilepathExists) {
    throw new Error(`install \`@nestjs/cli\` first`);
  }

  const nestConfigFilepath = path.resolve(cwd, './nest-cli.json');
  const exists = await fsExtra.pathExists(nestConfigFilepath);
  if (!exists) {
    // throw new Error(`nest-cli.json doesn't exists: ${nestConfigFilepath}`);
  }

  const content = await fsExtra.readFile(nestConfigFilepath, 'utf8');
  const nestConfig = exists ? JSON.parse(content) : {};
  const defaultMainConfig = {
    type: 'application',
    root: './',
    sourceRoot: 'src',
    entryFile: 'main',
    compilerOptions: {
      webpack: false,
      tsConfigPath: 'tsconfig.json',
      ...nestConfig.compilerOptions,
    },
    ...nestConfig,
  } as NestProjectsConfig[string];

  return {
    projects: {
      ...nestConfig.projects,
      [defaultMainName]: defaultMainConfig,
    } as NestProjectsConfig,
  };
}

/**
 *  in order to ignore built-in modules like path, fs, etc.
 *  add `externalsPresets: { node: true },`, default is ignore all built-in modules.
 *
 *  in order to ignore all modules in node_modules folder, default is ignore all node_modules.
 *  if you dont want ignore modules in node_modules, you can add `externals: []`
 * 
 * @Example:
    webpackBuild({
      name: 'nestjs-todo',
      entry: './dist/modules/nestjs-todo/main.js',
      mode: 'production',
      devtool: "source-map",
      externals: undefined, // build all node_modules into one file

      target: 'node',
      output: {
        path: path.resolve(process.cwd(), 'dist-nestjs-todo'),
        filename: 'main.js',
      },
    })
 */
export function webpackBuild({
  nodeExternalsParams,
  ...webpackConfig
}: webpack.Configuration & {
  /** webpack-node-externals params  */
  nodeExternalsParams?: any;
}) {
  return new Promise((resolve, reject) => {
    webpack(
      {
        externalsPresets: { node: true },
        externals: [nodeExternals(nodeExternalsParams)],
        ...webpackConfig,
      },
      (err, stats) => {
        if (err || stats?.hasErrors()) {
          const error = stats?.compilation.errors ? stats?.compilation.errors : err;
          console.log(`${webpackConfig.name} build error: `, error);
          reject(error);
        } else {
          resolve('done');
        }
      }
    );
  });
}

let pkgContent: any = {};
async function copyProdPackageJSON(dir?: string, content?: string, name?: string) {
  if (!Object.keys(pkgContent).length) {
    const fileContent = await fsExtra.readFile(path.resolve(process.cwd(), 'package.json'), 'utf8');
    const pkgJson = JSON.parse(fileContent);
    ['devDependencies', 'license', 'author', 'keywords', 'files'].forEach((k) => {
      delete pkgJson[k];
    });
    pkgContent = {
      ...pkgJson,
    };
  }
  if (dir) {
    await fsExtra.ensureDir(dir);
    await fsExtra.writeFile(
      path.resolve(dir, 'package.json'),
      content ||
        JSON.stringify(
          {
            ...pkgContent,
            name: pkgContent.name + '-' + name,
            scripts: {},
          },
          null,
          2
        )
    );
  }
}
