import {
  transformPath,
  APIConfig,
  DeleteResult,
  RequireOnlyOne,
} from '../../../shared/tsdk-helper';
import type { Todo } from '../Todo.entity';
import { deleteTodoSchema } from './TodoSchema.shared';

export const DeleteTodoConfig: APIConfig = {
  type: 'user',
  path: transformPath('DeleteTodo'),
  method: 'post',

  description: 'delete todo',
  category: 'todo',
  schema: deleteTodoSchema,
};

export type DeleteTodoReq = RequireOnlyOne<{
  id?: Pick<Todo, 'id'>['id'];
  IDs?: Pick<Todo, 'id'>['id'][];
}>;

export type DeleteTodoRes = DeleteResult;
