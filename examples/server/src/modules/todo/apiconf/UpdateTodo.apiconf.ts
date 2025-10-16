import type { Todo } from '../Todo.entity';
import { updateTodoSchema } from './TodoSchema.shared';

import {
  APIConfig,
  RequireAtLeastOne,
  transformPath,
  UpdateResult,
} from '@/src/tsdk-shared/helpers';

export const UpdateTodoConfig: APIConfig = {
  type: 'user',
  path: transformPath('UpdateTodo'),
  method: 'post',

  schema: updateTodoSchema,
};

export type UpdateTodoReq = Pick<Todo, 'id'> &
  RequireAtLeastOne<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>;

export type UpdateTodoRes = UpdateResult;
