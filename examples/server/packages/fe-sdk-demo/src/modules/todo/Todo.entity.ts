import { CreatedUpdatedAt } from '../../db/entity/CreatedUpdated.entity';

export enum TodoStatus {
  todo = 'todo',
  doing = 'doing',
  completed = 'completed',
  deleted = 'deleted',
}

const entityName = 'todo_item';

export class Todo extends CreatedUpdatedAt {
  static entityName = entityName;

  id: number;

  /** title */
  title: string;

  /** status */
  status: TodoStatus;

  /** remark */
  remark?: string;
}
