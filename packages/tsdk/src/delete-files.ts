import glob = require('fast-glob');
import fsExtra from 'fs-extra';
import path from 'path';

import { config, ensureDir } from './config';
import symbols from './symbols';

export async function deleteFilesBeforeSync() {
  const preWhiteList = await glob(
    path.join(__dirname, '../fe-sdk-template/src/**').replace(/\\/g, '/')
  );
  console.log(`deleteFilesBeforeSync preWhiteList(=%o)`, preWhiteList);
  const whiteList = [
    ...preWhiteList.map((i) => i.replace(path.join(__dirname, '../fe-sdk-template'), ensureDir)),
    ...config.sdkWhiteList.map((i) => {
      return path.join(ensureDir, path.normalize(i).replace(ensureDir, ''));
    }),
  ];

  console.log(`deleteFilesBeforeSync whiteList(=%o)`, whiteList);

  const whiteFiles = await glob(whiteList.map((i) => i.replace(/\\/g, '/')));
  console.log(`deleteFilesBeforeSync whiteFiles(=%o)`, whiteFiles);

  const files = await glob([path.join(ensureDir, 'src/**/*').replace(/\\/g, '/')], {
    ignore: whiteFiles,
  });

  console.log(`deleteFilesBeforeSync files(=%o)`, files);

  await Promise.all([files.map((i) => fsExtra.remove(i))]);

  console.log(symbols.success, 'delete cache files');
}
