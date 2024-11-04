import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ExternalApiService } from './question-api.service';
import { QuestionApiController } from './question-api.controller';

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
  providers: [ExternalApiService],
  exports: [ExternalApiService],
})
export class QuestionApiModule {}
