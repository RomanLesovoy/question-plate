import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('answered_questions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.integer('category_id').notNullable();
    table.text('question').notNullable();
    table.text('correct_answer_hash').notNullable();
    table.boolean('is_correct').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign key to users table
    table.foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // Индексы для оптимизации запросов
    table.index(['user_id', 'category_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('answered_questions');
}
