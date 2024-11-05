import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ExternalApiService } from './question-api.service';
import { QuestionApiController } from './question-api.controller';
import { AnswerQuestionsRepository } from './answer-questions.repository';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [QuestionApiController],
  providers: [ExternalApiService, AnswerQuestionsRepository],
  exports: [ExternalApiService],
})
export class QuestionApiModule {}
