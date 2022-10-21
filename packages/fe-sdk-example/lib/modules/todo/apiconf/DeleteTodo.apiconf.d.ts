import { APIConfig, DeleteResult, RequireOnlyOne } from '../../../shared/tsdk-helper';
import { Todo } from '../Todo.entity';
export declare const DeleteTodoConfig: APIConfig;
export declare type DeleteTodoReq = RequireOnlyOne<{
  id?: Pick<Todo, 'id'>['id'];
  IDs?: Pick<Todo, 'id'>['id'][];
}>;
export declare type DeleteTodoRes = DeleteResult;
