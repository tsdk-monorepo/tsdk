import type { Todo } from '../Todo.entity';
import { queryTodoByCursorSchema } from './TodoSchema.shared';
import { Paging, PagingRes } from '../../../shared/paging';
import { APIConfig, transformPath } from '../../../shared/tsdk-helper';

/**
 * query todo list by cursor ({@link APIConfig})
 * @category QueryTodoByCursor
 */
export const QueryTodoByCursorConfig: APIConfig = {
  type: 'user',

  method: 'get',
  path: transformPath('QueryTodoByCursor'),
  schema: queryTodoByCursorSchema,
  description: 'query todo list by cursor',
};
/**
 *
 * @category QueryTodoByCursor
 */
export type QueryTodoByCursorReq = Pick<Paging, 'beforeCursor' | 'afterCursor' | 'perPage'> & {
  keyword?: string;
};

/**
 *
 * @category QueryTodoByCursor
 */
export type QueryTodoByCursorRes = Omit<PagingRes<Todo>, 'page' | 'total'>;
// --------- QueryTodoByCursor END ---------
