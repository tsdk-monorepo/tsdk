import { config } from './config';

export const logger: {
  log: typeof console.log;
  info: typeof console.info;
  warn: typeof console.warn;
  error: typeof console.error;
} = {
  log: (...args: Parameters<typeof console.log>) => {
    if (config.logVerbose !== false) {
      return console.log(...args);
    }
    // ignore
  },
  info: console.info,
  warn: console.warn,
  error: console.error,
};
