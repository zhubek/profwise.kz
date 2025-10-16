import { IsObject, IsString, IsOptional } from 'class-validator';

export class CreateUniversityDto {
  @IsObject()
  name: any;

  @IsOptional()
  @IsObject()
  description?: any;

  @IsString()
  code: string;
}
