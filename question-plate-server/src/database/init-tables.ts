import { Knex } from 'knex';
import { up as createAnsweredQuestionsTable } from './migrations/20240301000002_create_answered_questions';
import { up as createUsersTable } from './migrations/20240301000001_create_users';

export async function initTables(knex: Knex) {
  // Check if tables exist
  const hasUsers = await knex.schema.hasTable('users');
  const hasAnsweredQuestions = await knex.schema.hasTable('answered_questions');

  // Create users table if not exists
  if (!hasUsers) {
    await createUsersTable(knex);
    console.log('Users table created');
  }

  // Create answered_questions table if not exists
  if (!hasAnsweredQuestions) {
    await createAnsweredQuestionsTable(knex);
    console.log('Answered questions table created');
  }
}
