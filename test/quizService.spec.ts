import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateOnlyQuizInput } from '../src/input types/CreateOnlyQuizType';
import { CreateQuestionInput } from '../src/input types/CreateQuestionType';
import { CreateQuizInput } from '../src/input types/CreateQuizType';
import { Question, QuestionType } from '../src/models/Question';
import { Quiz } from '../src/models/Quiz';
import { QuizService } from '../src/services/QuizService';
import { Repository } from 'typeorm';

describe('QuizService', () => {
  let service: QuizService;
  let quizRepository: Repository<Quiz>;
  let questionRepository: Repository<Question>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: getRepositoryToken(Quiz),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Question),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<QuizService>(QuizService);
    quizRepository = module.get<Repository<Quiz>>(getRepositoryToken(Quiz));
    questionRepository = module.get<Repository<Question>>(
      getRepositoryToken(Question),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createQuiz should throw exception, single correct answer, too many right answers', () => {
    const onlyQuizData: CreateOnlyQuizInput = {
      name: 'quizName',
    };

    const questionsData: CreateQuestionInput[] = [
      {
        body: 'a',
        answers: ['', '', '', ''],
        questionType: QuestionType.SingleAnswer,
        rightAnswers: ['', '', ''],
      },
    ];

    const quizData: CreateQuizInput = {
      quiz: onlyQuizData,
      questions: questionsData,
    };

    const expectedErrorMessage =
      'Answer for a single correct answer type of question must have the size of 1. Question nr 1';

    expect(service.createQuiz(quizData)).rejects.toThrow(BadRequestException);
    expect(service.createQuiz(quizData)).rejects.toHaveProperty(
      'message',
      expectedErrorMessage,
    );
  });

  it('createQuiz should throw exception, single correct answer, not enough possible answers', () => {
    const onlyQuizData: CreateOnlyQuizInput = {
      name: 'quizName',
    };

    const questionsData: CreateQuestionInput[] = [
      {
        body: 'a',
        answers: [''],
        questionType: QuestionType.SingleAnswer,
        rightAnswers: [''],
      },
    ];

    const quizData: CreateQuizInput = {
      quiz: onlyQuizData,
      questions: questionsData,
    };

    const expectedErrorMessage =
      'You have to provide at least 2 possible answers for single correct answer type of question. Question nr 1';

    expect(service.createQuiz(quizData)).rejects.toThrow(BadRequestException);
    expect(service.createQuiz(quizData)).rejects.toHaveProperty(
      'message',
      expectedErrorMessage,
    );
  });

  it('createQuiz should throw exception, multiple correct answer', () => {
    const onlyQuizData: CreateOnlyQuizInput = {
      name: 'quizName',
    };

    const questionsData: CreateQuestionInput[] = [
      {
        body: 'a',
        answers: ['', '', ''],
        questionType: QuestionType.MultipleAnswer,
        rightAnswers: ['', '', '', ''],
      },
    ];

    const quizData: CreateQuizInput = {
      quiz: onlyQuizData,
      questions: questionsData,
    };

    const expectedErrorMessage =
      'Array of answers for a multiple correct answer type of question must have the size of 1-(number of possible answers). Question nr 1';

    expect(service.createQuiz(quizData)).rejects.toThrow(BadRequestException);
    expect(service.createQuiz(quizData)).rejects.toHaveProperty(
      'message',
      expectedErrorMessage,
    );
  });

  it('createQuiz should throw exception, sort answer', () => {
    const onlyQuizData: CreateOnlyQuizInput = {
      name: 'quizName',
    };

    const questionsData: CreateQuestionInput[] = [
      {
        body: 'a',
        answers: ['', '', '', ''],
        questionType: QuestionType.Sort,
        rightAnswers: ['', '', ''],
      },
    ];

    const quizData: CreateQuizInput = {
      quiz: onlyQuizData,
      questions: questionsData,
    };

    const expectedErrorMessage =
      'Array of answers for a sort answers type of question should have the size of (number of possible answers). Question nr 1';

    expect(service.createQuiz(quizData)).rejects.toThrow(BadRequestException);
    expect(service.createQuiz(quizData)).rejects.toHaveProperty(
      'message',
      expectedErrorMessage,
    );
  });

  it('createQuiz should throw exception, text answer', () => {
    const onlyQuizData: CreateOnlyQuizInput = {
      name: 'quizName',
    };

    const questionsData: CreateQuestionInput[] = [
      {
        body: 'a',
        answers: ['', '', '', ''],
        questionType: QuestionType.TextAnswer,
        rightAnswers: [''],
      },
    ];

    const quizData: CreateQuizInput = {
      quiz: onlyQuizData,
      questions: questionsData,
    };

    const expectedErrorMessage = `You cannot provide possible answers for text answer type of question. Question nr 1`;

    expect(service.createQuiz(quizData)).rejects.toThrow(BadRequestException);
    expect(service.createQuiz(quizData)).rejects.toHaveProperty(
      'message',
      expectedErrorMessage,
    );
  });
});
