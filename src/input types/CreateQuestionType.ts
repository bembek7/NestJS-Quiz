import { InputType, Field } from '@nestjs/graphql';
import { QuestionType } from 'src/models/Question';

@InputType()
export class CreateQuestionInput {
  @Field()
  body: string;

  @Field({ nullable: true })
  aAnswer: string;

  @Field({ nullable: true })
  bAnswer: string;

  @Field({ nullable: true })
  cAnswer: string;

  @Field({ nullable: true })
  dAnswer: string;

  @Field(type => QuestionType)
  questionType: QuestionType;

  @Field()
  rightAnswer: string;
}
