// paramCase.test.ts
import { describe, it, expect } from 'vitest';

function paramCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // Add a hyphen between lower and upper case letters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase(); // Convert all characters to lowercase
}

describe('paramCase', () => {
  it('should convert camelCase to param-case', () => {
    expect(paramCase('camelCaseString')).toBe('camel-case-string');
  });

  it('should convert PascalCase to param-case', () => {
    expect(paramCase('PascalCaseString')).toBe('pascal-case-string');
  });

  it('should replace spaces with hyphens', () => {
    expect(paramCase('a string with spaces')).toBe('a-string-with-spaces');
  });

  it('should convert all characters to lowercase', () => {
    expect(paramCase('MIXEDCASE String')).toBe('mixedcase-string');
  });

  it('should handle empty string', () => {
    expect(paramCase('')).toBe('');
  });
});
