import path from 'path';

export interface AliasToRelativePathOptions {
  filePath: string;
  imports: string[];
  config: { baseUrl?: string; paths?: { [key: string]: [] } };
  cwd?: string;
}

export function aliasToRelativePath({
  filePath,
  imports,
  config,
  cwd,
}: AliasToRelativePathOptions) {
  if (!config) {
    config = {};
  }
  if (!config.paths) {
    config.paths = {};
    // throw new Error(
    //   "Unable to find the 'paths' property in the supplied configuration!"
    // );
  }

  if (config.baseUrl === undefined || config.baseUrl === '.') {
    config.baseUrl = './';
  }

  const { baseUrl, paths } = config;
  const aliases: { [key: string]: string[] | undefined } = {};

  for (const alias in paths) {
    /* istanbul ignore else  */
    if (paths.hasOwnProperty(alias)) {
      let resolved = alias;
      if (alias.endsWith('/*')) {
        resolved = alias.replace('/*', '/');
      }

      aliases[resolved] = paths[alias];
    }
  }

  const lines: string[] = [...imports];
  let idx = -1;
  for (const line of imports) {
    idx++;
    let resolved = '';
    for (const alias in aliases) {
      /* istanbul ignore else  */
      if (aliases.hasOwnProperty(alias) && line.startsWith(alias)) {
        const choices: string[] | undefined = aliases[alias];

        if (choices !== undefined) {
          resolved = choices[0];
          if (resolved.endsWith('/*')) {
            resolved = resolved.replace('/*', '/');
          }

          resolved = line.replace(alias, resolved);

          break;
        }
      }
      // else if (line.startsWith(".")) {
      //   resolved = path.join(path.dirname(filePath), line);
      // }
    }

    if (resolved.length < 1) {
      continue;
    }

    const base = path.join(cwd as string, path.relative(cwd as string, baseUrl || './'));

    const current = path.relative(base, path.dirname(filePath));

    const target = path.relative(base, resolved);

    const relative = path.relative(current, target).replace(/\\/g, '/');

    lines[idx] = line.replace(line, relative);
    if (lines[idx].indexOf('/') < 0) {
      lines[idx] = './' + lines[idx];
    }
  }

  return lines;
}
