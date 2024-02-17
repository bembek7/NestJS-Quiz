import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Question } from 'src/models/Question';
import { QuestionService } from 'src/services/QuestionService';

@Resolver((of) => Question)
export class QuestionResolver {
  constructor(private questionService: QuestionService) {}

  @Query(returns => [Question])
  getQuestions() {
    return this.questionService.getQuestions();
  }

  @Query(returns => [Question])
  getQuestionsByQuizId(@Args('quizId', { type: () => ID }) quizId: string) {
    return this.questionService.getQuestionsByQuizId(quizId);
  }

  @Query(returns => [Question])
  getQuestionsByQuizName(
    @Args('quizName', { type: () => String }) quizName: string,
  ) {
    return this.questionService.getQuestionsByQuizName(quizName);
  }

  @Mutation(returns => [Question], { nullable: true })
  deleteAllQuestions() {
    return this.questionService.deleteAllQuestions();
  }
}
