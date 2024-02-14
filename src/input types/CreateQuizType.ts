import { InputType, Field } from '@nestjs/graphql';
import { CreateQuestionInput } from './CreateQuestionType';
import { CreateOnlyQuizInput } from './CreateOnlyQuizType';

@InputType()
export class CreateQuizInput {
  @Field(type => CreateOnlyQuizInput)
  quiz: CreateOnlyQuizInput;

  @Field(type => [CreateQuestionInput])
  questions: CreateQuestionInput[];
}
