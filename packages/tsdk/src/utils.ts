/**
 * @Example:
 * removeInputFields(JSON.stringify({a: 1, b: 2}, null, 2), ['b']) -> {a: 1}
 */
export function removeInputFields(input: string, fields: string[]) {
  const lines = input.split('\n');
  const result: string[] = [];
  const skipUntilIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if current line starts with any field to remove
    const matchedField = fields.find(
      (field) =>
        trimmedLine.startsWith(`${field}:`) ||
        trimmedLine.startsWith(`"${field}":`) ||
        trimmedLine.startsWith(`'${field}':`) ||
        trimmedLine.startsWith(`\`${field}\`:`)
    );

    if (matchedField) {
      const indentLevel = line.indexOf(trimmedLine);

      let _skipUntilIndex = -1;
      // Find the end of this field block
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];
        if (nextLine.startsWith('}')) {
          _skipUntilIndex = j;
          break;
        }

        const nextIndent = nextLine.match(/^\s{1,}/)?.[0].length ?? 0;
        const currentIndent = [indentLevel, indentLevel - 1, indentLevel + 1].find(
          (item) => item === nextIndent
        );
        if (currentIndent !== undefined && /[a-zA-Z'"`]/.test(nextLine[currentIndent])) {
          _skipUntilIndex = j - 1;
          break;
        }
      }
      if (_skipUntilIndex >= 0) i = _skipUntilIndex; // Skip to the end of the block
    } else if (i > skipUntilIndex) {
      result.push(line);
    }
  }

  return result.join('\n');
}

const isWindows = process.platform === 'win32';
export function replaceWindowsPath(path: string, isWin = isWindows) {
  if (!isWin) return path;
  return path.replace(/\\/g, '/');
}
