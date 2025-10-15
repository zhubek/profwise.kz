import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  age?: number;
}
