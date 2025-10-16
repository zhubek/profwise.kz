import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsInt, IsEnum } from 'class-validator';
import { Language } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  schoolId?: string;

  @IsString()
  @IsOptional()
  grade?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsEnum(Language)
  @IsOptional()
  language?: Language;
}
