import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateOnlyQuizInput {
  @Field()
  name: string;
}
