import { Knex } from 'knex';

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('answered_questions');
}

export async function up(knex: Knex): Promise<void> {
  await down(knex);

  return knex.schema.createTable('answered_questions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.integer('category_id').notNullable();
    table.text('question').notNullable();
    table.text('answer').notNullable();
    table.text('correct_answer_hash').notNullable();
    table.boolean('is_correct').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.index(['user_id', 'category_id']);
  });
}
