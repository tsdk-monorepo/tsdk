import { Paging, PagingRes } from '../../../shared/paging';
import { APIConfig } from '../../../shared/tsdk-helper';
import { Todo } from '../Todo.entity';
/**
 * query todo list by cursor ({@link APIConfig})
 * @category QueryTodoByCursor
 */
export declare const QueryTodoByCursorConfig: APIConfig;
/**
 *
 * @category QueryTodoByCursor
 */
export declare type QueryTodoByCursorReq = Pick<
  Paging,
  'beforeCursor' | 'afterCursor' | 'perPage'
> & {
  keyword?: string;
};
/**
 *
 * @category QueryTodoByCursor
 */
export declare type QueryTodoByCursorRes = Omit<PagingRes<Todo>, 'page' | 'total'>;
