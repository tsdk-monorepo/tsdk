import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { config, ensureDir } from './config';
import { formatTS } from './format';
import symbols from './symbols';

const baseDir = path.join(
  path.relative(path.dirname(__filename), process.cwd()),
  ensureDir
);

export async function syncAPI() {
  console.log(symbols.bullet, 'generating APIs');

  const pkgJSON = require(path.join(baseDir, 'package.json'));
  const apiconfs = require(path.join(baseDir, `lib/${config.apiconfExt}-refs`));

  const types = [
    ...new Set(Object.keys(apiconfs).map((k) => apiconfs[k].type)),
  ].filter((i) => !!i);

  if (!types.includes('common')) {
    types.push('common');
  }

  types.forEach((apiType) => {
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

    const hasCommon = Object.keys(apiconfs).find((k) => {
      const item = apiconfs[k];
      return (item.type === 'common' || !item.type) && item.name;
    });

    let exportStr =
      apiType === 'common' || !hasCommon
        ? ``
        : `\nexport * from './common-api';\n`;

    let hasContentCount = 0;
    Object.keys(apiconfs).forEach((k, idx) => {
      const {
        name,
        description,
        type: _type,
        category = 'others',
      } = apiconfs[k];
      const type = _type === 'common' || !_type ? 'common' : _type;
      if (type === apiType && name) {
        importStr += `
          ${name}Config,
          ${name}Req,
          ${name}Res,
        `;
        bodyStr += `
          /** 
           * ${description}
           * 
           * @category ${category}
           */
          export const ${name} = genApi<${name}Req, ${name}Res>(${name}Config);
        `;
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

      fsExtra.writeFileSync(
        path.join(ensureDir, `src/${apiType}-api.ts`),
        formatTS(content)
      );
    }
  });

  console.log(symbols.success, 'generated APIs');

  await fsExtra.writeFile(
    path.join(ensureDir, `src/permissions.json`),
    JSON.stringify(apiconfs, null, 2)
  );
}

export function copyPermissionsJSON() {
  const dist = path.join(ensureDir, `lib/permissions.json`);
  console.log(symbols.info, `copy \`permission.json\` to \`${dist}\``);
  return fsExtra.copy(path.join(ensureDir, `src/permissions.json`), dist, {
    overwrite: true,
  });
}
