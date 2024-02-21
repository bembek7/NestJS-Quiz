import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, QuestionType } from '../models/Question';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { QuestionResponse } from '../input types/QuestionResponseType';

export function stringToAnswer(input: string): string {
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
    if (!questions || questions.length === 0) {
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

  async getScore(quizId: string, responses: QuestionResponse[]) {
    let score = 0;
    const questions = await this.getQuestionsByQuizId(quizId);

    if (questions.length !== responses.length) {
      throw new BadRequestException(
        'List of responses should have the same length as list of questions does.',
      );
    }
    let responseCounter = 0;
    for (const response of responses) {
      responseCounter++;
      const question = questions.find(
        (question) => question.id == response.questionId,
      );
      if (!question) {
        throw new BadRequestException(
          `Could not find question with that id. Response nr ${responseCounter}`,
        );
      }

      let noScore = false;

      // input validation
      switch (question.questionType) {
        // empty string is always allowed since user may just not answer the question
        // not restricted to a, b, c, d characters since question may use other type of enumeration
        case QuestionType.SingleAnswer: {
          if (response.answers.length > 1) {
            throw new BadRequestException(
              `Array of answers for a single correct answer type of question should have the size of 1. Response nr ${responseCounter}`,
            );
          }
          if (
            stringToAnswer(response.answers[0]) !==
            stringToAnswer(question.rightAnswers[0])
          ) {
            noScore = true;
            break;
          }
          break;
        }
        case QuestionType.MultipleAnswer: {
          if (
            response.answers.length > question.answers.length ||
            response.answers.length < 1
          ) {
            throw new BadRequestException(
              `Array of answers for a multiple correct answer type of question should have the size of 1-(number of possible answers). Response nr ${responseCounter}`,
            );
          }
          if (response.answers.length !== question.rightAnswers.length) {
            noScore = true;
            break;
          }
          for (const answer of response.answers) {
            if (
              !question.rightAnswers.find(
                (rightAnswer) =>
                  stringToAnswer(rightAnswer) === stringToAnswer(answer),
              )
            ) {
              noScore = true;
              break;
            }
          }
          break;
        }
        case QuestionType.Sort: {
          if (
            response.answers.length !== question.answers.length &&
            response.answers.length !== 0
          ) {
            throw new BadRequestException(
              `Array of answers for a sort answers type of question should have the size of (number of possible answers). Response nr ${responseCounter}`,
            );
          }
          for (let index = 0; index < response.answers.length; index++) {
            const answer = response.answers[index];
            const rightAnswer = question.rightAnswers[index];
            if (stringToAnswer(answer) !== stringToAnswer(rightAnswer)) {
              noScore = true;
              break;
            }
          }
          break;
        }
        case QuestionType.TextAnswer: {
          if (response.answers.length > 1) {
            throw new BadRequestException(
              `Array of answers for a text answer type of question should have the size of 1. Response nr ${responseCounter}`,
            );
          }
          if (
            stringToAnswer(response.answers[0]) !==
            stringToAnswer(question.rightAnswers[0])
          ) {
            noScore = true;
            break;
          }
          break;
        }
      }

      if (!noScore) score++;
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
