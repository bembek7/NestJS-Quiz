import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from 'src/models/Quiz';
import { CreateQuizInput } from 'src/input types/CreateQuizType';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizesRepository: Repository<Quiz>,
  ) {}

  async getQuizes() {
    return this.quizesRepository.find();
  }

  async createQuiz(createQuizData: CreateQuizInput) {
    const newQuiz = this.quizesRepository.create(createQuizData);
    return this.quizesRepository.save(newQuiz);
  }
}
