import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from 'src/models/Quiz';
import { Question, QuestionType } from 'src/models/Question';
import { CreateQuizInput } from 'src/input types/CreateQuizType';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeletionOutput {
  @Field(type => Int)
  quizzesDeleted: number;

  @Field()
  message: string;
}

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

    // input validation
    let questionNr = 0;
    for (const question of questions) {
      questionNr++;
      switch (question.questionType) {
        case QuestionType.SingleAnswer: {
          if (question.rightAnswers.length != 1) {
            throw new BadRequestException(
              `Answer for a single correct answer type of question must have the size of 1. Question nr ${questionNr}`,
            );
          }
          if (question.answers.length < 2) {
            throw new BadRequestException(
              `You have to provide at least 2 possible answers for single correct answer type of question. Question nr ${questionNr}`,
            );
          }
          break;
        }
        case QuestionType.MultipleAnswer: {
          if (
            question.rightAnswers.length > question.answers.length ||
            question.rightAnswers.length < 1
          ) {
            throw new BadRequestException(
              `Array of answers for a multiple correct answer type of question must have the size of 1-(number of possible answers). Question nr ${questionNr} `,
            );
          }
          if (question.answers.length < 2) {
            throw new BadRequestException(
              `You have to provide at least 2 possible answers for multiple correct answers type of question. Question nr ${questionNr}`,
            );
          }
          break;
        }
        case QuestionType.Sort: {
          if (question.rightAnswers.length !== question.answers.length) {
            throw new BadRequestException(
              `Array of answers for a sort answers type of question should have the size of (number of possible answers). Question nr ${questionNr}`,
            );
          }
          if (question.answers.length < 2) {
            throw new BadRequestException(
              `You have to provide at least 2 possible answers for answers sorting type of question. Question nr ${questionNr}`,
            );
          }
          break;
        }
        case QuestionType.TextAnswer: {
          if (question.answers && question.answers.length > 0) {
            throw new BadRequestException(
              `You cannot provide possible answers for text answer type of question. Question nr ${questionNr}`,
            );
          }
          break;
        }
      }
    }

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
    const quizzesNr = quizzes.length;
    for (const quiz of quizzes) {
      await this.quizzesRepository.remove(quiz);
    }

    const out: DeletionOutput = {
      quizzesDeleted: quizzesNr,
      message: `Successfully deleted ${quizzesNr} quizzes.`,
    };

    return out;
  }
}
