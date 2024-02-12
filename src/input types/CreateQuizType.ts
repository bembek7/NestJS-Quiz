import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateQuizInput {
  @Field()
  name: string;
}
