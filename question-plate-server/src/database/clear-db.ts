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
      database: process.env.DB_DATABASE
    },
  });

  try {
    console.log('Starting database cleanup...');

    const tables = await knexInstance.raw(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    await knexInstance.raw('SET session_replication_role = replica;');

    for (const { tablename } of tables.rows) {
      await knexInstance.raw(`TRUNCATE TABLE "${tablename}" CASCADE`);
      console.log(`Table "${tablename}" cleared`);
    }

    await knexInstance.raw('SET session_replication_role = DEFAULT;');

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
