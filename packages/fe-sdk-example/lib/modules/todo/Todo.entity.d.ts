import { CreatedUpdatedAt } from '../../db/entity/CreatedUpdated.entity';
export declare enum TodoStatus {
  todo = 'todo',
  doing = 'doing',
  completed = 'completed',
  deleted = 'deleted',
}
export declare const todoStatus: TodoStatus[];
export declare class Todo extends CreatedUpdatedAt {
  static entityName: string;
  id: number;
  /** title */
  title: string;
  /** status */
  status: TodoStatus;
  /** remark */
  remark?: string;
}
