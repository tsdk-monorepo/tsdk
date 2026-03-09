import { execSync } from 'child_process';

export default async function globalTeardown(config) {
  const pid = config.global?.backendPid;
  if (pid) {
    try {
      process.kill(-pid, 'SIGTERM');
    } catch (e) {
      console.warn('Failed to kill server process', e);
    }
  }
}
