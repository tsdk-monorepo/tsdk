/** @type {import('tsdk').TSDKConfig} */
module.exports = {
  monorepoRoot: './',
  packageDir: './',
  /** source dir, Recommend `./src` */
  baseDir: './src',
  packageName: 'fe-sdk',
  apiconfExt: 'apiconf', // *.apiconf.ts
  shareExt: 'shared', // *.shared.ts
  sharedDirs: ['./src/tsdk-shared'],
  removeFields: [],
  /** 'xior' | 'axios'. More: https://tsdk.dev/docs/guide/tsdk.config#httplib */
  httpLib: 'xior',
  dataHookLib: ['SWR', 'ReactQuery', 'VueQuery'],
  /** Support: zod / valibot / arktype */
  // validationLib: 'zod',
  dependencies: {
    xior: '^0.8.2',
  },
  /** Default undefined: support 'module' and 'commonjs' */
  moduleType: undefined,
};
