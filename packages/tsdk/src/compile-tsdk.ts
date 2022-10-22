import { execSync } from 'child_process';
import { ensureDir } from './config';

export function buildSDK() {
  execSync(`cd ${ensureDir} && npm run build`, { stdio: 'inherit' });
}

export function buildSDKDoc() {
  execSync(`cd ${ensureDir} && npm run doc:build`, { stdio: 'inherit' });
}
