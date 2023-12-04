import { InsertResult, transformPath, APIConfig } from '../../../shared/tsdk-helper';
import type { Todo } from '../Todo.entity';
import { addTodoSchema } from './TodoSchema.shared';

export const AddTodoConfig: APIConfig = {
  type: 'user',
  path: transformPath('AddTodo'),
  method: 'post',
  description: 'add todo',
  category: 'todo',
  schema: addTodoSchema,
};

export type AddTodoReq = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export type AddTodoRes = InsertResult;
