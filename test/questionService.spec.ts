import { QuestionService } from '../src/services/QuestionService';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, QuestionType } from '../src/models/Question';
import { BadRequestException } from '@nestjs/common';
import { QuestionResponse } from 'src/input types/QuestionResponseType';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: Repository<Question>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getRepositoryToken(Question),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    questionRepository = module.get<Repository<Question>>(
      getRepositoryToken(Question),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getQuestionsByQuizId should return the questions array', async () => {
    const mockQuestions: Question[] = [
      {
        id: '1',
        body: 'What is the capital of France?',
        answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        questionType: QuestionType.SingleAnswer,
        rightAnswers: ['Paris'],
        quizId: '1',
        quiz: null,
      },
      {
        id: '2',
        body: 'Which programming language is used for NestJS?',
        answers: ['Java', 'Python', 'TypeScript', 'C#'],
        questionType: QuestionType.SingleAnswer,
        rightAnswers: ['TypeScript'],
        quizId: '1',
        quiz: null,
      },
    ];
    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    const result = await service.getQuestionsByQuizId('mockQuizId');

    expect(result).toEqual(mockQuestions);
  });

  it('getQuestionsByQuizId should throw the error', async () => {
    jest.spyOn(questionRepository, 'findBy').mockResolvedValueOnce([]);

    expect(service.getQuestionsByQuizId('mockQuizId')).rejects.toThrow(
      BadRequestException,
    );

    jest.spyOn(questionRepository, 'findBy').mockResolvedValueOnce([]);
    const expectedErrorMessage = `Could not find a questions of quiz with that id.`;

    await expect(
      service.getQuestionsByQuizId('mockQuizId'),
    ).rejects.toHaveProperty('message', expectedErrorMessage);
  });

  it('getQuestionsByQuizName should return the questions array', async () => {
    const mockQuestions: Question[] = [
      {
        id: '1',
        body: 'What is the capital of France?',
        answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        questionType: QuestionType.SingleAnswer,
        rightAnswers: ['Paris'],
        quizId: '1',
        quiz: null,
      },
      {
        id: '2',
        body: 'Which programming language is used for NestJS?',
        answers: ['Java', 'Python', 'TypeScript', 'C#'],
        questionType: QuestionType.SingleAnswer,
        rightAnswers: ['TypeScript'],
        quizId: '1',
        quiz: null,
      },
    ];
    jest.spyOn(questionRepository, 'find').mockResolvedValueOnce(mockQuestions);

    const result = await service.getQuestionsByQuizName('mockQuizId');

    expect(result).toEqual(mockQuestions);
  });

  it('getQuestionsByQuizName should throw the error', async () => {
    jest.spyOn(questionRepository, 'find').mockResolvedValueOnce([]);

    expect(service.getQuestionsByQuizName('mockQuizId')).rejects.toThrow(
      BadRequestException,
    );

    jest.spyOn(questionRepository, 'find').mockResolvedValueOnce([]);
    const expectedErrorMessage = `Could not find a questions of quiz with that name.`;

    await expect(
      service.getQuestionsByQuizName('mockQuizId'),
    ).rejects.toHaveProperty('message', expectedErrorMessage);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
