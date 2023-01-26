// import { Pool } from 'pg';
import SQLiteDatabase from 'better-sqlite3';
import {
  Kysely,
  SqliteDialect,
  Generated,
  ColumnType,
  Selectable,
  Insertable,
  Updateable,
} from 'kysely';

interface PersonTable {
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

interface PetTable {
  id: Generated<number>;
  name: string;
  owner_id: number;
  species: 'dog' | 'cat';
}

interface MovieTable {
  id: Generated<string>;
  stars: number;
}

// Keys of this interface are table names.
interface Database {
  person: PersonTable;
  pet: PetTable;
  movie: MovieTable;
}

// You'd create one of these when you start your app.
const db = new Kysely<Database>({
  // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
  dialect: new SqliteDialect({
    database: async () => new SQLiteDatabase('db.sqlite'),
    // pool: new Pool({
    //   host: 'localhost',
    //   database: 'kysely_test',
    // }),
  }),
});

async function demo() {
  const { id } = await db
    .insertInto('person')
    .values({ first_name: 'Jennifer', gender: 'female' })
    .returning('id')
    .executeTakeFirstOrThrow();

  await db.insertInto('pet').values({ name: 'Catto', species: 'cat', owner_id: id }).execute();

  const person = await db
    .selectFrom('person')
    .innerJoin('pet', 'pet.owner_id', 'person.id')
    .select(['first_name', 'pet.name as pet_name'])
    .where('person.id', '=', id)
    .executeTakeFirst();

  if (person) {
    person.pet_name;
  }
}

// You can extract the select, insert and update interfaces like this
// if you want (you don't need to):
type Person = Selectable<PersonTable>;
type InsertablePerson = Insertable<PersonTable>;
type UpdateablePerson = Updateable<PersonTable>;
