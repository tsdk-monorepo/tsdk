/** @type {import('tsdk').TSDKConfig} */
module.exports = {
  packageDir: 'packages/',
  packageName: 'fe-sdk',
  baseDir: './src',
  monorepoRoot: './',
  entityLibName: 'typeorm',
  entityExt: 'entity',
  apiconfExt: 'apiconf',
  shareExt: 'shared',
  sharedDirs: ['./src/shared'],
  removeFields: [],
  /** 'xior' | 'axios'. More: https://tsdk.dev/docs/guide/tsdk.config#httplib */
  // httpLib: 'xior',
};
