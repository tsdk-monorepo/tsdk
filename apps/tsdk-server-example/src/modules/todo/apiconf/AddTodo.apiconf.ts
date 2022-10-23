import { Todo } from '../Todo.entity';
import { addTodoSchema } from './TodoSchema.apiconf';
import { APIConfig, InsertResult, ObjectLiteral, transformPath } from '/src/shared/tsdk-helper';

export const AddTodoConfig: APIConfig = {
  path: transformPath('AddTodo'),
  method: 'post',
  name: 'AddTodo',
  description: 'add todo',
  category: 'todo',
  type: 'user',
  schema: addTodoSchema,
};

export type AddTodoReq = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export type AddTodoRes = InsertResult;
