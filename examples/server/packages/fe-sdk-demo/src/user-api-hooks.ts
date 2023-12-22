import {
  useQuery,
  useMutation,
  QueryClient,
  UndefinedInitialDataOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

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
  TestPathParamsConfig,
  type TestPathParamsReq,
  type TestPathParamsRes,
  UpdateTodoConfig,
  type UpdateTodoReq,
  type UpdateTodoRes,
} from './apiconf-refs';
import { setQueryClientForCommon } from './common-api-hooks';
import {
  AddTodo,
  DeleteTodo,
  QueryTodoByCursor,
  QueryTodo,
  TestPathParams,
  UpdateTodo,
} from './user-api';

export * from './common-api-hooks';
export function setQueryClient(queryClient: QueryClient) {
  _queryClient = queryClient;
  setQueryClientForCommon(queryClient);
}

let _queryClient: QueryClient;

/**
 * add todo
 *
 * @category todo
 */
export function useAddTodo(
  options?: UseMutationOptions<AddTodoRes, Error, AddTodoReq, unknown>,
  queryClient?: QueryClient,
  requestConfig?: AxiosRequestConfig<AddTodoReq>,
  needTrim?: boolean
) {
  return useMutation(
    {
      ...(options || {}),
      mutationFn(payload) {
        return AddTodo(payload, requestConfig, needTrim);
      },
    },
    queryClient || _queryClient
  );
}

/**
 * delete todo
 *
 * @category todo
 */
export function useDeleteTodo(
  options?: UseMutationOptions<DeleteTodoRes, Error, DeleteTodoReq, unknown>,
  queryClient?: QueryClient,
  requestConfig?: AxiosRequestConfig<DeleteTodoReq>,
  needTrim?: boolean
) {
  return useMutation(
    {
      ...(options || {}),
      mutationFn(payload) {
        return DeleteTodo(payload, requestConfig, needTrim);
      },
    },
    queryClient || _queryClient
  );
}

/**
 * query todo list by cursor
 *
 * @category others
 */
export function useQueryTodoByCursor(
  payload: QueryTodoByCursorReq | undefined,
  options?: UndefinedInitialDataOptions<QueryTodoByCursorRes | undefined, Error>,
  queryClient?: QueryClient,
  requestConfig?: AxiosRequestConfig<QueryTodoByCursorReq>,
  needTrim?: boolean
) {
  return useQuery(
    {
      ...(options || {}),
      queryKey: [QueryTodoByCursor.config.path, payload],
      queryFn() {
        if (typeof payload === 'undefined') {
          return undefined;
        }
        return QueryTodoByCursor(payload, requestConfig, needTrim);
      },
    },
    queryClient || _queryClient
  );
}

/**
 * query todo
 *
 * @category todo
 */
export function useQueryTodo(
  payload: QueryTodoReq | undefined,
  options?: UndefinedInitialDataOptions<QueryTodoRes | undefined, Error>,
  queryClient?: QueryClient,
  requestConfig?: AxiosRequestConfig<QueryTodoReq>,
  needTrim?: boolean
) {
  return useQuery(
    {
      ...(options || {}),
      queryKey: [QueryTodo.config.path, payload],
      queryFn() {
        if (typeof payload === 'undefined') {
          return undefined;
        }
        return QueryTodo(payload, requestConfig, needTrim);
      },
    },
    queryClient || _queryClient
  );
}

/**
 * Test path params
 *
 * @category test
 */
export function useTestPathParams(
  payload: TestPathParamsReq | undefined,
  options?: UndefinedInitialDataOptions<TestPathParamsRes | undefined, Error>,
  queryClient?: QueryClient,
  requestConfig?: AxiosRequestConfig<TestPathParamsReq>,
  needTrim?: boolean
) {
  return useQuery(
    {
      ...(options || {}),
      queryKey: [TestPathParams.config.path, payload],
      queryFn() {
        if (typeof payload === 'undefined') {
          return undefined;
        }
        return TestPathParams(payload, requestConfig, needTrim);
      },
    },
    queryClient || _queryClient
  );
}

/**
 * update todo
 *
 * @category todo
 */
export function useUpdateTodo(
  options?: UseMutationOptions<UpdateTodoRes, Error, UpdateTodoReq, unknown>,
  queryClient?: QueryClient,
  requestConfig?: AxiosRequestConfig<UpdateTodoReq>,
  needTrim?: boolean
) {
  return useMutation(
    {
      ...(options || {}),
      mutationFn(payload) {
        return UpdateTodo(payload, requestConfig, needTrim);
      },
    },
    queryClient || _queryClient
  );
}
