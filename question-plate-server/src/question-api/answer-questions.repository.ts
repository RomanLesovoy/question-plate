import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { AnsweredQuestion } from './types';
import { compareQuestion, decryptQuestion, hashQuestion } from './crypto';

@Injectable()
export class AnswerQuestionsRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  async saveAnsweredQuestion(data: AnsweredQuestion) {
    const hashedQuestion = hashQuestion(data.question);
    const is_correct = compareQuestion(data.question, data.correct_answer_hash);

    const answered_before = await this.findAnsweredQuestion(data.user_id, data.category_id, data.question);

    await this.knex('answered_questions').insert({
      ...data,
      question: hashedQuestion,
      is_correct,
    });

    return { is_correct, answered_before, correct_answer: decryptQuestion(data.correct_answer_hash) };
  }

  // Probably not needed
  // async getAnsweredQuestions(userId: number, categoryId: string): Promise<AnsweredQuestionDto[]> {
  //   const answered: AnsweredQuestionDto[] = await this.knex('answered_questions')
  //     .where({
  //       user_id: userId,
  //       category_id: categoryId,
  //     })
  //     .select();
    
  //   return answered;
  // }

  async findAnsweredQuestion(userId: number, categoryId: number, question: string): Promise<AnsweredQuestion | null> {
    const answered: AnsweredQuestion = await this.knex('answered_questions')
      .where({
        user_id: userId,
        category_id: categoryId,
        question,
      })
      .first();

    return answered || null;
  }
}
