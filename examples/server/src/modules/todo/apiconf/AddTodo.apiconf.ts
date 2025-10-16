import type { Todo } from '../Todo.entity';
import { addTodoSchema } from './TodoSchema.shared';

import { InsertResult, transformPath, APIConfig } from '@/src/tsdk-shared/helpers';

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
  path: transformPath('AddTodo2'),
  method: 'post',
};

export type AddTodo2Req = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export type AddTodo2Res = InsertResult;
