import glob from 'fast-glob';
import fs from 'fs';
import path from 'path';

import { config, ensureDir } from './config';
import { replaceWindowsPath } from './utils';
import symbols from './symbols';

export async function removeFields() {
  if (!config.removeFields || config.removeFields.length === 0) return;

  const jsPattern = replaceWindowsPath(path.join(ensureDir, `lib/**/*.${config.apiconfExt}.js`));
  const jsPatternForEsm = replaceWindowsPath(
    path.join(ensureDir, `esm/**/*.${config.apiconfExt}.js`)
  );

  const removeFields = config.removeFields ?? ['needAuth'];
  console.log(`       ${symbols.info}`, `Removing fields [${removeFields.join(',')}]`);
  const files = await glob([jsPattern, jsPatternForEsm]);

  let processedCount = 0;
  let errorCount = 0;

  await Promise.all(
    files.map(async (file) => {
      try {
        const content = await fs.promises.readFile(file, 'utf8');
        const arr = content.split('\n');
        const result: string[] = [];
        let skipUntilIndex = -1;

        arr.forEach((line, index) => {
          // Skip lines in the deletion range
          if (index <= skipUntilIndex) {
            return;
          }

          const trimLine = line.trim();
          const isMatched = removeFields.find((field) => trimLine.startsWith(`${field}:`));

          if (isMatched) {
            const spaceCount = line.search(/\S/); // More robust than indexOf

            // Find the end of this field block
            const endIndex = findFieldEnd(arr, index, spaceCount);

            if (endIndex > -1) {
              // Mark lines to skip (from current line to end of field)
              skipUntilIndex = endIndex;

              // Handle trailing comma removal
              handleTrailingComma(result, arr, endIndex);
            } else {
              // If we can't find the end, keep the line (safer fallback)
              result.push(line);
              console.warn(
                `       ${symbols.warning}`,
                `Could not determine end of field in ${file}:${index + 1}`
              );
            }
          } else {
            result.push(line);
          }
        });

        // Only write if content changed
        const newContent = result.join('\n');
        if (newContent !== content) {
          await fs.promises.writeFile(file, newContent);
          processedCount++;
        }
      } catch (error) {
        errorCount++;
        console.error(`       ${symbols.error}`, `Failed to process ${file}:`, error);
      }
    })
  );

  console.log(
    `       ${symbols.success}`,
    `Processed ${processedCount} file(s), ${errorCount} error(s)`
  );
}

/**
 * Find the end index of a field block by tracking brace depth
 */
function findFieldEnd(lines: string[], startIndex: number, baseIndent: number): number {
  const startLine = lines[startIndex].trim();

  // Check if field value starts with { or [
  const hasOpenBrace = startLine.includes('{') || startLine.includes('[');

  if (!hasOpenBrace) {
    // Simple value - ends on the same line or next line without deeper indent
    if (startLine.endsWith(',') || startLine.endsWith('}')) {
      return startIndex;
    }

    // Multi-line simple value - find where it ends
    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      const indent = line.search(/\S/);
      const trimmed = line.trim();

      if (trimmed === '') continue; // Skip empty lines

      // If we hit a line at same or less indent, previous line was the end
      if (indent !== -1 && indent <= baseIndent) {
        return i - 1;
      }
    }
    return startIndex;
  }

  // Complex value with braces - track depth
  let braceDepth = 0;
  let bracketDepth = 0;
  let inString = false;
  let stringChar = '';
  let hasStartedCounting = false;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const prevChar = j > 0 ? line[j - 1] : '';

      // Handle string boundaries (skip escaped quotes)
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
        continue;
      }

      // Skip if inside string
      if (inString) continue;

      // Track braces and brackets
      if (char === '{') {
        braceDepth++;
        hasStartedCounting = true;
      } else if (char === '}') {
        braceDepth--;
      } else if (char === '[') {
        bracketDepth++;
        hasStartedCounting = true;
      } else if (char === ']') {
        bracketDepth--;
      }

      // Check if we've closed all braces/brackets after opening at least one
      if (hasStartedCounting && braceDepth === 0 && bracketDepth === 0) {
        // Look for trailing comma on this line or if line ends cleanly
        const restOfLine = line.slice(j + 1).trim();
        if (restOfLine === ',' || restOfLine === '' || restOfLine.startsWith(',')) {
          return i;
        }
      }
    }
  }

  // Couldn't find proper end - return -1 to indicate error
  return -1;
}

/**
 * Remove trailing comma from the previous field if the deleted field had one
 */
function handleTrailingComma(result: string[], allLines: string[], deletedEndIndex: number): void {
  if (result.length === 0) return;

  // Check if the deleted block ended with a comma
  const deletedLastLine = allLines[deletedEndIndex];
  const hasTrailingComma = deletedLastLine.trim().endsWith(',');

  if (!hasTrailingComma) return;

  // Check if next non-empty line after deletion is a closing brace
  let nextNonEmptyIndex = deletedEndIndex + 1;
  while (nextNonEmptyIndex < allLines.length && allLines[nextNonEmptyIndex].trim() === '') {
    nextNonEmptyIndex++;
  }

  if (nextNonEmptyIndex < allLines.length) {
    const nextLine = allLines[nextNonEmptyIndex].trim();
    if (nextLine.startsWith('}') || nextLine.startsWith(']')) {
      // Remove trailing comma from last line in result
      const lastIndex = result.length - 1;
      const lastLine = result[lastIndex];
      if (lastLine.trim().endsWith(',')) {
        result[lastIndex] = lastLine.replace(/,(\s*)$/, '$1');
      }
    }
  }
}
