import {
  APIConfig,
  ObjectLiteral,
  RequireAtLeastOne,
  transformPath,
  UpdateResult,
} from '../../../shared/tsdk-helper';
import { Todo } from '../Todo.entity';
import { updateTodoSchema } from './TodoSchema.shared';

export const UpdateTodoConfig: APIConfig = {
  type: 'user',
  path: transformPath('UpdateTodo'),
  method: 'post',

  description: 'update todo',
  category: 'todo',
  schema: updateTodoSchema,
};

export type UpdateTodoReq = Pick<Todo, 'id'> &
  RequireAtLeastOne<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>;

export type UpdateTodoRes = UpdateResult;
