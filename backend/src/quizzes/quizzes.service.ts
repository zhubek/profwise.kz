import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    return this.prisma.quiz.create({
      data: createQuizDto,
    });
  }

  async findAll() {
    return this.prisma.quiz.findMany({
      include: {
        questions: true,
        _count: {
          select: { questions: true, results: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
        results: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    try {
      return await this.prisma.quiz.update({
        where: { id },
        data: updateQuizDto,
      });
    } catch (error) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.quiz.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
  }
}
