import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from 'src/models/Quiz';
import { QuizResolver } from 'src/resolvers/QuizResolver';
import { QuizService } from 'src/services/QuizService';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz])],
  providers: [QuizResolver, QuizService],
})
export class QuizesModule {}
