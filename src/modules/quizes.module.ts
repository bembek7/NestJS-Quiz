import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/models/Question';
import { Quiz } from 'src/models/Quiz';
import { QuizResolver } from 'src/resolvers/QuizResolver';
import { QuizService } from 'src/services/QuizService';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Question])],
  providers: [QuizResolver, QuizService],
})
export class QuizesModule {}
