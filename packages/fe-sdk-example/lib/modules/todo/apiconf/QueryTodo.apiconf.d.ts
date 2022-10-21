import { APIConfig } from '../../../shared/tsdk-helper';
import { Paging, PagingRes } from '../../../shared/paging';
import { Todo } from '../Todo.entity';
export declare const QueryTodoConfig: APIConfig;
export declare type QueryTodoReq = Pick<Paging, 'page' | 'perPage'> & {
  keyword?: string;
};
export declare type QueryTodoRes = Omit<PagingRes<Todo>, 'beforeCursor' | 'afterCursor'>;
