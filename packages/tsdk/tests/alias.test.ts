import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aliasToRelativePath } from '../src/alias';

describe('aliasToRelativePath', () => {
  const mockCwd = '/project';

  beforeEach(() => {
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
  });

  it('should return the original import if no alias matches', () => {
    const result = aliasToRelativePath({
      cwd: './',
      filePath: '/project/src/components/Button.tsx',
      imports: ['react', 'react-dom'],
      config: {
        baseUrl: './src',
        paths: {
          '@components/*': ['components/*'],
        },
      },
    });

    expect(result).toEqual(['react', 'react-dom']);
  });

  it('should transform aliased imports to relative paths', () => {
    const result = aliasToRelativePath({
      cwd: './',
      filePath: '/project/src/pages/Home.tsx',
      imports: ['@components/Button', '@utils/format'],
      config: {
        baseUrl: './src',
        paths: {
          '@components/*': ['components/*'],
          '@utils/*': ['utils/*'],
        },
      },
    });

    expect(result).toEqual(['../components/Button', '../utils/format']);
  });

  it('should handle imports with nested paths after the alias', () => {
    const result = aliasToRelativePath({
      cwd: './',
      filePath: '/project/src/pages/Home.tsx',
      imports: ['@components/forms/Input', '@utils/date/format'],
      config: {
        baseUrl: './src',
        paths: {
          '@components/*': ['components/*'],
          '@utils/*': ['utils/*'],
        },
      },
    });

    expect(result).toEqual(['../components/forms/Input', '../utils/date/format']);
  });

  it('should calculate correct relative paths from different directories', () => {
    const result = aliasToRelativePath({
      cwd: './',
      filePath: '/project/src/features/auth/Login.tsx',
      imports: ['@components/Button', '@utils/auth'],
      config: {
        baseUrl: './src',
        paths: {
          '@components/*': ['components/*'],
          '@utils/*': ['utils/*'],
        },
      },
    });

    expect(result).toEqual(['../../components/Button', '../../utils/auth']);
  });

  it('should handle aliases without wildcards', () => {
    const result = aliasToRelativePath({
      cwd: './',
      filePath: '/project/src/pages/Home.tsx',
      imports: ['@api/client', '@constants'],
      config: {
        baseUrl: './src',
        paths: {
          '@api/client': ['services/api/client.ts'],
          '@constants': ['constants/index.ts'],
        },
      },
    });

    expect(result).toEqual(['../services/api/client.ts', '../constants/index.ts']);
  });

  it('should use default baseUrl when not provided', () => {
    const result = aliasToRelativePath({
      cwd: './',
      filePath: '/project/src/components/Button.tsx',
      imports: ['@utils/format'],
      config: {
        paths: {
          '@utils/*': ['src/utils/*'],
        },
      },
    });

    expect(result).toEqual(['../utils/format']);
  });

  it('should handle empty paths in config', () => {
    const result = aliasToRelativePath({
      cwd: './',
      filePath: '/project/src/components/Button.tsx',
      imports: ['react', '@utils/format'],
      config: {
        baseUrl: './src',
        paths: {
          '@utils/*': [],
        },
      },
    });

    // Should return original import if the paths array is empty
    expect(result).toEqual(['react', '@utils/format']);
  });

  it('should handle custom cwd parameter', () => {
    const result = aliasToRelativePath({
      filePath: '/custom/project/src/pages/Home.tsx',
      imports: ['@components/Button'],
      config: {
        baseUrl: './src',
        paths: {
          '@components/*': ['components/*'],
        },
      },
      cwd: '/custom/project',
    });

    expect(result).toEqual(['../components/Button']);
  });

  it('should handle absolute paths in baseUrl', () => {
    const result = aliasToRelativePath({
      cwd: './',
      filePath: '/project/src/pages/Home.tsx',
      imports: ['@components/Button'],
      config: {
        baseUrl: '/project/src',
        paths: {
          '@components/*': ['components/*'],
        },
      },
    });

    expect(result).toEqual(['../components/Button']);
  });

  it('should correctly handle multiple possible paths for an alias', () => {
    const result = aliasToRelativePath({
      cwd: './',
      filePath: '/project/src/pages/Home.tsx',
      imports: ['@shared/Button'],
      config: {
        baseUrl: './src',
        paths: {
          '@shared/*': ['components/shared/*', 'shared/*'],
        },
      },
    });

    // Should use the first path in the array
    expect(result).toEqual(['../components/shared/Button']);
  });
});
