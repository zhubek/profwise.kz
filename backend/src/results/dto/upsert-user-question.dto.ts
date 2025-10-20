import { IsUUID, IsNotEmpty, IsObject } from 'class-validator';

export class UpsertUserQuestionDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsObject()
  @IsNotEmpty()
  answers: any; // JSON data storing the user's answer(s)
}

export class UpsertSurveyQuestionsDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  questions: Array<{
    questionId: string;
    answers: any;
  }>;
}
