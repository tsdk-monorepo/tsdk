/** @type {import('tsdk').TSDKConfig} */
module.exports = {
  packageDir: 'packages/',
  packageName: 'fe-sdk-demo',
  baseDir: './src',
  monorepoRoot: '../../',
  entityLibName: ['typeorm', 'kysely'],
  removeFields: ['schema', 'needAuth', 'category', 'description', 'type'],
  entityExt: 'entity',
  apiconfExt: 'apiconf',
  httpLib: 'xior',
  sharedDirs: ['./src/shared', './src/i18n'],
  dataHookLib: ['SWR', 'ReactQuery', 'VueQuery'],
  dependencies: {
    i18next: '^23.10.1',
    'intl-pluralrules': '^2.0.1',
    xior: '^0.6.3',
  },
};
