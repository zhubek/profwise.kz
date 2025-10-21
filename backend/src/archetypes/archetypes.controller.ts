import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ArchetypesService } from './archetypes.service';
import { CreateArchetypeDto } from './dto/create-archetype.dto';
import { UpdateArchetypeDto } from './dto/update-archetype.dto';
import { CacheInterceptor } from '../redis/cache.interceptor';
import { CacheResponse } from '../redis/cache.decorator';

@Controller('archetypes')
@UseInterceptors(CacheInterceptor)
export class ArchetypesController {
  constructor(private readonly archetypesService: ArchetypesService) {}

  @Post()
  create(@Body() createArchetypeDto: CreateArchetypeDto) {
    return this.archetypesService.create(createArchetypeDto);
  }

  @Get()
  @CacheResponse(3600) // Cache for 1 hour
  findAll() {
    return this.archetypesService.findAll();
  }

  @Get('types/all')
  @CacheResponse(86400) // Cache for 24 hours
  findAllTypes() {
    return this.archetypesService.findAllTypes();
  }

  @Get(':id')
  @CacheResponse(3600) // Cache for 1 hour
  findOne(@Param('id') id: string) {
    return this.archetypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchetypeDto: UpdateArchetypeDto) {
    return this.archetypesService.update(id, updateArchetypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.archetypesService.remove(id);
  }
}
