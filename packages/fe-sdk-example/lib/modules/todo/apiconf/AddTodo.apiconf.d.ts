import { Todo } from '../Todo.entity';
import { APIConfig, InsertResult } from '../../../shared/tsdk-helper';
export declare const AddTodoConfig: APIConfig;
export declare type AddTodoReq = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;
export declare type AddTodoRes = InsertResult;
