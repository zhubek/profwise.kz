import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    const data: any = { ...createQuizDto };
    if (createQuizDto.startDate) {
      data.startDate = new Date(createQuizDto.startDate);
    }
    return this.prisma.quiz.create({
      data,
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
      const data: any = { ...updateQuizDto };
      if (updateQuizDto.startDate) {
        data.startDate = new Date(updateQuizDto.startDate);
      }
      return await this.prisma.quiz.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
  }

  async getUserQuizzes(userId: string) {
    // Get all public quizzes (active and inactive)
    const publicQuizzes = await this.prisma.quiz.findMany({
      where: {
        isPublic: true,
      },
      include: {
        _count: {
          select: { questions: true, results: true },
        },
      },
    });

    // Get all active licenses for the user
    const userLicenses = await this.prisma.license.findMany({
      where: {
        userId,
        activated: true,
      },
      include: {
        organization: true,
        licenseClass: {
          include: {
            licenseClassQuizzes: {
              include: {
                quiz: {
                  include: {
                    _count: {
                      select: { questions: true, results: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Extract quizzes from licenses with license information
    const licenseQuizzes: any[] = [];
    userLicenses.forEach((license) => {
      license.licenseClass.licenseClassQuizzes.forEach((lcq) => {
        if (lcq.quiz.isActive) {
          licenseQuizzes.push({
            ...lcq.quiz,
            licenseInfo: {
              licenseCode: license.licenseCode,
              expireDate: license.expireDate,
              organizationName: license.organization.name,
              activationDate: license.activatedAt,
            },
          });
        }
      });
    });

    // Create a map to track quizzes by quizType
    // License quizzes will override public ones if they have the same quizType
    const quizMap = new Map();

    // First add public quizzes
    publicQuizzes.forEach((quiz) => {
      quizMap.set(`${quiz.quizType}`, { ...quiz, source: 'public' });
    });

    // Then override with license quizzes if they have the same quizType
    licenseQuizzes.forEach((quiz) => {
      quizMap.set(`${quiz.quizType}`, { ...quiz, source: 'license' });
    });

    // Convert to array for sorting
    const allQuizzes = Array.from(quizMap.values());

    // Sort quizzes:
    // 1. License-based first (sorted by activationDate DESC - latest first)
    // 2. Then public active quizzes
    // 3. Then inactive quizzes (sorted by startDate ASC)
    allQuizzes.sort((a, b) => {
      // License quizzes come first
      if (a.source === 'license' && b.source !== 'license') return -1;
      if (a.source !== 'license' && b.source === 'license') return 1;

      // Both are license quizzes - sort by activationDate DESC (latest first)
      if (a.source === 'license' && b.source === 'license') {
        const dateA = new Date(a.licenseInfo.activationDate).getTime();
        const dateB = new Date(b.licenseInfo.activationDate).getTime();
        return dateB - dateA; // DESC order
      }

      // Both are public quizzes - active ones first
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;

      // Both are inactive - sort by startDate ASC
      if (!a.isActive && !b.isActive) {
        // Handle null startDates - put them last
        if (!a.startDate && b.startDate) return 1;
        if (a.startDate && !b.startDate) return -1;
        if (!a.startDate && !b.startDate) return 0;

        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB; // ASC order
      }

      return 0;
    });

    return allQuizzes;
  }

  async getInstructions(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      select: {
        id: true,
        instructionsContent: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return {
      quizId: quiz.id,
      instructionsContent: quiz.instructionsContent,
    };
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
