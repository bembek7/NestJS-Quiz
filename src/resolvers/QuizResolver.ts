import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { QuizService } from 'src/services/QuizService';
import { Quiz } from 'src/models/Quiz';
import { CreateQuizInput } from 'src/input types/CreateQuizType';

@Resolver((of) => Quiz)
export class QuizResolver {
  constructor(private quizService: QuizService) {}

  @Query(returns => [Quiz])
  getQuizzes() {
    return this.quizService.getQuizzes();
  }

  @Mutation(returns => Quiz)
  createQuiz(@Args('createQuizData') createQuizData: CreateQuizInput) {
    return this.quizService.createQuiz(createQuizData);
  }

  @Mutation(returns => [Quiz], { nullable: true })
  deleteAllQuizzes() {
    return this.quizService.deleteAllQuizzes();
  }
}
