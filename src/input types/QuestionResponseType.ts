import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class QuestionResponse {
  @Field(type => ID)
  questionId: string;

  @Field(type => [String])
  answers: string[];
}
