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
  UseInterceptors,
} from '@nestjs/common';
import { SpecsService } from './specs.service';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
import { CacheInterceptor } from '../redis/cache.interceptor';
import { CacheResponse } from '../redis/cache.decorator';

@Controller('specs')
@UseInterceptors(CacheInterceptor)
export class SpecsController {
  constructor(private readonly specsService: SpecsService) {}

  @Post()
  create(@Body() createSpecDto: CreateSpecDto) {
    return this.specsService.create(createSpecDto);
  }

  @Get()
  @CacheResponse(3600) // Cache for 1 hour
  findAll() {
    return this.specsService.findAll();
  }

  @Get(':id')
  @CacheResponse(3600) // Cache for 1 hour
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
