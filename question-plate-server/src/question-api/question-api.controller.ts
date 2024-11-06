import { 
  Controller, 
  Get, 
  Query, 
  UseGuards,
  HttpStatus,
  ParseIntPipe,
  Body,
  Post
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExternalApiService } from './question-api.service';
import { QuestionApiParams, QuestionDifficulty, QuestionType, Category, QuestionDto, AnsweredQuestionResponse } from './types';
import { AnswerQuestionsRepository } from './answer-questions.repository';
import { User } from 'src/auth/user.decorator';

@ApiTags('Questions API')
@Controller('questions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuestionApiController {
  constructor(
    private readonly externalApiService: ExternalApiService,
    private readonly answerQuestionsRepository: AnswerQuestionsRepository
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get questions from external API' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns questions from external API',
  })
  @ApiQuery({ name: 'amount', required: false, type: Number })
  @ApiQuery({ name: 'category', required: true, type: Number })
  @ApiQuery({ name: 'difficulty', required: false, enum: QuestionDifficulty })
  @ApiQuery({ name: 'type', required: false, enum: QuestionType })
  async getQuestions(
    @Query('category', new ParseIntPipe()) category: number,
    @Query('amount', new ParseIntPipe({ optional: true })) amount?: number,
    @Query('difficulty') difficulty?: QuestionDifficulty,
    @Query('type') type?: QuestionType,
  ): Promise<QuestionDto[]> {
    const params: QuestionApiParams = {
      amount: amount || 10,
      category,
      difficulty,
      type
    };

    const questions = await this.externalApiService.getQuestions(params);

    return questions;
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all available categories' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns list of categories',
  })
  async getCategories(): Promise<Category[]> {
    return this.externalApiService.getCategories();
  }

  // Probably not needed
  // @Get('category-amount')
  // @ApiOperation({ summary: 'Get amount of questions in category' })
  // @ApiResponse({ 
  //   status: HttpStatus.OK, 
  //   description: 'Returns amount of questions in category',
  // })
  // @ApiQuery({ name: 'categoryId', required: true, type: String })
  // async getCategoryAmount(
  //   @Query('categoryId') categoryId: string
  // ): Promise<CategoryAmount> {
  //   return this.externalApiService.getCategoryAmount(categoryId);
  // }

  @Post('answer')
  @ApiOperation({ summary: 'Save user answer' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns result of the answer',
  })
  async saveAnswer(
    @User('userId') userId: number,
    @Body() answerData: {
      categoryId: number;
      question: string;
      correctAnswerHash: string;
      answer: string | boolean;
    }
  ): Promise<AnsweredQuestionResponse> {
    const result = await this.answerQuestionsRepository.saveAnsweredQuestion({
      userId: userId,
      question: answerData.question,
      answer: answerData.answer,
      category_id: answerData.categoryId,
      correct_answer_hash: answerData.correctAnswerHash,
    });

    if (result.is_correct && !result.answered_before) {
      // todo add points to user
    }

    return result;
  }
}
