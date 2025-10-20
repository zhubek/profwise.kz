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
  Query,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { UpsertSurveyQuestionsDto } from './dto/upsert-user-question.dto';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.create(createResultDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string, @Query('quizId') quizId?: string) {
    if (userId) {
      return this.resultsService.findByUser(userId);
    }
    if (quizId) {
      return this.resultsService.findByQuiz(quizId);
    }
    return this.resultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultsService.update(id, updateResultDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.resultsService.remove(id);
  }

  @Post('survey-questions')
  @HttpCode(HttpStatus.OK)
  upsertSurveyQuestions(@Body() dto: UpsertSurveyQuestionsDto) {
    return this.resultsService.upsertSurveyQuestions(dto);
  }
}
