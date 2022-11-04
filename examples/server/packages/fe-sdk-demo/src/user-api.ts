/**
 *
 * api-user.ts
 * fe-sdk-demo@1.0.0
 *
 **/

import genApi from './gen-api';

import {
  QueryTodoConfig,
  QueryTodoReq,
  QueryTodoRes,
  DeleteTodoConfig,
  DeleteTodoReq,
  DeleteTodoRes,
  AddTodoConfig,
  AddTodoReq,
  AddTodoRes,
  QueryTodoByCursorConfig,
  QueryTodoByCursorReq,
  QueryTodoByCursorRes,
  UpdateTodoConfig,
  UpdateTodoReq,
  UpdateTodoRes,
} from './apiconf-refs';

/**
 * query todo
 *
 * @category todo
 */
export const QueryTodo = genApi<QueryTodoReq, QueryTodoRes>(QueryTodoConfig);

/**
 * delete todo
 *
 * @category todo
 */
export const DeleteTodo = genApi<DeleteTodoReq, DeleteTodoRes>(DeleteTodoConfig);

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
 * update todo
 *
 * @category todo
 */
export const UpdateTodo = genApi<UpdateTodoReq, UpdateTodoRes>(UpdateTodoConfig);
