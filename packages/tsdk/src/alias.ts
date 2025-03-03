import path from 'path';
import { replaceWindowsPath } from './utils';

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
  if (cwd === './') {
    cwd = process.cwd();
  }

  // Initialize config with defaults
  const config = {
    baseUrl: inputConfig?.baseUrl || './',
    paths: inputConfig?.paths || {},
  };

  // Create alias mapping with resolved paths
  const aliasMap = Object.entries(config.paths).reduce<Record<string, string[]>>(
    (acc, [alias, paths]) => {
      // Store original alias patterns for matching
      acc[alias] = paths.map((p) => p);
      return acc;
    },
    {}
  );

  // Process each import
  return imports.map((importPath) => {
    // Find matching alias - handle wildcard patterns correctly
    const matchingAlias = Object.keys(aliasMap).find((alias) => {
      if (alias.endsWith('/*')) {
        const prefix = alias.slice(0, -2); // Remove the '/*'
        return importPath === prefix || importPath.startsWith(prefix + '/');
      }
      return importPath === alias || importPath.startsWith(alias + '/');
    });

    if (!matchingAlias) {
      return importPath;
    }

    const choices = aliasMap[matchingAlias];
    if (!choices?.[0]) {
      return importPath;
    }

    // Handle the replacement correctly for wildcards
    let resolved;
    if (matchingAlias.endsWith('/*')) {
      const baseAlias = matchingAlias.slice(0, -2);
      const restOfImport = importPath.slice(baseAlias.length);

      let choice = choices[0];
      if (choice.endsWith('/*')) {
        choice = choice.slice(0, -2);
      }

      resolved = choice + restOfImport;
    } else {
      const restOfImport = importPath.slice(matchingAlias.length);
      let choice = choices[0];
      if (choice.endsWith('/*')) {
        choice = choice.slice(0, -2);
      }

      resolved = choice + restOfImport;
    }

    // Calculate relative path
    const baseUrlPath = path.resolve(cwd, config.baseUrl);
    const targetPath = path.resolve(baseUrlPath, resolved);
    const currentDirPath = path.dirname(path.resolve(cwd, filePath));

    let relativePath = replaceWindowsPath(path.relative(currentDirPath, targetPath));

    // Ensure proper path format
    if (!relativePath.startsWith('../') && !relativePath.startsWith('./')) {
      relativePath = './' + relativePath;
    }

    return relativePath;
  });
}
