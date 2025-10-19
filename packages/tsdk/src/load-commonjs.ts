import fs from 'fs';
import path from 'path';
import vm from 'vm';

export function loadCommonJS(filePath: string) {
  const absPath = path.resolve(filePath);
  const code = fs.readFileSync(absPath, 'utf8');

  // Prepare sandbox
  const sandbox: any = {
    module: { exports: {} },
    exports: {},
    require: (mod: string) => {
      // Only allow certain modules
      // if (['path', 'fs'].includes(mod)) return require(mod);
      throw new Error(`Module "${mod}" is not allowed in sandbox`);
    },
    console,
  };
  vm.createContext(sandbox);

  // Run the code in sandbox
  vm.runInContext(code, sandbox, { filename: absPath });

  return sandbox.module.exports;
}
