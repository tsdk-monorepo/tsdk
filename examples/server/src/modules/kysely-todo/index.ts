// import { Pool } from 'pg';
import SQLiteDatabase from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';

import { MovieTable, PersonTable, PetTable } from './KyselyTodo.entity';

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
