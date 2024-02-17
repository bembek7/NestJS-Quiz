import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from 'src/models/Quiz';
import { Question } from 'src/models/Question';
import { CreateQuizInput } from 'src/input types/CreateQuizType';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizzesRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async getQuizzes() {
    return this.quizzesRepository.find();
  }

  async createQuiz(createQuizData: CreateQuizInput) {
    const { quiz, questions } = createQuizData;
    const newQuiz = this.quizzesRepository.create(quiz);
    const savedQuiz = await this.quizzesRepository.save(newQuiz);

    for (const question of questions) {
      const newQuestion = {
        ...question,
        quizId: savedQuiz.id,
      };
      await this.questionsRepository.save(newQuestion);
    }

    return savedQuiz;
  }

  async deleteAllQuizzes() {
    const quizzes = await this.quizzesRepository.find();
    for (const quiz of quizzes) {
      await this.quizzesRepository.remove(quiz);
    }
    return quizzes;
  }
}
