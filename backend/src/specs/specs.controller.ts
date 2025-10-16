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
import { SpecsService } from './specs.service';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';

@Controller('specs')
export class SpecsController {
  constructor(private readonly specsService: SpecsService) {}

  @Post()
  create(@Body() createSpecDto: CreateSpecDto) {
    return this.specsService.create(createSpecDto);
  }

  @Get()
  findAll() {
    return this.specsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecDto: UpdateSpecDto) {
    return this.specsService.update(id, updateSpecDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.specsService.remove(id);
  }
}
