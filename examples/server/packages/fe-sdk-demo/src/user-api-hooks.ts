import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
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
import {
  AddTodo,
  DeleteTodo,
  QueryTodoByCursor,
  QueryTodo,
  TestPathParams,
  UpdateTodo,
} from './user-api';

export * from './common-api-hooks';

export function useAddTodo(
  options?: SWRMutationConfiguration<AddTodoRes, Error, string, AddTodoReq>,
  requestConfig?: AxiosRequestConfig<AddTodoReq>,
  needTrim?: boolean
) {
  return useSWRMutation(
    AddTodo.config.path,
    (url, { arg }: { arg: AddTodoReq }) => {
      return AddTodo(arg, requestConfig, needTrim);
    },
    options
  );
}

export function useDeleteTodo(
  options?: SWRMutationConfiguration<DeleteTodoRes, Error, string, DeleteTodoReq>,
  requestConfig?: AxiosRequestConfig<DeleteTodoReq>,
  needTrim?: boolean
) {
  return useSWRMutation(
    DeleteTodo.config.path,
    (url, { arg }: { arg: DeleteTodoReq }) => {
      return DeleteTodo(arg, requestConfig, needTrim);
    },
    options
  );
}

export function useQueryTodoByCursor(
  payload: QueryTodoByCursorReq,
  options?: SWRConfiguration<QueryTodoByCursorRes>,
  requestConfig?: AxiosRequestConfig<QueryTodoByCursorReq>,
  needTrim?: boolean
) {
  return useSWR(
    { url: QueryTodoByCursor.config.path, arg: payload },
    ({ arg }) => {
      return QueryTodoByCursor(arg, requestConfig, needTrim);
    },
    options
  );
}

export function useQueryTodo(
  payload: QueryTodoReq,
  options?: SWRConfiguration<QueryTodoRes>,
  requestConfig?: AxiosRequestConfig<QueryTodoReq>,
  needTrim?: boolean
) {
  return useSWR(
    { url: QueryTodo.config.path, arg: payload },
    ({ arg }) => {
      return QueryTodo(arg, requestConfig, needTrim);
    },
    options
  );
}

export function useTestPathParams(
  payload: TestPathParamsReq,
  options?: SWRConfiguration<TestPathParamsRes>,
  requestConfig?: AxiosRequestConfig<TestPathParamsReq>,
  needTrim?: boolean
) {
  return useSWR(
    { url: TestPathParams.config.path, arg: payload },
    ({ arg }) => {
      return TestPathParams(arg, requestConfig, needTrim);
    },
    options
  );
}

export function useUpdateTodo(
  options?: SWRMutationConfiguration<UpdateTodoRes, Error, string, UpdateTodoReq>,
  requestConfig?: AxiosRequestConfig<UpdateTodoReq>,
  needTrim?: boolean
) {
  return useSWRMutation(
    UpdateTodo.config.path,
    (url, { arg }: { arg: UpdateTodoReq }) => {
      return UpdateTodo(arg, requestConfig, needTrim);
    },
    options
  );
}
