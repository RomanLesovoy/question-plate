import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import knex from 'knex';
import { initTables } from './init-tables';
import { initDatabase } from './init-database';
import { config } from 'dotenv';
config();

const databaseProvider = {
  provide: 'KNEX_CONNECTION',
  useFactory: async () => {
    await initDatabase();

    const knexInstance = knex({
      client: 'postgresql',
      connection: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      },
      pool: { min: 2, max: 10 },
    });

    await initTables(knexInstance);

    return knexInstance;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [databaseProvider],
  exports: ['KNEX_CONNECTION'],
})
export class DatabaseModule {}
