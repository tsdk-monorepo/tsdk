/**
 *
 * api-user.ts
 * @suhaotian/fe-sdk-demo@1.0.0
 *
 **/

import genApi from './gen-api';

import {
  AddTodoConfig,
  AddTodoReq,
  AddTodoRes,
  QueryTodoConfig,
  QueryTodoReq,
  QueryTodoRes,
  QueryTodoByCursorConfig,
  QueryTodoByCursorReq,
  QueryTodoByCursorRes,
  UpdateTodoConfig,
  UpdateTodoReq,
  UpdateTodoRes,
  DeleteTodoConfig,
  DeleteTodoReq,
  DeleteTodoRes,
} from './apiconf-refs';

/**
 * add todo
 *
 * @category todo
 */
export const AddTodo = genApi<AddTodoReq, AddTodoRes>(AddTodoConfig);

/**
 * query todo
 *
 * @category todo
 */
export const QueryTodo = genApi<QueryTodoReq, QueryTodoRes>(QueryTodoConfig);

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

/**
 * delete todo
 *
 * @category todo
 */
export const DeleteTodo = genApi<DeleteTodoReq, DeleteTodoRes>(DeleteTodoConfig);
