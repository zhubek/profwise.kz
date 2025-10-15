import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateProfessionDto {
  @IsObject()
  name: any;

  @IsOptional()
  @IsObject()
  description?: any;

  @IsString()
  code: string;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
