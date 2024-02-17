import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/models/Question';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async getQuestions() {
    return this.questionsRepository.find();
  }

  async getQuestionsByQuizId(quizId: string) {
    return this.questionsRepository.findBy({ quizId });
  }

  async getQuestionsByQuizName(quizName: string) {
    return this.questionsRepository.find({
      relations: ['quiz'],
      where: {
        quiz: {
          name: quizName,
        },
      },
    });
  }

  async deleteAllQuestions() {
    return this.questionsRepository.clear();
  }
}
