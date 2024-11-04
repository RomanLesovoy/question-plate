import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Question, QuestionApiParams, QuestionDto, QuestionsResponse, Category } from './types';
import { hashQuestion } from './crypto';

@Injectable()
export class ExternalApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly baseUrl = this.configService.get<string>('externalApi.baseUrl');

  async getQuestions(params: QuestionApiParams): Promise<QuestionDto[]> {
    try {
      const response: { data: QuestionsResponse } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/api.php`, {
          params,
        })
      );
      return response.data.results.map(q => ({
        category: q.category,
        type: q.type,
        difficulty: q.difficulty,
        question: q.question,
        correct_answer_hash: hashQuestion(q.correct_answer)
      }));
    } catch (error) {
      throw new HttpException(
        'Get questions API error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Probably not needed
  // async getCategoryAmount(categoryId: string): Promise<CategoryAmount> {
  //   try {
  //     const response: { data: CategoryAmount } = await firstValueFrom(
  //       this.httpService.get(`${this.baseUrl}/api_count.php`, {
  //         params: { category: categoryId },
  //       })
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new HttpException(
  //       'Get categories API error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async getCategories(): Promise<Category[]> {
    try {
      const response: { data: { trivia_categories: Category[] } } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/api_category.php`, {})
      );
      return response.data.trivia_categories;
    } catch (error) {
      throw new HttpException(
        'Get categories API error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}