/**
 *
 * api-user.ts
 * @suhaotian/fe-sdk-example@1.0.0
 *
 **/
import {
  AddTodoReq,
  QueryTodoByCursorReq,
  QueryTodoByCursorRes,
  UpdateTodoReq,
  DeleteTodoReq,
  QueryTodoReq,
  QueryTodoRes,
} from './apiconf-refs';
/**
 * add todo
 *
 * @category todo
 */
export declare const AddTodo: {
  (
    data: AddTodoReq,
    requestConfig?:
      | import('./shared-refs').ObjectLiteral
      | import('./axios').RequestConfig<AddTodoReq>
      | undefined,
    needTrim?: boolean | undefined
  ): Promise<import('./shared-refs').InsertResult>;
  config: import('./shared-refs').APIConfig;
};
/**
 * query todo list by cursor
 *
 * @category others
 */
export declare const QueryTodoByCursor: {
  (
    data: QueryTodoByCursorReq,
    requestConfig?:
      | import('./shared-refs').ObjectLiteral
      | import('./axios').RequestConfig<QueryTodoByCursorReq>
      | undefined,
    needTrim?: boolean | undefined
  ): Promise<QueryTodoByCursorRes>;
  config: import('./shared-refs').APIConfig;
};
/**
 * update todo
 *
 * @category todo
 */
export declare const UpdateTodo: {
  (
    data: UpdateTodoReq,
    requestConfig?:
      | import('./shared-refs').ObjectLiteral
      | import('./axios').RequestConfig<UpdateTodoReq>
      | undefined,
    needTrim?: boolean | undefined
  ): Promise<import('./shared-refs').UpdateResult>;
  config: import('./shared-refs').APIConfig;
};
/**
 * delete todo
 *
 * @category todo
 */
export declare const DeleteTodo: {
  (
    data: DeleteTodoReq,
    requestConfig?:
      | import('./shared-refs').ObjectLiteral
      | import('./axios').RequestConfig<DeleteTodoReq>
      | undefined,
    needTrim?: boolean | undefined
  ): Promise<import('./shared-refs').DeleteResult>;
  config: import('./shared-refs').APIConfig;
};
/**
 * query todo
 *
 * @category todo
 */
export declare const QueryTodo: {
  (
    data: QueryTodoReq,
    requestConfig?:
      | import('./shared-refs').ObjectLiteral
      | import('./axios').RequestConfig<QueryTodoReq>
      | undefined,
    needTrim?: boolean | undefined
  ): Promise<QueryTodoRes>;
  config: import('./shared-refs').APIConfig;
};
