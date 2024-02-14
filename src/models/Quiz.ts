import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Question } from './Question';

@Entity({ name: 'quizes' })
@ObjectType()
export class Quiz {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @OneToMany(type => Question, question => question.quiz)
  questions: Question[];
}
