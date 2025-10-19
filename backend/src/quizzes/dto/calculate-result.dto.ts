import { IsObject, IsNotEmpty, IsString } from 'class-validator';

export class CalculateResultDto {
  @IsObject()
  @IsNotEmpty()
  answers: Record<string, {
    answer: Record<string, number>;
    parameters: {
      type: string;
      scale: string;
    };
  }>;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  quizId: string;
}
