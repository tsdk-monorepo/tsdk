import { describe, expect, test } from 'vitest';
import { extractApiconfs as extractAPIConfigs } from '../src/extract-apiconfs'; // Adjust path as needed

const sampleInput = `
import type { Todo } from '../Todo.entity';
import { addTodoSchema } from './TodoSchema.shared';

import { InsertResult, transformPath, APIConfig } from '@/src/shared/tsdk-helper';

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

import { InsertResult, transformPath, APIConfig } from '@/src/shared/tsdk-helper';

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

describe('extractAPIConfigs', () => {
  test('parses a simple API config with all properties', () => {
    const result = extractAPIConfigs(sampleInput);

    expect(result).toEqual([
      {
        name: 'AddTodo',
        type: 'user',
        path: "transformPath('AddTodo')",
        method: 'post',
        description: 'hello',
        category: 'todo',
      },
    ]);
  });

  test('parses a simple API config with all properties 2', () => {
    const result = extractAPIConfigs(sampleInput2);

    expect(result).toEqual([
      {
        name: 'AddTodo',
        type: 'user',
        path: '/add-todo',
        method: 'post',
        description: 'hello',
        category: 'todo',
      },
    ]);
  });
});
