import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from 'src/models/Quiz';
import { Question } from 'src/models/Question';
import { CreateQuizInput } from 'src/input types/CreateQuizType';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizesRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async getQuizes() {
    return this.quizesRepository.find();
  }

  async createQuiz(createQuizData: CreateQuizInput) {
    const { quiz, questions } = createQuizData;
    const newQuiz = this.quizesRepository.create(quiz);
    const savedQuiz = await this.quizesRepository.save(newQuiz);

    for (const question of questions) {
      const newQuestion = {
        ...question,
        quizId: savedQuiz.id,
      };
      await this.questionsRepository.save(newQuestion);
    }

    return savedQuiz;
  }
}
