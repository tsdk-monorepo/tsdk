import fsExtra from 'fs-extra';
import path from 'path';

import { config, ensureDir, packageFolder } from './config';
import symbols from './symbols';

export const baseDir = path.join(path.relative(path.dirname(__filename), process.cwd()), ensureDir);

export function deleteSDKFolder() {
  return fsExtra.remove(path.resolve(process.cwd(), config.packageDir, packageFolder));
}

export async function syncAPI() {
  console.log(symbols.bullet, 'generating APIs');
  await replaceGenAPI();
  const pkgJSON = require(path.join(baseDir, 'package.json'));
  const apiconfs = require(path.join(baseDir, 'lib', `${config.apiconfExt}-refs`));

  const keys = Object.keys(apiconfs);
  keys.sort();

  const types = [...new Set(keys.map((k) => apiconfs[k].type))].filter(Boolean);

  if (!types.includes('common')) {
    types.push('common');
  }

  types.sort();
  const isSWR = config.dataHookLib?.toLowerCase() === 'swr';
  const isReactQuery = config.dataHookLib?.toLowerCase() === 'reactquery';
  const isVueReactQuery = config.dataHookLib?.toLowerCase() === 'vuereactquery';

  for (const apiType of types) {
    const dataHookHeadStr = `
    ${
      // swr
      !isSWR
        ? ''
        : `import useSWR, { SWRConfiguration } from "swr";
      import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";
      ${
        config.httpLib !== 'xior'
          ? `import type { AxiosRequestConfig } from "axios";`
          : `import type { XiorRequestConfig as AxiosRequestConfig } from "xior";`
      }
    `
    }
    ${
      !isReactQuery
        ? ''
        : `import {
      useQuery,
      useMutation,
      QueryClient,
      UndefinedInitialDataOptions,
      UseMutationOptions,
    } from "@tanstack/react-query";
      ${
        config.httpLib !== 'xior'
          ? `import type { AxiosRequestConfig } from "axios";`
          : `import type { XiorRequestConfig as AxiosRequestConfig } from "xior";`
      }
    `
    }

    ${
      !isVueReactQuery
        ? ''
        : `import {
      useQueryClient,
      useQuery,
      useMutation,
      QueryClient,
      UndefinedInitialQueryOptions,
      UseMutationOptions,
    } from "@tanstack/vue-query";
      ${
        config.httpLib !== 'xior'
          ? `import type { AxiosRequestConfig } from "axios";`
          : `import type { XiorRequestConfig as AxiosRequestConfig } from "xior";`
      }
    `
    }

    import { Handler } from './gen-api';
    `;

    let dataHookImportStr = ``;
    let dataHookBodyStr =
      isReactQuery || isVueReactQuery
        ? `
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
    `
        : ``;

    const headStr = `
      /** 
       * 
       * api-${apiType}.ts 
       * ${config.packageName}@${pkgJSON.version} 
       * 
       **/

      import genApi, { Expand } from './gen-api';
     
`;

    let importStr = ``;
    let bodyStr = ``;

    const hasCommon = keys.find((k) => {
      const item = apiconfs[k];
      return (item.type === 'common' || !item.type) && item.path;
    });

    const exportStr = apiType === 'common' || !hasCommon ? `` : `\nexport * from './common-api';\n`;

    const dataHookExportStr =
      apiType === 'common' || !hasCommon
        ? ``
        : `\nexport * from './common-api-hooks';
        ${
          isReactQuery || isVueReactQuery
            ? `
      import { setQueryClientForCommon } from './common-api-hooks';
      export function setQueryClient(queryClient: QueryClient) {
        _queryClient = queryClient;
        setQueryClientForCommon(queryClient);
      }
        `
            : `${
                isReactQuery || isVueReactQuery
                  ? `
            export function setQueryClient(queryClient: QueryClient) {
              _queryClient = queryClient;
            }
            `
                  : ``
              }`
        }
      `;

    let hasContentCount = 0;

    for (const k of keys) {
      const {
        name: _name,
        path,
        description,
        method,
        type: _type,
        category = 'others',
      } = apiconfs[k];
      const name = _name || k.replace(/Config$/, '');
      const type = _type === 'common' || !_type ? 'common' : _type;

      const isGET = !method || method?.toLowerCase() === 'get';
      const likeGET = apiconfs[k].isGet === false ? false : apiconfs[k].isGet === true || isGET;

      if (type === apiType && path) {
        importStr += `
          ${name}Config,
          type ${name}Req,
          type ${name}Res,
        `;
        bodyStr += `
          /** 
           * ${description || 'No description provided'}
           * 
           * @category ${category}
           */
          export const ${name} = genApi<Expand<${name}Req>${
          isGET ? '' : ' | FormData'
        }, Expand<${name}Res>>(${name}Config);
        `;

        dataHookImportStr += `
          ${name},
        `;

        if (isSWR) {
          dataHookBodyStr += `
        ${
          likeGET
            ? `
/** 
 * ${description || 'No description provided'}
 * 
 * @category ${category}
 */
export function use${name}(
  payload?: ${name}Req,
  options?: SWRConfiguration<${name}Res | undefined>,
  requestConfig?: AxiosRequestConfig<${name}Req>,
  customHandler?: Handler,
) {
  return useSWR(
    () => payload ? { url: ${name}.config.path, arg: payload } : null,
    ({ arg }) => {
      return ${name}(arg, requestConfig, customHandler);
    },
    options
  );
}
        `
            : `
/** 
 * ${description || 'No description provided'}
 * 
 * @category ${category}
 */
export function use${name}(
  options?: SWRMutationConfiguration<
    ${name}Res,
    Error,
    string,
    ${name}Req | FormData
  >,
  requestConfig?: AxiosRequestConfig<${name}Req | FormData>,
  customHandler?: Handler,
) {
  return useSWRMutation(
    ${name}.config.path,
    (url, { arg }: { arg: ${name}Req | FormData }) => {
      return ${name}(arg, requestConfig, customHandler);
    },
    options
  );
}`
        }
        
        `;
        } else if (isReactQuery || isVueReactQuery) {
          dataHookBodyStr += `
          ${
            likeGET
              ? `
/** 
 * ${description || 'No description provided'}
 * 
 * @category ${category}
 */
export function use${name}(
  payload?: ${name}Req,
  options?: Omit<${
    isReactQuery ? `UndefinedInitialDataOptions` : `UndefinedInitialQueryOptions`
  }<${name}Res | undefined, Error>, 'queryKey' | 'queryFn'>,
  queryClient?: QueryClient,
  requestConfig?: AxiosRequestConfig<${name}Req>,
  customHandler?: Handler,
) {
  return useQuery(
    {
      ...(options || {}),
      queryKey: [${name}.config.path, payload],
      queryFn() {
        if (typeof payload === 'undefined') {
          return undefined;
        }
        return ${name}(payload, requestConfig, customHandler);
      },
    },
    queryClient || _queryClient
  );
}`
              : `
/** 
 * ${description || 'No description provided'}
 * 
 * @category ${category}
 */
export function use${name}(
  options?: UseMutationOptions<
    ${name}Res,
    Error,
    ${name}Req | FormData,
    unknown
  >,
  queryClient?: QueryClient,
  requestConfig?: AxiosRequestConfig<${name}Req | FormData>,
  customHandler?: Handler,
) {
  return useMutation(
    {
      ...(options || {}),
      mutationFn(payload) {
        return ${name}(payload, requestConfig, customHandler);
      },
    },
    queryClient || _queryClient
  );
}
              `
          }
          `;
        }

        hasContentCount++;
      }
    }

    if (hasContentCount > 0) {
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

      await fsExtra.writeFile(path.join(ensureDir, `src`, `${apiType}-api.ts`), content);

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

      await fsExtra.writeFile(
        path.join(ensureDir, `src`, `${apiType}-api-hooks.ts`),
        dataHookContent
      );
    }
  }

  console.log(symbols.success, 'generated APIs');

  const exportPermissions: {
    [key: string]: any[];
  } = {};

  for (const k of keys) {
    const item = apiconfs[k];
    if (typeof item !== 'object') continue;

    item.name = item.name || k.replace(/Config$/, '');

    if (!exportPermissions[item.type]) {
      exportPermissions[item.type] = [];
    }

    if (item.schema) {
      item.schema = {};
    }

    exportPermissions[item.type].push(item);
  }

  await fsExtra.writeFile(
    path.join(ensureDir, 'src', `permissions.json`),
    JSON.stringify(exportPermissions, null, 2)
  );

  console.log(symbols.bullet, 'Generating documentation');
  // sync APIs docs
  const links: string[] = [];

  for (const apiType of types) {
    if (apiType === 'common') continue;
    links.push(`- [${apiType} APIs](/modules/${apiType}_api)`);
  }

  const projectName = `%PROJECT NAME%`;
  try {
    let getStartedContent = await fsExtra.readFile(
      path.join(__dirname, '..', 'fe-sdk-template', 'README.md'),
      'utf-8'
    );
    getStartedContent = getStartedContent
      .replace(new RegExp(projectName, 'g'), config.packageName)
      .replace('%API_REFERENCE%', links.join('\n'));
    await fsExtra.writeFile(path.join(ensureDir, 'README.md'), getStartedContent);
    console.log(symbols.success, 'Documentation generated');
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(symbols.error, 'Documentation generation error', e.message);
    }
  }
}

export async function copyPermissionsJSON() {
  const dist = path.join(ensureDir, `lib`, `permissions.json`);
  console.log(symbols.info, `copying \`permissions.json\` to \`${dist}\``);
  return fsExtra.copy(path.join(ensureDir, `src`, `permissions.json`), dist, {
    overwrite: true,
  });
}

export async function replaceGenAPI() {
  if (config.httpLib === 'xior') {
    const genAPIfile = path.join(ensureDir, 'src', 'gen-api.ts');
    const res = await fsExtra.readFile(genAPIfile, 'utf-8');
    return fsExtra.writeFile(
      genAPIfile,
      res
        .replace('= AxiosRequestConfig<T>', '= XiorRequestConfig<T>')
        .replace(`import type { RequestConfig as AxiosRequestConfig } from './axios';`, '')
    );
  }
}
