import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { AnsweredQuestion, AnsweredQuestionResponse } from './types';
import { compareAnswer, decryptAnswer, hashAnswer } from './crypto';

@Injectable()
export class AnswerQuestionsRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  async saveAnsweredQuestion(data: AnsweredQuestion): Promise<AnsweredQuestionResponse> {
    const hashedAnswer = hashAnswer(String(data.answer).toLowerCase());
    const is_correct = compareAnswer(String(data.answer).toLowerCase(), data.correct_answer_hash.toLowerCase());

    // todo: check if answered before (if needed)
    const answered_before = false; // await this.findAnsweredQuestion(data.userId, data.category_id, data.question);

    await this.knex('answered_questions').insert({
      answer: hashedAnswer,
      user_id: data.userId,
      is_correct,
      category_id: data.category_id,
      question: data.question,
      correct_answer_hash: data.correct_answer_hash,
    });

    return {
      is_correct,
      answered_before: !!answered_before,
      correct_answer: decryptAnswer(data.correct_answer_hash)
    };
  }

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
