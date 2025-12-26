/** @type {import('tsdk').TSDKConfig} */
module.exports = {
  packageDir: './',
  packageName: 'fe-sdk-demo',
  baseDir: './src',
  monorepoRoot: '../../',
  entityLibName: ['typeorm', 'kysely'],
  removeFields: ['schema', 'needAuth', 'type'],
  entityExt: 'entity',
  apiconfExt: 'apiconf',
  httpLib: 'xior',
  sharedDirs: ['./src/tsdk-shared', './src/shared', './src/i18n'],
  dataHookLib: ['SWR', 'ReactQuery', 'VueQuery', 'SolidQuery', 'SvelteQuery'],
  worker: true,
  // moduleType: 'module',
  dependencies: {
    i18next: '^23.10.1',
    'intl-pluralrules': '^2.0.1',
    xior: '^0.8.2',
  },
};
