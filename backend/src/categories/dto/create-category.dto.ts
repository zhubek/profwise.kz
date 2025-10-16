import { IsObject, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsObject()
  name: any;

  @IsOptional()
  @IsObject()
  description?: any;
}
