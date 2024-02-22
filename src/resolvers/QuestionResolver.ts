import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuestionResponse } from 'src/input types/QuestionResponseType';
import { Question } from 'src/models/Question';
import { QuestionService, Score } from 'src/services/QuestionService';

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

  @Query(returns => Score)
  getScore(
    @Args('quizId', { type: () => ID }) quizId: string,
    @Args('responses', { type: () => [QuestionResponse] })
    responses: [QuestionResponse],
  ) {
    return this.questionService.getScore(quizId, responses);
  }
}
