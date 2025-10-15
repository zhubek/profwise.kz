import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ArchetypesService } from './archetypes.service';
import { CreateArchetypeDto } from './dto/create-archetype.dto';
import { UpdateArchetypeDto } from './dto/update-archetype.dto';

@Controller('archetypes')
export class ArchetypesController {
  constructor(private readonly archetypesService: ArchetypesService) {}

  @Post()
  create(@Body() createArchetypeDto: CreateArchetypeDto) {
    return this.archetypesService.create(createArchetypeDto);
  }

  @Get()
  findAll() {
    return this.archetypesService.findAll();
  }

  @Get(':id')
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
