import { describe, it, expect, test } from 'vitest';
import { extractApiconfs } from '../src/extract-apiconfs';

const sampleInput = `
import type { Todo } from '../Todo.entity';
import { addTodoSchema } from './TodoSchema.shared';

import { InsertResult, transformPath, APIConfig } from '@/src/tsdk-shared/helpers';

/** hello */
export const AddTodoConfig: APIConfig = {
  type: 'user',
  a: '',
  /*
}*/
  path: transformPath('AddTodo'),
  method: 'post', // {}
  // description: 'add todo', // }
  category: 'todo',
  schema: addTodoSchema,
};

export type AddTodoReq = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export type AddTodoRes = InsertResult;
`;

const sampleInput2 = `
import type { Todo } from '../Todo.entity';
import { addTodoSchema } from './TodoSchema.shared';

import { InsertResult, transformPath, APIConfig } from '@/src/tsdk-shared/helpers';

/** hello */
export const AddTodoConfig: APIConfig = {
  type: 'user',
  path: '/add-todo',
  method: 'post', // {}
  // description: 'add todo', // }
  category: 'todo',
  schema: addTodoSchema,
};

export type AddTodoReq = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export type AddTodoRes = InsertResult;
`;

describe('extractApiconfs simple tests', () => {
  test('parses a simple API config with all properties', () => {
    const result = extractApiconfs(sampleInput);

    expect(result).toEqual([
      {
        name: 'AddTodo',
        type: 'user',
        path: "transformPath('AddTodo')",
        method: 'post',
        description: 'hello',
        category: '',
      },
    ]);
  });

  test('parses a simple API config with all properties 2', () => {
    const result = extractApiconfs(sampleInput2);

    expect(result).toEqual([
      {
        name: 'AddTodo',
        type: 'user',
        path: '/add-todo',
        method: 'post',
        description: 'hello',
        category: '',
      },
    ]);
  });
});

describe('extractApiconfs', () => {
  it('extracts basic API configuration', () => {
    const content = `
// Add todo item
export const AddTodoConfig: APIConfig = {
  method: 'POST',
  path: '/api/todos',
  type: 'mutation'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'AddTodo',
      method: 'POST',
      path: '/api/todos',
      type: 'mutation',
      description: 'Add todo item',
      category: '',
    });
  });

  it('handles multiline comments', () => {
    const content = `
/*
 * Get user list
 * Supports pagination
 */
export const GetUsersConfig = {
  method: 'GET',
  path: '/api/users'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].description).toContain('Get user list');
    expect(result[0].description).toContain('Supports pagination');
  });

  it('handles inline multiline comments', () => {
    const content = `
/* Delete user */
export const DeleteUserConfig = {
  method: 'DELETE',
  path: '/api/users/:id'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('Delete user');
    expect(result[0].name).toBe('DeleteUser');
  });

  it('extracts transformPath expressions', () => {
    const content = `
export const GetProjectConfig = {
  method: 'GET',
  path: transformPath('/api/projects/:id'),
  type: 'query'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].path).toBe("transformPath('/api/projects/:id')");
  });

  it('handles nested object structures', () => {
    const content = `
export const ComplexConfig = {
  method: 'POST',
  path: '/api/complex',
  options: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  type: 'mutation'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Complex');
    expect(result[0].method).toBe('POST');
    expect(result[0].type).toBe('mutation');
  });

  it('ignores lowercase-starting configs', () => {
    const content = `
export const validConfig = {
  method: 'GET',
  path: '/api/valid'
}

export const InvalidConfig = {
  method: 'POST',
  path: '/api/invalid'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Invalid');
  });

  it('handles multiple consecutive configs', () => {
    const content = `
// Create task
export const CreateTaskConfig = {
  method: 'POST',
  path: '/api/tasks'
}

// Update task
export const UpdateTaskConfig = {
  method: 'PUT',
  path: '/api/tasks/:id'
}

// Delete task
export const DeleteTaskConfig = {
  method: 'DELETE',
  path: '/api/tasks/:id'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('CreateTask');
    expect(result[0].description).toBe('Create task');
    expect(result[1].name).toBe('UpdateTask');
    expect(result[1].description).toBe('Update task');
    expect(result[2].name).toBe('DeleteTask');
    expect(result[2].description).toBe('Delete task');
  });

  it('prevents comment misattribution', () => {
    const content = `
// This is an unrelated comment
const someVariable = 'value';

// Get data
export const GetDataConfig = {
  method: 'GET',
  path: '/api/data'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('Get data');
    expect(result[0].description).not.toContain('unrelated comment');
  });

  it('handles comments inside config objects', () => {
    const content = `
export const ConfigWithCommentsConfig = {
  method: 'GET',
  /* Path comment */
  path: '/api/test',
  // Type comment - this line will be skipped
  type: 'query'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('/api/test');
    expect(result[0].type).toBe('query');
  });

  it('handles configs without type annotation', () => {
    const content = `
export const SimpleConfig = {
  method: 'GET',
  path: '/api/simple'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Simple');
  });

  it('handles empty file', () => {
    const result = extractApiconfs('');
    expect(result).toEqual([]);
  });

  it('handles file with only comments', () => {
    const content = `
// Only comments
/* No configs */
`;
    const result = extractApiconfs(content);
    expect(result).toEqual([]);
  });

  it('handles various quote types in paths', () => {
    const content = `
export const SingleQuoteConfig = {
  method: 'GET',
  path: '/api/single'
}

export const DoubleQuoteConfig = {
  method: 'GET',
  path: "/api/double"
}

export const BacktickConfig = {
  method: 'GET',
  path: \`/api/backtick\`
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(3);
    expect(result[0].path).toBe('/api/single');
    expect(result[1].path).toBe('/api/double');
    expect(result[2].path).toBe('/api/backtick');
  });

  it('handles deeply nested structures', () => {
    const content = `
export const NestedConfig = {
  method: 'POST',
  path: '/api/nested',
  metadata: {
    auth: {
      required: true,
      roles: ['admin', 'user']
    },
    cache: {
      enabled: false
    }
  },
  type: 'mutation'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].method).toBe('POST');
    expect(result[0].type).toBe('mutation');
  });

  it('extracts isGet property when present', () => {
    const content = `
export const GetWithIsGetConfig = {
  isGet: true,
  path: '/api/get-test',
  type: 'query'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('isGet', 'true');
  });

  it('handles empty config object', () => {
    const content = `
export const EmptyConfig = {
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Empty');
    expect(result[0].method).toBe('');
    expect(result[0].path).toBe('');
  });

  it('handles config with trailing comma', () => {
    const content = `
export const TrailingCommaConfig = {
  method: 'GET',
  path: '/api/test',
  type: 'query',
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('query');
  });

  it('handles multiple levels of array nesting', () => {
    const content = `
export const ArrayNestedConfig = {
  method: 'POST',
  path: '/api/array',
  data: {
    items: [
      { id: 1, name: 'test' },
      { id: 2, name: 'test2' }
    ]
  },
  type: 'mutation'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].method).toBe('POST');
    expect(result[0].path).toBe('/api/array');
  });

  it('handles indented configs', () => {
    const content = `
  // Indented comment
  export const IndentedConfig = {
    method: 'GET',
    path: '/api/indented',
    type: 'query'
  }
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Indented');
    expect(result[0].description).toBe('Indented comment');
  });

  it('handles config with no fields', () => {
    const content = `
export const NoFieldsConfig = {
  options: {
    retry: true
  }
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('NoFields');
    expect(result[0].method).toBe('');
    expect(result[0].path).toBe('');
    expect(result[0].type).toBe('');
  });

  it('handles consecutive multiline comments', () => {
    const content = `
/* First comment */
/* Second comment */
export const MultiCommentConfig = {
  method: 'GET',
  path: '/api/multi'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].description).toContain('First comment');
    expect(result[0].description).toContain('Second comment');
  });

  it('extracts config name ending with Config', () => {
    const content = `
export const UserApiConfig = {
  method: 'GET',
  path: '/api/users'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('UserApi');
  });

  it('handles mixed empty lines and comments', () => {
    const content = `

// First line

// Second line

export const MixedEmptyConfig = {
  method: 'POST',
  path: '/api/mixed'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].description).toContain('First line');
    expect(result[0].description).toContain('Second line');
  });

  it('handles isGet with boolean false', () => {
    const content = `
export const IsGetFalseConfig = {
  isGet: false,
  method: 'POST',
  path: '/api/post'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].isGet).toBe('false');
  });

  it('ignores non-Config exports', () => {
    const content = `
export const SomeConstant = 'value';
export const AnotherObject = { key: 'value' };

export const RealConfig = {
  method: 'GET',
  path: '/api/real'
}
`;
    const result = extractApiconfs(content);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Real');
  });
});
