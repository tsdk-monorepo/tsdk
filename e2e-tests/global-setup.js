// tests/global-setup.js
import { spawn } from 'child_process';

let backend;

export default async function globalSetup() {
  backend = spawn('pnpm', ['--filter=server-example', 'dev'], { stdio: 'inherit', shell: true });

  // wait until server is ready
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // save PID so teardown can kill it
  return { backendPid: backend.pid };
}
