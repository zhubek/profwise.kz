import { IsObject, IsString, IsOptional } from 'class-validator';

export class CreateSpecDto {
  @IsObject()
  name: any;

  @IsString()
  code: string;

  @IsOptional()
  @IsObject()
  description?: any;

  @IsOptional()
  @IsObject()
  subjects?: any;

  @IsOptional()
  @IsObject()
  groupName?: any;
}
