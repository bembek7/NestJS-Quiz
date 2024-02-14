import { Module } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question, QuestionType } from 'src/models/Question';
import { QuestionResolver } from 'src/resolvers/QuestionResolver';
import { QuestionService } from 'src/services/QuestionService';

registerEnumType(QuestionType, {
  name: 'QuestionType',
});

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionResolver, QuestionService],
})
export class QuestionsModule {}
