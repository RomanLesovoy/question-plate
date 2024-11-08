import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ExternalApiService } from './question-api.service';
import { QuestionApiController } from './question-api.controller';
import { AnswerQuestionsRepository } from './answer-questions.repository';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [QuestionApiController],
  providers: [ExternalApiService, AnswerQuestionsRepository, UsersService],
  exports: [ExternalApiService],
})
export class QuestionApiModule {}
