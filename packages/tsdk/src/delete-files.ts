import glob = require('fast-glob');
import fsExtra from 'fs-extra';
import path from 'path';

import { config, ensureDir } from './config';
import symbols from './symbols';

export async function deleteFilesBeforeSync() {
  const preWhiteList = await glob(
    path.join(__dirname, '../fe-sdk-template/src/**').replace(/\\/g, '/')
  );
  const whiteList = [
    ...preWhiteList.map((i) => i.replace(path.join(__dirname, '../fe-sdk-template'), ensureDir)),
    ...config.sdkWhiteList.map((i) => {
      return path.join(ensureDir, path.normalize(i).replace(ensureDir, ''));
    }),
  ];

  const whiteFiles = await glob(
    whiteList.map((i) => {
      return i.replace(/\\/g, '/');
    })
  );

  let files = await glob([path.join(ensureDir, 'src/**').replace(/\\/g, '/')], {
    ignore: whiteFiles,
  });

  // special for windows
  files = files.filter((i) => whiteFiles.find((j) => i === j));

  await Promise.all([files.map((i) => fsExtra.remove(i))]);

  console.log(symbols.success, 'deleted cache files');
}
