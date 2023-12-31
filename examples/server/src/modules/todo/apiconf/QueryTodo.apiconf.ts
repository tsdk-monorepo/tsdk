import type { Todo } from '../Todo.entity';
import { queryTodoSchema } from './TodoSchema.shared';

import { Paging, PagingRes } from '@/src/shared/paging';
import { APIConfig, transformPath } from '@/src/shared/tsdk-helper';

export const QueryTodoConfig: APIConfig = {
  path: transformPath('QueryTodo'),
  method: 'get',

  description: 'query todo',
  category: 'todo',
  type: 'user',
  schema: queryTodoSchema,
};

export type QueryTodoReq = Pick<Paging, 'page' | 'perPage'> & {
  keyword?: string;
};

export type QueryTodoRes = Omit<PagingRes<Todo>, 'beforeCursor' | 'afterCursor'>;
