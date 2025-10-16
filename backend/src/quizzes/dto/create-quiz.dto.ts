import { IsBoolean, IsEnum, IsObject, IsOptional, IsDateString } from 'class-validator';

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

  @IsOptional()
  @IsObject()
  parameters?: any;

  @IsOptional()
  @IsObject()
  instructionsContent?: any;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
