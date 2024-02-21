import { QuestionService, Score } from '../src/services/QuestionService';
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

  it('a', async () => {
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

    const responses: QuestionResponse[] = [
      {
        questionId: '1',
        answers: ['Paris'],
      },
      {
        questionId: '2',
        answers: ['TypeScript'],
      },
      {
        questionId: '3',
        answers: ['blah blah'],
      },
    ];

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    expect(service.getScore('mockQuizId', responses)).rejects.toThrow(
      BadRequestException,
    );

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);
    const expectedErrorMessage =
      'List of responses should have the same length as list of questions does.';

    await expect(
      service.getScore('mockQuizId', responses),
    ).rejects.toHaveProperty('message', expectedErrorMessage);
  });

  it('b', async () => {
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
    ];

    const responses: QuestionResponse[] = [
      {
        questionId: '2888',
        answers: ['TypeScript'],
      },
    ];

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    expect(service.getScore('mockQuizId', responses)).rejects.toThrow(
      BadRequestException,
    );

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    const expectedErrorMessage =
      'Could not find question with that id. Response nr 1';

    await expect(
      service.getScore('mockQuizId', responses),
    ).rejects.toHaveProperty('message', expectedErrorMessage);
  });

  it('c', async () => {
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
    ];

    const responses: QuestionResponse[] = [
      {
        questionId: '1',
        answers: ['Paris', 'Rome'],
      },
    ];

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    expect(service.getScore('mockQuizId', responses)).rejects.toThrow(
      BadRequestException,
    );

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);
    const expectedErrorMessage =
      'Array of answers for a single correct answer type of question should have the size of 1. Response nr 1';

    await expect(
      service.getScore('mockQuizId', responses),
    ).rejects.toHaveProperty('message', expectedErrorMessage);
  });

  it('d', async () => {
    const mockQuestions: Question[] = [
      {
        id: '2',
        body: 'What is a number?',
        answers: ['1', '2', '3', 'asdsa'],
        questionType: QuestionType.MultipleAnswer,
        rightAnswers: ['1', '2', '3'],
        quizId: '1',
        quiz: null,
      },
    ];

    const responses: QuestionResponse[] = [
      {
        questionId: '2',
        answers: ['e', 'a', 'c', 'd', 'e'],
      },
    ];

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    expect(service.getScore('mockQuizId', responses)).rejects.toThrow(
      BadRequestException,
    );

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);
    const expectedErrorMessage =
      'Array of answers for a multiple correct answer type of question should have the size of 1-(number of possible answers). Response nr 1';

    await expect(
      service.getScore('mockQuizId', responses),
    ).rejects.toHaveProperty('message', expectedErrorMessage);
  });

  it('e', async () => {
    const mockQuestions: Question[] = [
      {
        id: '2',
        body: 'What is a number?',
        answers: ['1', '2', '3'],
        questionType: QuestionType.Sort,
        rightAnswers: ['1', '2', '3'],
        quizId: '1',
        quiz: null,
      },
    ];

    const responses: QuestionResponse[] = [
      {
        questionId: '2',
        answers: ['e', 'a', 'c', 'd', 'e'],
      },
    ];

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    expect(service.getScore('mockQuizId', responses)).rejects.toThrow(
      BadRequestException,
    );

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);
    const expectedErrorMessage =
      'Array of answers for a sort answers type of question should have the size of (number of possible answers). Response nr 1';

    await expect(
      service.getScore('mockQuizId', responses),
    ).rejects.toHaveProperty('message', expectedErrorMessage);
  });

  it('f', async () => {
    const mockQuestions: Question[] = [
      {
        id: '2',
        body: 'What is a number?',
        answers: ['1', '2', '3'],
        questionType: QuestionType.TextAnswer,
        rightAnswers: ['1'],
        quizId: '1',
        quiz: null,
      },
    ];

    const responses: QuestionResponse[] = [
      {
        questionId: '2',
        answers: ['e', 'a', 'c', 'd', 'e'],
      },
    ];

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    expect(service.getScore('mockQuizId', responses)).rejects.toThrow(
      BadRequestException,
    );

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);
    const expectedErrorMessage =
      'Array of answers for a text answer type of question should have the size of 1. Response nr 1';

    await expect(
      service.getScore('mockQuizId', responses),
    ).rejects.toHaveProperty('message', expectedErrorMessage);
  });

  it('g', async () => {
    const mockQuestions: Question[] = [
      {
        id: '1',
        body: 'What is a number?',
        answers: ['1', '2', '3'],
        questionType: QuestionType.TextAnswer,
        rightAnswers: ['1'],
        quizId: '1',
        quiz: null,
      },
      {
        id: '2',
        body: 'What is the capital of France?',
        answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        questionType: QuestionType.SingleAnswer,
        rightAnswers: ['Paris'],
        quizId: '1',
        quiz: null,
      },
    ];

    let responses: QuestionResponse[] = [
      {
        questionId: '1',
        answers: ['1'],
      },
      {
        questionId: '2',
        answers: ['Paris'],
      },
    ];

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    let score = await service.getScore('QuizId', responses);
    expect(score.pointsMax).toEqual(2);
    expect(score.pointsObtained).toEqual(2);
    responses = [
      {
        questionId: '1',
        answers: [''],
      },
      {
        questionId: '2',
        answers: ['Paris'],
      },
    ];

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    score = await service.getScore('QuizId', responses);
    expect(score.pointsMax).toEqual(2);
    expect(score.pointsObtained).toEqual(1);

    responses = [
      {
        questionId: '1',
        answers: ['2'],
      },
      {
        questionId: '2',
        answers: ['Rome'],
      },
    ];

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    score = await service.getScore('QuizId', responses);
    expect(score.pointsMax).toEqual(2);
    expect(score.pointsObtained).toEqual(0);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('h', async () => {
    const mockQuestions: Question[] = [
      {
        id: '1',
        body: 'What is a number?',
        answers: ['1', '2', '3'],
        questionType: QuestionType.TextAnswer,
        rightAnswers: ['1'],
        quizId: '1',
        quiz: null,
      },
      {
        id: '2',
        body: 'What is the capital of France?',
        answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        questionType: QuestionType.MultipleAnswer,
        rightAnswers: ['Paris', 'Madrid', 'Rome'],
        quizId: '1',
        quiz: null,
      },
      {
        id: '3',
        body: 'What is the capital of France?',
        answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        questionType: QuestionType.SingleAnswer,
        rightAnswers: ['Paris'],
        quizId: '1',
        quiz: null,
      },
      {
        id: '4',
        body: 'What is the capital of France?',
        answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        questionType: QuestionType.Sort,
        rightAnswers: ['Berlin', 'Paris', 'Madrid', 'Rome'],
        quizId: '1',
        quiz: null,
      },
    ];

    let responses: QuestionResponse[] = [
      {
        questionId: '2',
        answers: ['Paris', 'Madrid', 'Rome'],
      },
      {
        questionId: '1',
        answers: ['1'],
      },
      {
        questionId: '4',
        answers: ['Berlin', 'Paris', 'Madrid', 'Rome'],
      },
      {
        questionId: '3',
        answers: ['Paris'],
      },
    ];

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    let score = await service.getScore('QuizId', responses);
    expect(score.pointsMax).toEqual(4);
    expect(score.pointsObtained).toEqual(4);
    responses = [
      {
        questionId: '2',
        answers: ['Paris', '', 'Rome'],
      },
      {
        questionId: '1',
        answers: [' '],
      },
      {
        questionId: '4',
        answers: ['Berlin', 'Paris', 'Madrid', 'Rome'],
      },
      {
        questionId: '3',
        answers: ['Paris'],
      },
    ];

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    score = await service.getScore('QuizId', responses);
    expect(score.pointsMax).toEqual(4);
    expect(score.pointsObtained).toEqual(2);

    responses = [
      {
        questionId: '2',
        answers: ['Paris', 'Madrid', 'Rome'],
      },
      {
        questionId: '1',
        answers: ['1'],
      },
      {
        questionId: '4',
        answers: ['Paris', 'Berlin', 'Madrid', 'Rome'],
      },
      {
        questionId: '3',
        answers: ['Paris'],
      },
    ];

    jest
      .spyOn(questionRepository, 'findBy')
      .mockResolvedValueOnce(mockQuestions);

    score = await service.getScore('QuizId', responses);
    expect(score.pointsMax).toEqual(4);
    expect(score.pointsObtained).toEqual(3);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
