/** @type {import('tsdk').TSDKConfig} */
module.exports = {
  packageDir: 'packages/',
  packageName: 'fe-sdk-demo',
  baseDir: './src',
  monorepoRoot: '../../',
  entityLibName: ['typeorm', 'kysely'],
  entityExt: 'entity',
  apiconfExt: 'apiconf',
  sharedDirs: ['./src/shared', './src/i18n'],
  dataHookLib: 'ReactQuery',
};
