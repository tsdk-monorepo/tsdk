import { execSync } from 'child_process';

import { ensureDir } from './config';

export function buildSDK() {
  console.log(`buildSDK run: cd ${ensureDir} && npm run tsc:build`);
  execSync(`cd ${ensureDir} && npm run tsc:build`, { stdio: 'inherit' });
}

export function buildSDKDoc() {
  execSync(`cd ${ensureDir} && npm run doc:build`, { stdio: 'inherit' });
}
