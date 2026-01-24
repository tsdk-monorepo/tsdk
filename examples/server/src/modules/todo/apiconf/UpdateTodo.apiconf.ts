import type { Todo } from '../Todo.entity';
import { updateTodoSchema } from './TodoSchema.shared';

import { APIConfig, transformPath } from '@/src/tsdk-shared/helpers';
import { RequireAtLeastOne, UpdateResult } from '@/src/shared/types';

export const UpdateTodoConfig: APIConfig = {
  type: 'user',
  path: transformPath('UpdateTodo'),
  method: 'post',

  schema: updateTodoSchema,
};

export type UpdateTodoReq = Pick<Todo, 'id'> &
  RequireAtLeastOne<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>;

export type UpdateTodoRes = UpdateResult;
