import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Question } from './Question';

@Entity({ name: 'quizzes' })
@ObjectType()
export class Quiz {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  name: string;

  @OneToMany(type => Question, question => question.quiz, { cascade: true })
  questions: Question[];
}
