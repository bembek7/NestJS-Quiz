import { Query, Resolver } from '@nestjs/graphql';
import { Question } from 'src/models/Question';
import { QuestionService } from 'src/services/QuestionService';

@Resolver((of) => Question)
export class QuestionResolver {
  constructor(private questionService: QuestionService) {}

  @Query(returns => [Question])
  getQuestions() {
    return this.questionService.getQuestions();
  }
}
