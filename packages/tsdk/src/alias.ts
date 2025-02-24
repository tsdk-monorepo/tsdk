import path from 'path';

export interface AliasToRelativePathOptions {
  filePath: string;
  imports: string[];
  config: {
    baseUrl?: string;
    paths?: Record<string, string[]>;
  };
  cwd?: string;
}

export function aliasToRelativePath({
  filePath,
  imports,
  config: inputConfig,
  cwd = process.cwd(),
}: AliasToRelativePathOptions): string[] {
  // Initialize config with defaults
  const config = {
    baseUrl: inputConfig?.baseUrl || './',
    paths: inputConfig?.paths || {},
  };

  // Create alias mapping with resolved paths
  const aliasMap = Object.entries(config.paths).reduce<Record<string, string[]>>(
    (acc, [alias, paths]) => {
      const resolvedAlias = alias.endsWith('/*') ? alias.replace('/*', '/') : alias;
      acc[resolvedAlias] = paths;
      return acc;
    },
    {}
  );

  // Process each import
  return imports.map((importPath) => {
    // Find matching alias
    const matchingAlias = Object.entries(aliasMap).find(([alias]) => importPath.startsWith(alias));

    if (!matchingAlias) {
      return importPath;
    }

    const [alias, choices] = matchingAlias;
    if (!choices?.[0]) {
      return importPath;
    }

    // Resolve the path
    let resolved = choices[0];
    if (resolved.endsWith('/*')) {
      resolved = resolved.replace('/*', '/');
    }
    resolved = importPath.replace(alias, resolved);

    // Calculate relative path
    const base = path.join(cwd, path.relative(cwd, config.baseUrl));
    const current = path.dirname(filePath);
    const target = path.join(base, resolved);

    let relative = path.relative(current, target).replace(/\\/g, '/');

    // Ensure proper path format
    if (!relative.startsWith('../') && !relative.startsWith('./')) {
      relative = './' + relative;
    }

    return relative;
  });
}
