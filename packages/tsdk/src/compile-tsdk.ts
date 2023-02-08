import { execSync } from 'child_process';
import glob = require('fast-glob');
import path from 'path';

import { ensureDir } from './config';

export async function buildSDK() {
  execSync(`cd ${ensureDir} && npm run tsc:build`, { stdio: 'inherit' });
}

export function buildSDKDoc() {
  execSync(`cd ${ensureDir} && npm run doc:build`, { stdio: 'inherit' });
}
