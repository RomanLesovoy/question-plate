import { Knex } from 'knex';

export async function down(knex: Knex): Promise<void> {
  const hasAnsweredQuestions = await knex.schema.hasTable('answered_questions');

  if (hasAnsweredQuestions) {
    await knex.schema.alterTable('answered_questions', (table) => {
      table.dropForeign(['user_id']);
    });
  }

  return knex.schema.dropTableIfExists('users');
} 

export async function up(knex: Knex): Promise<void> {
  await down(knex);

  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('last_login').nullable();
  });
}
