import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, QuestionType } from 'src/models/Question';
import { Field, Int, ObjectType } from '@nestjs/graphql';

function stringToAnswer(input: string): string {
  input = input.replace(/[^\w']+/g, '');

  input = input.toLowerCase();

  return input;
}
@ObjectType()
export class Score {
  @Field(type => Int)
  pointsObtained: number;

  @Field(type => Int)
  pointsMax: number;
}

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

  async getScore(quizId: string, answers: [string]) {
    console.log(quizId);
    console.log(answers);
    let score = 0;
    const questions = await this.getQuestionsByQuizId(quizId);
    for (
      let index = 0;
      index < questions.length && index < answers.length;
      index++
    ) {
      const question = questions[index];
      const answer = stringToAnswer(answers[index]);
      const rightAnswer = stringToAnswer(question.rightAnswer);
      switch (
        question.questionType // for input validation
      ) {
        case QuestionType.SingleAnswer: {
          break;
        }
        case QuestionType.MultipleAnswer: {
          break;
        }
        case QuestionType.Sort: {
          break;
        }
        case QuestionType.TextAnswer: {
          break;
        }
      }
      if (answer === rightAnswer) {
        score++;
      }
    }

    const scoreMax = questions.length;

    const result: Score = {
      pointsObtained: score,
      pointsMax: scoreMax,
    };

    return result;
  }

  async deleteAllQuestions() {
    return this.questionsRepository.clear();
  }
}
