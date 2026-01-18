import { config } from './config';

const isWindows = process.platform === 'win32';
export function replaceWindowsPath(path: string, isWin = isWindows) {
  if (!isWin) return path;
  return path.replace(/\\/g, '/');
}

/**
 * Helper function to measure execution time of async tasks
 * @param task The task name to be displayed
 * @param fn The async function to execute and measure
 * @returns The result of the executed function
 */
export const measureExecutionTime = async <T>(
  task: string,
  fn: () => Promise<T>,
  indent = ''
): Promise<T> => {
  const startTime = Date.now();

  try {
    if (config.logVerbose !== false) console.log(`${indent}⏰ ${task}`);
    const result = await fn();
    const endTime = Date.now();
    const duration = (endTime - startTime).toFixed(2);
    if (config.logVerbose !== false) console.log(`${indent}✅ ${task} ${duration}ms`);
    return result;
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    if (config.logVerbose !== false) console.log(`${indent}❌ ${task} ${duration}ms`);
    throw error;
  }
};
