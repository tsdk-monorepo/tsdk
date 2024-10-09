import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'; // from

import { CreatedUpdatedAt } from '@/src/db/entity/CreatedUpdated.entity';

export enum TodoStatus {
  todo = 'todo',
  doing = 'doing',
  completed = 'completed',
  deleted = 'deleted',
}

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

  @Column({
    nullable: true, // from
  })
  /** for test only */
  from?: string;

  @Column({
    nullable: true,
  })
  /** for test only */
  _from?: string;

  @Column({
    nullable: true,
  })
  /** for test only from */
  from_?: string;
}
