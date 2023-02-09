import glob from 'fast-glob';
import fsExtra from 'fs-extra';
import path from 'path';

import { config, ensureDir } from './config';
import { formatTS } from './format';
import symbols from './symbols';

const baseDir = path.join(path.relative(path.dirname(__filename), process.cwd()), ensureDir);

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

    const hasCommon = keys.find((k) => {
      const item = apiconfs[k];
      return (item.type === 'common' || !item.type) && item.name;
    });

    const exportStr = apiType === 'common' || !hasCommon ? `` : `\nexport * from './common-api';\n`;

    let hasContentCount = 0;
    keys.forEach((k, idx) => {
      const { name, description, type: _type, category = 'others' } = apiconfs[k];
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

      fsExtra.writeFileSync(path.join(ensureDir, `src`, `${apiType}-api.ts`), formatTS(content));
    }
  });

  console.log(symbols.success, 'generated APIs');

  const exportPermissions: {
    [key: string]: any[];
  } = {};

  keys.forEach((k) => {
    const item = apiconfs[k];
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
    links.push(`- [${apiType} APIs](/docs/api/modules/${apiType}_api)`);
  });

  const files = await glob(
    config.sharedDirs.map((i) => path.join(i, '**', `*.ts`).replace(/\\/g, '/'))
  );
  files.forEach((i) => {
    const arr = i.split('/');
    arr.shift();
    links.push(
      `- [${arr.join('/').replace('.ts', '')}](${
        '/docs/api/modules/' + arr.join('_').replace('.ts', '').replace(/-/g, '_')
      })`
    );
  });
  links.push('- [all reference](/docs/api/modules)');
  const projectName = `%PROJECT NAME%`;
  try {
    let getStartedContent = await fsExtra.readFile(
      path.join(__dirname, '..', 'fe-sdk-template', 'website', 'docs', 'get-started.md'),
      'utf-8'
    );
    getStartedContent = getStartedContent
      .replace(new RegExp(projectName, 'g'), config.packageName)
      .replace('%API_REFERENCE%', links.join('\n'));
    await fsExtra.writeFile(
      path.join(ensureDir, 'website', 'docs', 'get-started.md'),
      getStartedContent
    );

    let docusaurusConfigContent = await fsExtra.readFile(
      path.join(ensureDir, 'website', 'docusaurus.config.js'),
      'utf-8'
    );
    docusaurusConfigContent = docusaurusConfigContent.replace(
      new RegExp(projectName, 'g'),
      config.packageName
    );
    await fsExtra.writeFile(
      path.join(ensureDir, 'website', 'docusaurus.config.js'),
      docusaurusConfigContent
    );
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
