import { Todo } from '../Todo.entity';
import { updateTodoSchema } from './TodoSchema.shared';
import {
  APIConfig,
  ObjectLiteral,
  RequireAtLeastOne,
  transformPath,
  UpdateResult,
} from '../../../shared/tsdk-helper';
export const UpdateTodoConfig: APIConfig = {
  path: transformPath('UpdateTodo'),
  method: 'post',
  name: 'UpdateTodo',
  description: 'update todo',
  category: 'todo',
  type: 'user',
  schema: updateTodoSchema,
};

export type UpdateTodoReq = Pick<Todo, 'id'> &
  RequireAtLeastOne<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>;

export type UpdateTodoRes = UpdateResult;
