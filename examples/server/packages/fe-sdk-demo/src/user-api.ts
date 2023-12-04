/**
 *
 * api-user.ts
 * fe-sdk-demo@1.0.0
 *
 **/

import {
  AddTodoConfig,
  type AddTodoReq,
  type AddTodoRes,
  DeleteTodoConfig,
  type DeleteTodoReq,
  type DeleteTodoRes,
  QueryTodoByCursorConfig,
  type QueryTodoByCursorReq,
  type QueryTodoByCursorRes,
  QueryTodoConfig,
  type QueryTodoReq,
  type QueryTodoRes,
  UpdateTodoConfig,
  type UpdateTodoReq,
  type UpdateTodoRes,
} from './apiconf-refs';
import genApi from './gen-api';

export * from './common-api';

/**
 * add todo
 *
 * @category todo
 */
export const AddTodo = genApi<AddTodoReq, AddTodoRes>(AddTodoConfig);

/**
 * delete todo
 *
 * @category todo
 */
export const DeleteTodo = genApi<DeleteTodoReq, DeleteTodoRes>(DeleteTodoConfig);

/**
 * query todo list by cursor
 *
 * @category others
 */
export const QueryTodoByCursor = genApi<QueryTodoByCursorReq, QueryTodoByCursorRes>(
  QueryTodoByCursorConfig
);

/**
 * query todo
 *
 * @category todo
 */
export const QueryTodo = genApi<QueryTodoReq, QueryTodoRes>(QueryTodoConfig);

/**
 * update todo
 *
 * @category todo
 */
export const UpdateTodo = genApi<UpdateTodoReq, UpdateTodoRes>(UpdateTodoConfig);
