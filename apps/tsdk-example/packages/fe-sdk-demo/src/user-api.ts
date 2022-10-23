/**
 *
 * api-user.ts
 * @suhaotian/fe-sdk-demo@1.0.0
 *
 **/

import genApi from './gen-api';

import {
  QueryTodoByCursorConfig,
  QueryTodoByCursorReq,
  QueryTodoByCursorRes,
  AddTodoConfig,
  AddTodoReq,
  AddTodoRes,
  UpdateTodoConfig,
  UpdateTodoReq,
  UpdateTodoRes,
  QueryTodoConfig,
  QueryTodoReq,
  QueryTodoRes,
  DeleteTodoConfig,
  DeleteTodoReq,
  DeleteTodoRes,
} from './apiconf-refs';

/**
 * query todo list by cursor
 *
 * @category others
 */
export const QueryTodoByCursor = genApi<QueryTodoByCursorReq, QueryTodoByCursorRes>(
  QueryTodoByCursorConfig
);

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
