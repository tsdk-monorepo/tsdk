import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAt } from '/src/db/entity/CreatedUpdated.entity';

export enum TodoStatus {
  todo = 'todo',
  doing = 'doing',
  completed = 'completed',
  deleted = 'deleted',
}

export const todoStatus = Object.values(TodoStatus);

const entityName = 'todo_item';

@Entity({ name: entityName })
export class Todo extends CreatedUpdatedAt {
  static entityName = entityName;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  /** title */
  title: string;

  @Column()
  /** status */
  status: TodoStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  /** remark */
  remark?: string;
}
