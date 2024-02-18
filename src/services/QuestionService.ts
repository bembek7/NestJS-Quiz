import { BadRequestException, Injectable } from '@nestjs/common';
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
    const questions = await this.questionsRepository.findBy({ quizId });
    if (questions.length === 0) {
      throw new BadRequestException(
        'Could not find a questions of quiz with that id.',
      );
    }
    return questions;
  }

  async getQuestionsByQuizName(quizName: string) {
    const questions = await this.questionsRepository.find({
      relations: ['quiz'],
      where: {
        quiz: {
          name: quizName,
        },
      },
    });
    if (questions.length === 0) {
      throw new BadRequestException(
        'Could not find a questions of quiz with that name.',
      );
    }
    return questions;
  }

  async getScore(quizId: string, answers: [string]) {
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

      // input validation
      switch (question.questionType) {
        // empty string is always allowed since user may just not answer the question
        // not restricted to a, b, c, d characters since question may use other type of enumeration
        case QuestionType.SingleAnswer: {
          if (answer.length > 1) {
            throw new BadRequestException(
              "Answer for a single correct answer type of question should be 1 character long f.e. 'a' ",
            );
          }
          break;
        }
        case QuestionType.MultipleAnswer: {
          if (answer.length > 4) {
            throw new BadRequestException(
              "Answer for a multiple correct answer type of question should be 1-4 characters long f.e. 'abc' ",
            );
          }
          break;
        }
        case QuestionType.Sort: {
          if (answer.length !== 4 && answer.length !== 0) {
            throw new BadRequestException(
              "Answer for a single correct answer type of question should be 4 characters long f.e. 'dcba' ",
            );
          }
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
