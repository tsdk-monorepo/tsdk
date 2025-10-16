/** @type {import('tsdk').TSDKConfig} */
module.exports = {
  monorepoRoot: './',
  packageDir: './',
  packageName: 'fe-sdk',
  baseDir: './src',
  entityLibName: 'typeorm',
  entityExt: 'entity', // *.entity.ts
  apiconfExt: 'apiconf', // *.apiconf.ts
  shareExt: 'shared', // *.shared.ts
  sharedDirs: ['./src/tsdk-shared'],
  removeFields: [],
  /** 'xior' | 'axios'. More: https://tsdk.dev/docs/guide/tsdk.config#httplib */
  httpLib: 'xior',
  dataHookLib: ['SWR', 'ReactQuery', 'VueQuery'],
  dependencies: {
    xior: '^0.7.8',
  },
};
