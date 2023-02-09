/**
 *
 * api-user.ts
 * fe-sdk-demo@1.0.0
 *
 **/

import {
  AddTodoConfig,
  AddTodoReq,
  AddTodoRes,
  DeleteTodoConfig,
  DeleteTodoReq,
  DeleteTodoRes,
  QueryTodoByCursorConfig,
  QueryTodoByCursorReq,
  QueryTodoByCursorRes,
  QueryTodoConfig,
  QueryTodoReq,
  QueryTodoRes,
  UpdateTodoConfig,
  UpdateTodoReq,
  UpdateTodoRes,
} from './apiconf-refs';
import genApi from './gen-api';

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
