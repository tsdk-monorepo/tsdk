import {
  APIConfig,
  DeleteResult,
  ObjectLiteral,
  RequireOnlyOne,
  transformPath,
} from '/src/shared/tsdk-helper';

import { Todo } from '../Todo.entity';
import { deleteTodoSchema } from './TodoSchema.shared';

export const DeleteTodoConfig: APIConfig = {
  type: 'user',
  path: transformPath('DeleteTodo'),
  method: 'post',
  name: 'DeleteTodo',
  description: 'delete todo',
  category: 'todo',
  schema: deleteTodoSchema,
};

export type DeleteTodoReq = RequireOnlyOne<{
  id?: Pick<Todo, 'id'>['id'];
  IDs?: Pick<Todo, 'id'>['id'][];
}>;

export type DeleteTodoRes = DeleteResult;
