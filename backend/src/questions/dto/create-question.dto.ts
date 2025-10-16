import { IsString, IsObject, IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SCALE = 'SCALE',
  LIKERT = 'LIKERT',
  TEXT = 'TEXT',
  OTHER = 'OTHER',
}

export class CreateQuestionDto {
  @IsUUID()
  quizId: string;

  @IsObject()
  questionText: any;

  @IsObject()
  answers: any;

  @IsOptional()
  @IsObject()
  parameters?: any;

  @IsEnum(QuestionType)
  questionType: QuestionType;
}
