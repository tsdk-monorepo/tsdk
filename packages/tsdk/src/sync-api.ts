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

  const pkgJSON = require(path.join(baseDir, 'package.json'));
  const apiconfs = require(path.join(baseDir, 'lib', `${config.apiconfExt}-refs`));

  const keys = Object.keys(apiconfs);
  keys.sort();

  const types = [...new Set(keys.map((k) => apiconfs[k].type))].filter((i) => !!i);

  if (!types.includes('common')) {
    types.push('common');
  }

  types.sort();
  const isSWR = config.dataHookLib?.toLowerCase() === 'swr';
  const isReactQuery = config.dataHookLib?.toLowerCase() === 'reactquery';
  types.forEach((apiType) => {
    const dataHookHeadStr = `
    ${
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
    `;
    let dataHookImportStr = ``;
    let dataHookBodyStr = isReactQuery
      ? `
    let _queryClient: QueryClient;

    ${
      apiType === 'common'
        ? `
    export function setQueryClientForCommon(queryClient: QueryClient) {
      _queryClient = queryClient;
    }
    `
        : `
    
    `
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

      import genApi from './gen-api';
     
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
          isReactQuery
            ? `
      import { setQueryClientForCommon } from './common-api-hooks';
      export function setQueryClient(queryClient: QueryClient) {
        _queryClient = queryClient;
        setQueryClientForCommon(queryClient);
      }
        `
            : `${
                isReactQuery
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
    keys.forEach((k, idx) => {
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

      const isGET =
        apiconfs[k].isGet === false
          ? false
          : apiconfs[k].isGet === true || !method || method?.toLowerCase() === 'get';

      if (type === apiType && path) {
        importStr += `
          ${name}Config,
          type ${name}Req,
          type ${name}Res,
        `;
        bodyStr += `
          /** 
           * ${description}
           * 
           * @category ${category}
           */
          export const ${name} = genApi<${name}Req, ${name}Res>(${name}Config);
        `;

        dataHookImportStr += `
          ${name},
        `;
        if (isSWR) {
          dataHookBodyStr += `
        ${
          isGET
            ? `
/** 
 * ${description}
 * 
 * @category ${category}
 */
export function use${name}(
payload: ${name}Req | undefined,
options?: SWRConfiguration<${name}Res | undefined>,
requestConfig?: AxiosRequestConfig<${name}Req>,
needTrim?: boolean
) {
return useSWR(
  () => ({ url: ${name}.config.path, arg: payload }),
  ({ arg }) => {
    if (typeof arg === 'undefined') return undefined;
    return ${name}(arg, requestConfig, needTrim);
  },
  options
);
}
        `
            : `
            /** 
             * ${description}
             * 
             * @category ${category}
             */
            export function use${name}(
              options?: SWRMutationConfiguration<
                ${name}Res,
                Error,
                string,
                ${name}Req
              >,
              requestConfig?: AxiosRequestConfig<${name}Req>,
              needTrim?: boolean
            ) {
              return useSWRMutation(
                ${name}.config.path,
                (url, { arg }: { arg: ${name}Req }) => {
                  return ${name}(arg, requestConfig, needTrim);
                },
                options
              );
            }`
        }
        
        `;
        } else if (isReactQuery) {
          dataHookBodyStr += `
          ${
            isGET
              ? `
          /** 
           * ${description}
           * 
           * @category ${category}
           */
          export function use${name}(
            payload: ${name}Req | undefined,
            options?: UndefinedInitialDataOptions<${name}Res | undefined, Error>,
            queryClient?: QueryClient,
            requestConfig?: AxiosRequestConfig<${name}Req>,
            needTrim?: boolean
          ) {
            return useQuery(
              {
                ...(options || {}),
                queryKey: [${name}.config.path, payload],
                queryFn() {
                  if (typeof payload === 'undefined') {
                    return undefined;
                  }
                  return ${name}(payload, requestConfig, needTrim);
                },
              },
              queryClient || _queryClient
            );
          }`
              : `
              /** 
               * ${description}
               * 
               * @category ${category}
               */
              export function use${name}(
                options?: UseMutationOptions<
                  ${name}Res,
                  Error,
                  ${name}Req,
                  unknown
                >,
                queryClient?: QueryClient,
                requestConfig?: AxiosRequestConfig<${name}Req>,
                needTrim?: boolean
              ) {
                return useMutation(
                  {
                    ...(options || {}),
                    mutationFn(payload) {
                      return ${name}(payload, requestConfig, needTrim);
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
    });

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

      fsExtra.writeFileSync(path.join(ensureDir, `src`, `${apiType}-api.ts`), content);

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

      fsExtra.writeFileSync(
        path.join(ensureDir, `src`, `${apiType}-api-hooks.ts`),
        dataHookContent
      );
    }
  });

  console.log(symbols.success, 'generated APIs');

  const exportPermissions: {
    [key: string]: any[];
  } = {};

  keys.forEach((k) => {
    const item = apiconfs[k];
    if (typeof item !== 'object') return;
    item.name = item.name || k.replace(/Config$/, '');
    if (!exportPermissions[item.type]) {
      exportPermissions[item.type] = [];
    }
    if (item.schema) {
      item.schema = {};
    }
    exportPermissions[item.type].push(item);
  });

  await fsExtra.writeFile(
    path.join(ensureDir, 'src', `permissions.json`),
    JSON.stringify(exportPermissions, null, 2)
  );

  console.log(symbols.bullet, 'Docs config');
  // sync APIs docs
  const links: string[] = [];
  types.forEach((apiType) => {
    if (apiType === 'common') return;
    links.push(`- [${apiType} APIs](/modules/${apiType}_api)`);
  });

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
    console.log(symbols.success, 'Docs config');
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(symbols.error, 'Docs config error', e.message);
    }
  }
}

export function copyPermissionsJSON() {
  const dist = path.join(ensureDir, `lib`, `permissions.json`);
  console.log(symbols.info, `copy \`permission.json\` to \`${dist}\``);
  return fsExtra.copy(path.join(ensureDir, `src`, `permissions.json`), dist, {
    overwrite: true,
  });
}
