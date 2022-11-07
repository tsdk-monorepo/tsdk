/**
 *
 * api-user.ts
 * fe-sdk-demo@1.0.0
 *
 **/

import genApi from './gen-api';

import {
  AddTodoConfig,
  AddTodoReq,
  AddTodoRes,
  QueryTodoByCursorConfig,
  QueryTodoByCursorReq,
  QueryTodoByCursorRes,
  DeleteTodoConfig,
  DeleteTodoReq,
  DeleteTodoRes,
  QueryTodoConfig,
  QueryTodoReq,
  QueryTodoRes,
  UpdateTodoConfig,
  UpdateTodoReq,
  UpdateTodoRes,
} from './apiconf-refs';

/**
 * add todo
 *
 * @category todo
 */
export const AddTodo = genApi<AddTodoReq, AddTodoRes>(AddTodoConfig);

/**
 * query todo list by cursor
 *
 * @category others
 */
export const QueryTodoByCursor = genApi<QueryTodoByCursorReq, QueryTodoByCursorRes>(
  QueryTodoByCursorConfig
);

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
 * update todo
 *
 * @category todo
 */
export const UpdateTodo = genApi<UpdateTodoReq, UpdateTodoRes>(UpdateTodoConfig);
