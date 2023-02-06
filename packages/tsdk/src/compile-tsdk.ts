import { execSync } from 'child_process';
import glob = require('fast-glob');
import path from 'path';

import { ensureDir } from './config';

export function buildSDK() {
  console.log(`buildSDK run: cd ${ensureDir} && npm run tsc:build`);
  glob([path.join(ensureDir, 'src/**/*.ts').replace(/\\/g, '/')]).then((files) => {
    console.log(files);
    execSync(`cd ${ensureDir} && npm run tsc:build`, { stdio: 'inherit' });
  });
}

export function buildSDKDoc() {
  execSync(`cd ${ensureDir} && npm run doc:build`, { stdio: 'inherit' });
}
