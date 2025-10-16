import { IsString, IsDateString, IsUUID } from 'class-validator';

export class CreateLicenseDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  expireDate: string;

  @IsString()
  licenseCode: string;

  @IsString()
  name: string;

  @IsUUID()
  licenseClassId: string;

  @IsUUID()
  organizationId: string;
}
