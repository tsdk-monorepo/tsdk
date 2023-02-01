// import { Pool } from 'pg';
import type { Generated, ColumnType, Selectable, Insertable, Updateable } from 'kysely';

export interface PersonTable {
  // Columns that are generated by the database should be marked
  // using the `Generated` type. This way they are automatically
  // made optional in inserts and updates.
  id: Generated<number>;

  first_name: string;
  gender: 'male' | 'female' | 'other';

  // If the column is nullable in the database, make its type nullable.
  // Don't use optional properties. Optionality is always determined
  // automatically by Kysely.
  last_name: string | null;

  // You can specify a different type for each operation (select, insert and
  // update) using the `ColumnType<SelectType, InsertType, UpdateType>`
  // wrapper. Here we define a column `modified_at` that is selected as
  // a `Date`, can optionally be provided as a `string` in inserts and
  // can never be updated:
  modified_at: ColumnType<Date, string | undefined, never>;
}

export interface PetTable {
  id: Generated<number>;
  name: string;
  owner_id: number;
  species: 'dog' | 'cat';
}

export interface MovieTable {
  id: Generated<string>;
  stars: number;
}

// You can extract the select, insert and update interfaces like this
// if you want (you don't need to):
export type Person = Selectable<PersonTable>;
export type InsertablePerson = Insertable<PersonTable>;
export type UpdateablePerson = Updateable<PersonTable>;
