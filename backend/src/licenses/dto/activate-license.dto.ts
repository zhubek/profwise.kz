import { IsString, IsUUID } from 'class-validator';

export class ActivateLicenseDto {
  @IsUUID()
  userId: string;

  @IsString()
  licenseCode: string;
}
