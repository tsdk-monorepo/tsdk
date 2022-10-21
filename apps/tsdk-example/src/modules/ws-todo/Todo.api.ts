import genRoute from "../todo/gen-route";
import { todoService } from "../todo/Todo.service";
import {
  AddTodoConfig,
  AddTodoReq,
  AddTodoRes,
} from "../todo/apiconf/AddTodo.apiconf";
import {
  UpdateTodoConfig,
  UpdateTodoReq,
  UpdateTodoRes,
} from "../todo/apiconf/UpdateTodo.apiconf";
import {
  DeleteTodoConfig,
  DeleteTodoReq,
  DeleteTodoRes,
} from "../todo/apiconf/DeleteTodo.apiconf";
import {
  QueryTodoConfig,
  QueryTodoReq,
  QueryTodoRes,
} from "../todo/apiconf/QueryTodo.apiconf";
import {
  QueryTodoByCursorConfig,
  QueryTodoByCursorReq,
  QueryTodoByCursorRes,
} from "../todo/apiconf/QueryTodoByCursor.apiconf";

export function setupTodoRoute() {
  genRoute<QueryTodoReq, QueryTodoRes>(
    QueryTodoConfig,
    async (reqInfo, res, data) => {
      return todoService.queryTodo(data);
    }
  );

  genRoute<QueryTodoByCursorReq, QueryTodoByCursorRes>(
    QueryTodoByCursorConfig,
    async (reqInfo, res, data) => {
      return todoService.queryTodoByCursor(data);
    }
  );

  genRoute<AddTodoReq, AddTodoRes>(
    AddTodoConfig,
    async (reqInfo, res, data) => {
      return todoService.createTodo(data);
    }
  );

  genRoute<UpdateTodoReq, UpdateTodoRes>(
    UpdateTodoConfig,
    async (reqInfo, res, data) => {
      return todoService.updateTodo(data);
    }
  );

  genRoute<DeleteTodoReq, DeleteTodoRes>(
    DeleteTodoConfig,
    async (reqInfo, res, data) => {
      return todoService.deleteTodo({
        ...data,
        ...reqInfo,
      });
    }
  );
}
