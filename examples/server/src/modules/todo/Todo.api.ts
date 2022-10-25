import genRoute from './gen-route';
import { todoService } from './Todo.service';
import { AddTodoConfig, AddTodoReq, AddTodoRes } from './apiconf/AddTodo.apiconf';
import { UpdateTodoConfig, UpdateTodoReq, UpdateTodoRes } from './apiconf/UpdateTodo.apiconf';
import { DeleteTodoConfig, DeleteTodoReq, DeleteTodoRes } from './apiconf/DeleteTodo.apiconf';
import { QueryTodoConfig, QueryTodoReq, QueryTodoRes } from './apiconf/QueryTodo.apiconf';
import {
  QueryTodoByCursorConfig,
  QueryTodoByCursorReq,
  QueryTodoByCursorRes,
} from './apiconf/QueryTodoByCursor.apiconf';

export function setupTodoRoute() {
  genRoute<QueryTodoReq, QueryTodoRes>(QueryTodoConfig, async (reqInfo, res, data) => {
    return todoService.queryTodo(data);
  });

  genRoute<QueryTodoByCursorReq, QueryTodoByCursorRes>(
    QueryTodoByCursorConfig,
    async (reqInfo, res, data) => {
      return todoService.queryTodoByCursor(data);
    }
  );

  genRoute<AddTodoReq, AddTodoRes>(AddTodoConfig, async (reqInfo, res, data) => {
    return todoService.createTodo(data);
  });

  genRoute<UpdateTodoReq, UpdateTodoRes>(UpdateTodoConfig, async (reqInfo, res, data) => {
    return todoService.updateTodo(data);
  });

  genRoute<DeleteTodoReq, DeleteTodoRes>(DeleteTodoConfig, async (reqInfo, res, data) => {
    return todoService.deleteTodo({
      ...data,
      ...reqInfo,
    });
  });
}
