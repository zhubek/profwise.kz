import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { UpsertSurveyQuestionsDto } from './dto/upsert-user-question.dto';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  async create(createResultDto: CreateResultDto) {
    return this.prisma.result.create({
      data: createResultDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
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
    return this.prisma.result.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
        quiz: {
          select: {
            id: true,
            quizName: true,
            quizType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const result = await this.prisma.result.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
        quiz: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException(`Result with ID ${id} not found`);
    }

    return result;
  }

  async findByUser(userId: string) {
    return this.prisma.result.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            id: true,
            quizName: true,
            quizType: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByQuiz(quizId: string) {
    return this.prisma.result.findMany({
      where: { quizId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateResultDto: UpdateResultDto) {
    try {
      return await this.prisma.result.update({
        where: { id },
        data: updateResultDto,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true,
            },
          },
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
      throw new NotFoundException(`Result with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.result.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Result with ID ${id} not found`);
    }
  }

  async upsertSurveyQuestions(dto: UpsertSurveyQuestionsDto) {
    const { userId, questions } = dto;

    // Upsert each survey question answer
    const upsertPromises = questions.map((q) =>
      this.prisma.userQuestion.upsert({
        where: {
          userId_questionId: {
            userId,
            questionId: q.questionId,
          },
        },
        create: {
          userId,
          questionId: q.questionId,
          answers: q.answers,
        },
        update: {
          answers: q.answers,
        },
      }),
    );

    return await Promise.all(upsertPromises);
  }
}
