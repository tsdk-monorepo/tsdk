import 'reflect-metadata';
import { DataSource } from 'typeorm';

import './entities-ref';
import { getEntites } from './register-entities';

const IS_TEST_ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'test';

export const appDataSource = new DataSource(
  IS_TEST_ENV
    ? {
        type: 'better-sqlite3',
        database: './test.db',
        synchronize: true,
        dropSchema: true,
        logging: false,
        entities: getEntites(),
        subscribers: [],
        migrations: [],
      }
    : {
        type: 'better-sqlite3',
        database: './normal.db',
        synchronize: true,
        logging: true,
        entities: getEntites(),
        subscribers: [],
        migrations: [],
      }
);

export async function initializeDataSources() {
  await Promise.all([appDataSource.initialize()]);

  console.log('appDataSource.isInitialized ', appDataSource.isInitialized);
}
