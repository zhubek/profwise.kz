import { IsBoolean, IsEnum, IsObject, IsOptional } from 'class-validator';

export enum QuizType {
  PERSONALITY = 'PERSONALITY',
  APTITUDE = 'APTITUDE',
  KNOWLEDGE = 'KNOWLEDGE',
  CAREER = 'CAREER',
  OTHER = 'OTHER',
}

export class CreateQuizDto {
  @IsObject()
  quizName: any;

  @IsEnum(QuizType)
  quizType: QuizType;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsObject()
  description?: any;
}
