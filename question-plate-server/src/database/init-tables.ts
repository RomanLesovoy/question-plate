import { Knex } from 'knex';
import { up as createAnsweredQuestionsTable } from './migrations/20240301000002_create_answered_questions';
import { up as createUsersTable } from './migrations/20240301000001_create_users';
import { up as addPointsToUsers } from './migrations/20240301000003_add_points_to_users';
import { up as addCategoryNameToAnsweredQuestions } from './migrations/20240301000004_add_category_name_to_answered_questions';
export async function initTables(knex: Knex) {
  // Check if tables exist
  const hasUsers = await knex.schema.hasTable('users');
  const hasAnsweredQuestions = await knex.schema.hasTable('answered_questions');
  const hasPoints = await knex.schema.hasColumn('users', 'points');
  const hasCategoryName = await knex.schema.hasColumn('answered_questions', 'category_name');

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

  // Add points to users table if not exists
  if (!hasPoints) {
    await addPointsToUsers(knex);
    console.log('Points added to users table');
  }

  // Add category name to answered questions table if not exists
  if (!hasCategoryName) {
    await addCategoryNameToAnsweredQuestions(knex);
    console.log('Category name added to answered questions table');
  }
}
