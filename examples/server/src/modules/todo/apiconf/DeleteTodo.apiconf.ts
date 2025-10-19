import { transformPath } from '/src/tsdk-shared/helpers';

import type { Todo } from '../Todo.entity';
import { deleteTodoSchema } from './TodoSchema.shared';

import { APIConfig } from '@/src/tsdk-shared/helpers';
import { RequireOnlyOne, DeleteResult } from '@/src/shared/types';

export const DeleteTodoConfig: APIConfig = {
  type: 'user',
  path: transformPath('DeleteTodo'),
  method: 'post',

  schema: deleteTodoSchema,
};

export type DeleteTodoReq = RequireOnlyOne<{
  id?: Pick<Todo, 'id'>['id'];
  IDs?: Pick<Todo, 'id'>['id'][];
}>;

export type DeleteTodoRes = DeleteResult;
