/**
 *
 * api-user.ts
 * fe-sdk-demo@1.0.0
 *
 **/

import {
  DeleteTodoConfig,
  DeleteTodoReq,
  DeleteTodoRes,
  QueryTodoConfig,
  QueryTodoReq,
  QueryTodoRes,
  AddTodoConfig,
  AddTodoReq,
  AddTodoRes,
  UpdateTodoConfig,
  UpdateTodoReq,
  UpdateTodoRes,
  QueryTodoByCursorConfig,
  QueryTodoByCursorReq,
  QueryTodoByCursorRes,
} from './apiconf-refs';
import genApi from './gen-api';

/**
 * delete todo
 *
 * @category todo
 */
export const DeleteTodo = genApi<DeleteTodoReq, DeleteTodoRes>(DeleteTodoConfig);

/**
 * query todo
 *
 * @category todo
 */
export const QueryTodo = genApi<QueryTodoReq, QueryTodoRes>(QueryTodoConfig);

/**
 * add todo
 *
 * @category todo
 */
export const AddTodo = genApi<AddTodoReq, AddTodoRes>(AddTodoConfig);

/**
 * update todo
 *
 * @category todo
 */
export const UpdateTodo = genApi<UpdateTodoReq, UpdateTodoRes>(UpdateTodoConfig);

/**
 * query todo list by cursor
 *
 * @category others
 */
export const QueryTodoByCursor = genApi<QueryTodoByCursorReq, QueryTodoByCursorRes>(
  QueryTodoByCursorConfig
);
