import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import knex from 'knex';

const databaseProvider = {
  provide: 'KNEX_CONNECTION',
  useFactory: async (configService: ConfigService) => {
    return knex({
      client: 'postgresql',
      connection: {
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        user: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
      },
      pool: { min: 2, max: 10 },
    });
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