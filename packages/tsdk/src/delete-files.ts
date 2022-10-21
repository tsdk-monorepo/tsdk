import path from 'path';
import glob = require('fast-glob');
import fsExtra from 'fs-extra';
import symbols from './symbols';
import { config, ensureDir } from './config';

export async function deleteFilesBeforeSync() {
  const preWhiteList = await glob(path.join(__dirname, '../fe-sdk-template/src/**'));
  const whiteList = [
    ...preWhiteList.map((i) => i.replace(path.join(__dirname, '../fe-sdk-template'), ensureDir)),
    ...config.sdkWhiteList.map((i) => {
      return path.join(ensureDir, path.normalize(i).replace(ensureDir, ''));
    }),
  ];

  const whiteFiles = await glob(whiteList);
  const files = await glob([path.join(ensureDir, 'src/**/*')], {
    ignore: whiteFiles,
  });

  await Promise.all([files.map((i) => fsExtra.remove(i))]);

  console.log(symbols.success, 'delete cache files');
}
