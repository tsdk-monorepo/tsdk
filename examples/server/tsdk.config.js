/** @type {import('tsdk').TSDKConfig} */
module.exports = {
  packageDir: 'packages/',
  packageName: 'fe-sdk-demo',
  baseDir: './src',
  monorepoRoot: '../../',
  entityLibName: ['typeorm', 'kysely'],
  entityExt: 'entity',
  apiconfExt: 'apiconf',
  httpLib: 'xior',
  sharedDirs: ['./src/shared', './src/i18n'],
  dataHookLib: 'ReactQuery',
  dependencies: {
    i18next: '^23.7.13',
    'intl-pluralrules': '^2.0.1',
    xior: '0.0.10',
  },
};
