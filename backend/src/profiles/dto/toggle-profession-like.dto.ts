import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class ToggleProfessionLikeDto {
  @IsUUID()
  @IsNotEmpty()
  professionId: string;

  @IsBoolean()
  @IsNotEmpty()
  isLiked: boolean;
}
