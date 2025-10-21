import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { CacheInterceptor } from '../redis/cache.interceptor';
import { CacheResponse } from '../redis/cache.decorator';

@Controller('professions')
@UseInterceptors(CacheInterceptor)
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Post()
  create(@Body() createProfessionDto: CreateProfessionDto) {
    return this.professionsService.create(createProfessionDto);
  }

  @Get()
  @CacheResponse(3600) // Cache for 1 hour
  findAll() {
    return this.professionsService.findAll();
  }

  @Get(':id')
  @CacheResponse(3600) // Cache for 1 hour
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
  @CacheResponse(86400) // Cache for 24 hours
  getGeneral(@Param('id') id: string) {
    return this.professionsService.getGeneral(id);
  }

  @Get(':id/description')
  @CacheResponse(86400) // Cache for 24 hours
  getDescription(@Param('id') id: string) {
    return this.professionsService.getDescription(id);
  }

  @Get(':id/archetypes')
  @CacheResponse(86400) // Cache for 24 hours
  getArchetypes(@Param('id') id: string) {
    return this.professionsService.getArchetypes(id);
  }

  @Get(':id/education')
  @CacheResponse(86400) // Cache for 24 hours
  getEducation(@Param('id') id: string) {
    return this.professionsService.getEducation(id);
  }

  @Get(':id/market-research')
  @CacheResponse(86400) // Cache for 24 hours
  getMarketResearch(@Param('id') id: string) {
    return this.professionsService.getMarketResearch(id);
  }

  // Get detailed description data for a profession
  @Get(':id/description-data')
  @CacheResponse(86400) // Cache for 24 hours
  getDescriptionData(@Param('id') id: string) {
    return this.professionsService.getDescriptionData(id);
  }
}

