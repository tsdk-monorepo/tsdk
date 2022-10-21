import { Todo } from '../Todo.entity';
import { APIConfig, RequireAtLeastOne, UpdateResult } from '../../../shared/tsdk-helper';
export declare const UpdateTodoConfig: APIConfig;
export declare type UpdateTodoReq = Pick<Todo, 'id'> &
  RequireAtLeastOne<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>;
export declare type UpdateTodoRes = UpdateResult;
