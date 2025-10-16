import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LicensesService } from './licenses.service';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { ActivateLicenseDto } from './dto/activate-license.dto';

@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Post()
  create(@Body() createLicenseDto: CreateLicenseDto) {
    return this.licensesService.create(createLicenseDto);
  }

  @Post('activate')
  activateLicense(@Body() activateLicenseDto: ActivateLicenseDto) {
    return this.licensesService.activateLicense(activateLicenseDto);
  }

  @Get()
  findAll() {
    return this.licensesService.findAll();
  }

  @Get('validate/:code')
  validateLicenseCode(@Param('code') code: string) {
    return this.licensesService.validateLicenseCode(code);
  }

  @Get('user/:userId')
  getUserLicenses(@Param('userId') userId: string) {
    return this.licensesService.getUserLicenses(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licensesService.findOne(id);
  }

  @Get(':id/quizzes')
  getLicenseQuizzes(@Param('id') id: string) {
    return this.licensesService.getLicenseQuizzes(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLicenseDto: UpdateLicenseDto) {
    return this.licensesService.update(id, updateLicenseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.licensesService.remove(id);
  }
}
