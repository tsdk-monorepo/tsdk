import fsExtra from 'fs-extra';
import fs from 'fs';
import path from 'path';

import { config, ensureDir, packageFolder } from './config';
import symbols from './symbols';
import { generateSWRHook, generateReactQueryHook, generateVueQueryHook } from './hooks-generate';

export const baseDir = path.join(path.relative(path.dirname(__filename), process.cwd()), ensureDir);

export function deleteSDKFolder() {
  return fsExtra.remove(path.resolve(process.cwd(), config.packageDir, packageFolder));
}

export async function syncAPI(
  _apiconfs: {
    method: string;
    path: string;
    name: string;
    type: string;
    description: string;
    category: string;
  }[],
  _types: string[]
) {
  console.log(`   ${symbols.bullet}`, 'generating APIs');
  await checkRepkaceAxiosWithXior();
  const pkgJSON = require(path.join(baseDir, 'package.json'));
  // const apiconfs = require(path.join(baseDir, 'lib', `${config.apiconfExt}-refs`));

  const types = [..._types];

  if (!types.includes('common')) {
    types.push('common');
  }

  types.sort();

  const _hookLibs = (
    Array.isArray(config.dataHookLib) ? config.dataHookLib : [config.dataHookLib || 'SWR']
  ).map((i) => (i as string).toLowerCase());

  const hookLibs = Array.from(new Set(_hookLibs));

  // const isSWR = hookLibs?.includes('swr');
  // const isReactQuery = hookLibs?.includes('reactquery');
  // const isVueQuery = hookLibs?.includes('vuequery');

  const hasCommon = _apiconfs.find((item) => {
    return item.type === 'common' || !item.type;
  });

  for (const apiType of types) {
    const hooksContentMap: Record<
      'swr' | 'reactquery' | 'vuequery',
      {
        dataHookHeadStr: string;
        dataHookImportStr: string;
        dataHookBodyStr: string;
        dataHookExportStr: string;
      }
    > = {
      swr: {
        dataHookHeadStr: '',
        dataHookImportStr: '',
        dataHookBodyStr: '',
        dataHookExportStr: '',
      },
      reactquery: {
        dataHookHeadStr: '',
        dataHookImportStr: '',
        dataHookBodyStr: '',
        dataHookExportStr: '',
      },
      vuequery: {
        dataHookHeadStr: '',
        dataHookImportStr: '',
        dataHookBodyStr: '',
        dataHookExportStr: '',
      },
    };
    const commonDataHookHeadStr = `
         ${
           config.httpLib !== 'xior'
             ? `import type { AxiosRequestConfig } from "axios";`
             : `import type { XiorRequestConfig as AxiosRequestConfig } from "xior";`
         }
         import { Handler } from './gen-api';
    `;

    // isSWR
    hooksContentMap['swr'].dataHookHeadStr = `import useSWR, { SWRConfiguration } from "swr";
      import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";
      ${commonDataHookHeadStr}
    `;
    // isReactQuery
    hooksContentMap['reactquery'].dataHookHeadStr = `
      import {
        useQuery,
        useMutation,
        QueryClient,
        UndefinedInitialDataOptions,
        UseMutationOptions,
      } from "@tanstack/react-query";
      ${commonDataHookHeadStr}
    `;
    // isVueQuery
    hooksContentMap['vuequery'].dataHookHeadStr = `
      import {
        useQueryClient,
        useQuery,
        useMutation,
        QueryClient,
        UndefinedInitialQueryOptions,
        UseMutationOptions,
      } from "@tanstack/vue-query";
      ${commonDataHookHeadStr}
    `;

    // isReactQuery isVueQuery) {
    hooksContentMap['reactquery'].dataHookBodyStr = hooksContentMap['vuequery'].dataHookBodyStr = `
        let _queryClient: QueryClient;

        ${
          apiType === 'common'
            ? `
        export function setQueryClientForCommon(queryClient: QueryClient) {
          _queryClient = queryClient;
        }
        `
            : ``
        }
        `;

    hooksContentMap['swr'].dataHookExportStr =
      apiType === 'common' || !hasCommon ? `` : `\nexport * from './common-api-swr-hooks';`;

    hooksContentMap['reactquery'].dataHookExportStr =
      apiType === 'common' || !hasCommon
        ? `\nexport function setQueryClient(queryClient: QueryClient) {
            _queryClient = queryClient;
          }`
        : `\nexport * from './common-api-reactquery-hooks';
        import { setQueryClientForCommon } from './common-api-reactquery-hooks';
        
        export function setQueryClient(queryClient: QueryClient) {
          _queryClient = queryClient;
          setQueryClientForCommon(queryClient);
        }
      `;

    hooksContentMap['vuequery'].dataHookExportStr =
      apiType === 'common' || !hasCommon
        ? `\nexport function setQueryClient(queryClient: QueryClient) {
            _queryClient = queryClient;
          }`
        : `\nexport * from './common-api-vuequery-hooks';
        import { setQueryClientForCommon } from './common-api-vuequery-hooks';
        
        export function setQueryClient(queryClient: QueryClient) {
          _queryClient = queryClient;
          setQueryClientForCommon(queryClient);
        }
      `;

    const headStr = `
      /** 
       * 
       * api-${apiType}.ts 
       * ${config.packageName}@${pkgJSON.version} 
       * 
       **/

      import genApi, { Expand } from './gen-api';
      `;
    let importStr = ``,
      bodyStr = ``;

    const exportStr = apiType === 'common' || !hasCommon ? `` : `\nexport * from './common-api';\n`;

    let contentCount = 0;

    await Promise.all(
      _apiconfs.map((item) => {
        const { name: _name, path, description, method, type: _type, category = 'others' } = item;
        const name = _name;
        const type = _type === 'common' || !_type ? 'common' : _type;

        const isGET = !method || method?.toLowerCase() === 'get';

        if (type === apiType) {
          importStr += `
            ${name}Config,
            type ${name}Req,
            type ${name}Res,
          `;
          bodyStr += `
            /** 
             * ${description || name}
             * ${method?.toUpperCase() ?? 'GET'} ${path || ''}
             * @category ${category}
             */
            export const ${name} = genApi<Expand<${name}Req>${
              isGET ? '' : ' | FormData'
            }, Expand<${name}Res>>(${name}Config);
          `;

          // isSWR
          hooksContentMap['swr'].dataHookImportStr += `
              ${name},
            `;
          hooksContentMap['swr'].dataHookBodyStr += generateSWRHook(name, item);
          // isReactQuery
          hooksContentMap['reactquery'].dataHookImportStr += `
              ${name},
            `;
          hooksContentMap['reactquery'].dataHookBodyStr += generateReactQueryHook(name, item);
          // isVueQuery
          hooksContentMap['vuequery'].dataHookImportStr += `
              ${name},
            `;
          hooksContentMap['vuequery'].dataHookBodyStr += generateVueQueryHook(name, item);

          contentCount++;
        }
      })
    );

    if (contentCount > 0) {
      const content = `
      ${headStr}
      ${
        importStr
          ? `import {
          ${importStr}
        } from './${config.apiconfExt}-refs';`
          : ''
      }
      ${exportStr}
      ${bodyStr}
    `;

      await fs.promises.writeFile(path.join(ensureDir, `src`, `${apiType}-api.ts`), content);

      await Promise.all(
        hookLibs.map((hook) => {
          const { dataHookHeadStr, dataHookImportStr, dataHookExportStr, dataHookBodyStr } =
            hooksContentMap[hook as 'vuequery'];
          const dataHookContent = `
            ${dataHookHeadStr}
            ${
              importStr
                ? `import {
                ${importStr}
              } from './${config.apiconfExt}-refs';`
                : ''
            }
            ${
              dataHookImportStr
                ? `import {
              ${dataHookImportStr}
            } from './${apiType}-api';`
                : ''
            }
            ${dataHookExportStr}
            ${dataHookBodyStr}
            `;
          return fs.promises.writeFile(
            path.join(ensureDir, `src`, `${apiType}-api-${hook}-hooks.ts`),
            dataHookContent
          );
        })
      );
      await fs.promises.writeFile(
        path.join(ensureDir, `src`, `${apiType}-api-hooks.ts`),
        `export * from './${apiType}-api-${hookLibs[0]}-hooks';`
      );
    }
  }

  console.log(`   ${symbols.success}`, 'generated APIs');

  const exportPermissions: {
    [key: string]: any[];
  } = {};

  for (const k of _apiconfs) {
    const item = k;
    if (typeof item !== 'object') continue;

    item.name = item.name || k.name;

    if (!exportPermissions[item.type]) {
      exportPermissions[item.type] = [];
    }

    exportPermissions[item.type].push(item);
  }

  await fs.promises.writeFile(
    path.join(ensureDir, 'src', `permissions.json`),
    JSON.stringify(exportPermissions, null, 2)
  );

  console.log(`   ${symbols.bullet}`, 'Generating documentation');
  // sync APIs docs
  const links: string[] = [];

  for (const apiType of types) {
    if (apiType === 'common') continue;
    links.push(`- [${apiType} APIs](/modules/${apiType}-api)`);
  }

  const projectName = `%PROJECT NAME%`;
  try {
    let getStartedContent = await fs.promises.readFile(
      path.join(__dirname, '..', 'fe-sdk-template', 'README.md'),
      'utf-8'
    );
    getStartedContent = getStartedContent
      .replace(new RegExp(projectName, 'g'), config.packageName)
      .replace('%API_REFERENCE%', links.join('\n'));
    await fs.promises.writeFile(path.join(ensureDir, 'README.md'), getStartedContent);
    console.log(`   ${symbols.success}`, 'Documentation generated');
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(`   ${symbols.error}`, 'Documentation generation error', e.message);
    }
  }
}

export async function copyPermissionsJSON() {
  const dist = path.join(ensureDir, `lib`, `permissions.json`);
  console.log(`       ${symbols.info}`, `copying \`permissions.json\` to \`${dist}\``);
  return fsExtra.copy(path.join(ensureDir, `src`, `permissions.json`), dist, {
    overwrite: true,
  });
}

export async function checkRepkaceAxiosWithXior() {
  if (config.httpLib !== 'xior') return;
  const genAPIfile = path.join(ensureDir, 'src', 'gen-api.ts');
  const res = await fs.promises.readFile(genAPIfile, 'utf-8');
  return fs.promises.writeFile(
    genAPIfile,
    res
      .replace('= AxiosRequestConfig<T>', '= XiorRequestConfig<T>')
      .replace(`import type { RequestConfig as AxiosRequestConfig } from './axios';`, '')
  );
}
