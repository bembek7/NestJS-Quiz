import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Quiz } from './Quiz';

export enum QuestionType {
  SingleAnswer,
  MultipleAnswer,
  Sort,
  TextAnswer,
}

@Entity({ name: 'questions' })
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: string;

  @Column()
  @Field()
  body: string;

  @Column({ nullable: true, type: 'text', array: true })
  @Field(type => [String], { nullable: true })
  answers: string[];

  @Column()
  @Field(type => QuestionType)
  questionType: QuestionType;

  @Column({ type: 'text', array: true })
  @Field(type => [String])
  rightAnswers: string[];

  @Column()
  @Field(type => ID)
  quizId: string;

  @ManyToOne(type => Quiz, quiz => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;
}
