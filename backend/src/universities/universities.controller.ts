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
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { CacheInterceptor } from '../redis/cache.interceptor';
import { CacheResponse } from '../redis/cache.decorator';

@Controller('universities')
@UseInterceptors(CacheInterceptor)
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Post()
  create(@Body() createUniversityDto: CreateUniversityDto) {
    return this.universitiesService.create(createUniversityDto);
  }

  @Get()
  @CacheResponse(3600) // Cache for 1 hour
  findAll() {
    return this.universitiesService.findAll();
  }

  @Get(':id')
  @CacheResponse(3600) // Cache for 1 hour
  findOne(@Param('id') id: string) {
    return this.universitiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUniversityDto: UpdateUniversityDto,
  ) {
    return this.universitiesService.update(id, updateUniversityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.universitiesService.remove(id);
  }

  // Separate endpoint for moreInfo field
  @Get(':id/more-info')
  @CacheResponse(86400) // Cache for 24 hours
  getMoreInfo(@Param('id') id: string) {
    return this.universitiesService.getMoreInfo(id);
  }
}
