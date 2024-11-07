import { config } from 'dotenv';
import { join } from 'path';
config();

module.exports = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: join(__dirname, 'src/database/migrations'),
    tableName: 'knex_migrations',
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
};
