import { Todo } from '../Todo.entity';
import { addTodoSchema } from './TodoSchema.shared';
import { APIConfig, InsertResult, ObjectLiteral, transformPath } from '../../../shared/tsdk-helper';
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
