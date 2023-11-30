import { transformPath } from '../../../shared/tsdk-helper';
import { Todo } from '../Todo.entity';
import { deleteTodoSchema } from './TodoSchema.shared';
import {
  APIConfig,
  DeleteResult,
  ObjectLiteral,
  RequireOnlyOne,
} from '../../../shared/tsdk-helper';

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
