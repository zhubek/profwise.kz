import { IsString, IsObject, IsUUID } from 'class-validator';

export class CreateResultDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  quizId: string;

  @IsObject()
  answers: any;

  @IsObject()
  results: any;
}
