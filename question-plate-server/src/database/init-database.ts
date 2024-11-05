import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';

export async function initDatabase(configService: ConfigService) {
  const client = new Client({
    host: configService.get('database.host'),
    port: configService.get('database.port'),
    user: configService.get('database.username'),
    password: configService.get('database.password'),
    database: 'postgres',
  });

  try {
    await client.connect();
    
    const dbName = configService.get('database.database');
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created`);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await client.end();
  }
}
