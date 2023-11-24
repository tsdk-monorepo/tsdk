import { AxiosRequestConfig } from 'axios';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';

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
import { AddTodo, DeleteTodo, QueryTodoByCursor, QueryTodo, UpdateTodo } from './user-api';

export * from './common-api-hooks';

export function useAddTodo(
  options?: SWRMutationConfiguration<AddTodoRes, { arg: AddTodoReq }, string>,
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
  options?: SWRMutationConfiguration<DeleteTodoRes, { arg: DeleteTodoReq }, string>,
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

export function useUpdateTodo(
  options?: SWRMutationConfiguration<UpdateTodoRes, { arg: UpdateTodoReq }, string>,
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
