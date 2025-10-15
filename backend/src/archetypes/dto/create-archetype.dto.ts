import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateArchetypeDto {
  @IsObject()
  name: any;

  @IsString()
  archetypeTypeId: string;

  @IsOptional()
  @IsObject()
  description?: any;
}
