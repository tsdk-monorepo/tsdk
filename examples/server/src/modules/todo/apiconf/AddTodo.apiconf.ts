import { InsertResult } from '@/src/shared/types';
import type { Todo } from '../Todo.entity';
import { addTodoSchema } from './TodoSchema.shared';

import { transformPath, APIConfig } from '@/src/tsdk-shared/helpers';

export const AddTodoConfig: APIConfig = {
  type: 'user',
  path: transformPath('AddTodo'),
  method: 'post',
  schema: addTodoSchema,
};

export type AddTodoReq = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export type AddTodoRes = InsertResult;

// For `type: 'admin'` test only
export const AddTodo2Config: APIConfig = {
  type: 'admin',
  /** import a from 'xx' */
  path: transformPath('AddTodo2'),
  /**
   *
   * import a from 'xx'
   * import { a
   * b,
   * } from "xx"
   */
  method: 'post',
};

export type AddTodo2Req = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> & {
  /** Namespace to import repo into */
  new_namespace?: string;
};

/**
 *
 * import a from 'xx'
 * import { a
 * b,
 * } from "xx"
 */
export type AddTodo2Res = InsertResult;
