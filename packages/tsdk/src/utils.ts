/**
 * @Example:
 * removeInputFields(JSON.stringify({a: 1, b: 2}, null, 2), ['b']) -> {a: 1}
 */
export function removeInputFields(input: string, fields: string[]) {
  const lines = input.split('\n');
  const result: string[] = [];
  let skipUntilIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if current line starts with any field to remove
    const matchedField = fields.find(
      (field) =>
        trimmedLine.startsWith(`${field}:`) ||
        trimmedLine.startsWith(`"${field}":`) ||
        trimmedLine.startsWith(`'${field}':`)
    );

    if (matchedField) {
      const indentLevel = line.indexOf(trimmedLine);

      // Find the end of this field block
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];
        if (nextLine.startsWith('}')) {
          skipUntilIndex = j;
          break;
        }

        const nextIndent = nextLine.match(/^\s{1,}/)?.[0].length ?? 0;
        if (nextIndent === indentLevel && /[a-zA-Z'"]/.test(nextLine[indentLevel])) {
          skipUntilIndex = j - 1;
          break;
        }
      }
      i = skipUntilIndex; // Skip to the end of the block
    } else if (i > skipUntilIndex) {
      result.push(line);
    }
  }

  return result.join('\n');
}
