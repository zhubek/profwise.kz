import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto) {
    // Verify quiz exists
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: createQuestionDto.quizId },
    });

    if (!quiz) {
      throw new NotFoundException(
        `Quiz with ID ${createQuestionDto.quizId} not found`,
      );
    }

    return this.prisma.question.create({
      data: createQuestionDto,
      include: {
        quiz: {
          select: {
            id: true,
            quizName: true,
            quizType: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.question.findMany({
      include: {
        quiz: {
          select: {
            id: true,
            quizName: true,
            quizType: true,
          },
        },
        _count: {
          select: { userQuestions: true },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        quiz: {
          select: {
            id: true,
            quizName: true,
            quizType: true,
          },
        },
        userQuestions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
              },
            },
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async findByQuiz(quizId: string) {
    // Verify quiz exists
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    return this.prisma.question.findMany({
      where: { quizId },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    try {
      return await this.prisma.question.update({
        where: { id },
        data: updateQuestionDto,
        include: {
          quiz: {
            select: {
              id: true,
              quizName: true,
              quizType: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.question.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
  }
}
