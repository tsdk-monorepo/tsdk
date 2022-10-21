import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreatedAt {
  @CreateDateColumn()
  /** createdAt */
  createdAt: Date;
}

export class UpdatedAt {
  @UpdateDateColumn()
  /** updatedAt */
  updatedAt: Date;
}

export class CreatedUpdatedAt extends UpdatedAt {
  @CreateDateColumn()
  /** createdAt */
  createdAt: Date;
}
