import knex from 'knex';
import { config } from 'dotenv';
config();

async function clearDatabase() {
  const knexInstance = knex({
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
  });

  try {
    console.log('Starting database cleanup...');

    // Получаем все таблицы, исключая системные
    const tables = await knexInstance.raw(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename != 'migrations'
      AND tablename != 'migrations_lock'
    `);

    // Отключаем проверку внешних ключей
    await knexInstance.raw('SET CONSTRAINTS ALL DEFERRED');

    // Очищаем таблицы
    for (const { tablename } of tables.rows) {
      try {
        await knexInstance(tablename).del();
        console.log(`Table "${tablename}" cleared`);
      } catch (err) {
        console.warn(`Warning: Could not clear table "${tablename}":`, err.message);
      }
    }

    // Включаем обратно проверку внешних ключей
    await knexInstance.raw('SET CONSTRAINTS ALL IMMEDIATE');

    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  } finally {
    await knexInstance.destroy();
  }
}

clearDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));