import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors, Header } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { CalculateResultDto } from './dto/calculate-result.dto';
import { CacheInterceptor } from '../redis/cache.interceptor';
import { CacheResponse } from '../redis/cache.decorator';

@Controller('quizzes')
@UseInterceptors(CacheInterceptor)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  @CacheResponse(3600) // Cache for 1 hour
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get('user/:userId')
  @CacheResponse(1800) // Cache for 30 minutes
  getUserQuizzes(@Param('userId') userId: string) {
    return this.quizzesService.getUserQuizzes(userId);
  }

  @Get(':id')
  @CacheResponse(3600) // Cache for 1 hour
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(id);
  }

  @Get(':id/instructions')
  @CacheResponse(86400) // Cache for 24 hours (Redis)
  @Header('Cache-Control', 's-maxage=86400, stale-while-revalidate') // Cache for 24 hours (Cloudflare)
  getInstructions(@Param('id') id: string) {
    return this.quizzesService.getInstructions(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }

  @Post('calculate-holand')
  calculateHolandResult(@Body() calculateResultDto: CalculateResultDto) {
    return this.quizzesService.calculateHolandResult(calculateResultDto);
  }
}
