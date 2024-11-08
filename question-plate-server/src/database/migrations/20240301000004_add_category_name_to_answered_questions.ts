import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('answered_questions', (table) => {
    table.string('category_name').notNullable().defaultTo('-');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('answered_questions', (table) => {
    table.dropColumn('category_name');
  });
}