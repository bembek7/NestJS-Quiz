import { InputType, Field } from '@nestjs/graphql';
import { QuestionType } from 'src/models/Question';

@InputType()
export class CreateQuestionInput {
  @Field()
  body: string;

  @Field(type => [String], { nullable: true })
  answers: [string];

  @Field(type => QuestionType)
  questionType: QuestionType;

  @Field(type => [String])
  rightAnswers: [string];
}
