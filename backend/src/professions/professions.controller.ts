import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';

@Controller('professions')
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Post()
  create(@Body() createProfessionDto: CreateProfessionDto) {
    return this.professionsService.create(createProfessionDto);
  }

  @Get()
  findAll() {
    return this.professionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfessionDto: UpdateProfessionDto) {
    return this.professionsService.update(id, updateProfessionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.professionsService.remove(id);
  }

  // Separate endpoints for JSON fields
  @Get(':id/general')
  getGeneral(@Param('id') id: string) {
    return this.professionsService.getGeneral(id);
  }

  @Get(':id/description')
  getDescription(@Param('id') id: string) {
    return this.professionsService.getDescription(id);
  }

  @Get(':id/archetypes')
  getArchetypes(@Param('id') id: string) {
    return this.professionsService.getArchetypes(id);
  }

  @Get(':id/education')
  getEducation(@Param('id') id: string) {
    return this.professionsService.getEducation(id);
  }

  @Get(':id/market-research')
  getMarketResearch(@Param('id') id: string) {
    return this.professionsService.getMarketResearch(id);
  }

  // Get detailed description data for a profession
  @Get(':id/description-data')
  getDescriptionData(@Param('id') id: string) {
    return this.professionsService.getDescriptionData(id);
  }
}

