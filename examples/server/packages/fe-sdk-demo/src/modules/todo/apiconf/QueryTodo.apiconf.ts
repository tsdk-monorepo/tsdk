import { APIConfig, transformPath, ObjectLiteral } from '../../../shared/tsdk-helper';
import { Paging, PagingRes } from '../../../shared/paging';
import { Todo } from '../Todo.entity';
import { queryTodoSchema } from './TodoSchema.shared';

export const QueryTodoConfig: APIConfig = {
  path: transformPath('QueryTodo'),
  method: 'get',
  name: 'QueryTodo',
  description: 'query todo',
  category: 'todo',
  type: 'user',
  schema: queryTodoSchema,
};

export type QueryTodoReq = Pick<Paging, 'page' | 'perPage'> & {
  keyword?: string;
};

export type QueryTodoRes = Omit<PagingRes<Todo>, 'beforeCursor' | 'afterCursor'>;
