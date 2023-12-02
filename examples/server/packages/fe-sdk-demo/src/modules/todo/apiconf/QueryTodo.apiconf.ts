import type { Todo } from '../Todo.entity';
import { queryTodoSchema } from './TodoSchema.shared';
import { Paging, PagingRes } from '../../../shared/paging';
import { APIConfig, transformPath } from '../../../shared/tsdk-helper';

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
