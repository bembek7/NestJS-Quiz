import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
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

  @Column({ nullable: true })
  @Field({ nullable: true })
  aAnswer: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  bAnswer: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  cAnswer: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  dAnswer: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  textAnswer: string;

  @Column()
  @Field(type => QuestionType)
  questionType: QuestionType;

  @Column()
  @Field()
  rightAnswer: string;

  @Column()
  @Field(type => ID)
  quizId: string;

  @ManyToOne(type => Quiz, quiz => quiz.questions)
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;
}
