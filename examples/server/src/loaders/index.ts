import { initializeDataSources } from '/src/db';

export async function runLoader() {
  await initializeDataSources();
  console.info('TypeORM dataSources loaded');
}
