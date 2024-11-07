import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { QuestionApiParams, QuestionDto, QuestionsResponse } from './types';
import { hashAnswer } from './crypto';
import { decode } from 'html-entities';
import { QuestionType, Category } from './types';

@Injectable()
export class ExternalApiService {
  private lastRequestTime: number = 0;
  private readonly REQUEST_DELAY = 10000;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly baseUrl = this.configService.get<string>('externalApi.baseUrl');

  private async waitForNextRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.REQUEST_DELAY) {
      const waitTime = this.REQUEST_DELAY - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  async getQuestions(params: QuestionApiParams): Promise<QuestionDto[]> {
    try {
      await this.waitForNextRequest();

      const response: { data: QuestionsResponse } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/api.php`, {
          params,
        })
      );

      return this.prepareQuestions(response.data);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Get questions API error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private decodeQuestion(question: string): string {
    try {
      return decode(question);
    } catch (e) {
      return question;
    }
  }

  private prepareQuestions(questionsData: QuestionsResponse): QuestionDto[] {
    try {
      return questionsData.results.map(q => ({
        category: q.category,
        type: q.type,
        difficulty: q.difficulty,
        question: this.decodeQuestion(q.question),
        answers: q.type === QuestionType.MULTIPLE
          ? [
            this.decodeQuestion(q.correct_answer),
            ...q.incorrect_answers.map(a => this.decodeQuestion(a))
          ].sort(() => Math.random() - 0.5)
          : null,
        correct_answer_hash: hashAnswer(this.decodeQuestion(q.correct_answer).toLowerCase())
      }));
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Prepare questions error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
