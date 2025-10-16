import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

@Injectable()
export class UniversitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createUniversityDto: CreateUniversityDto) {
    try {
      return await this.prisma.university.create({
        data: createUniversityDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `University with code ${createUniversityDto.code} already exists`,
        );
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.university.findMany({
      include: {
        _count: {
          select: { specUniversities: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: {
        specUniversities: {
          include: {
            spec: {
              select: {
                id: true,
                name: true,
                code: true,
                description: true,
              },
            },
            testScores: {
              include: {
                type: true,
              },
              orderBy: {
                year: 'desc',
              },
            },
          },
        },
      },
    });

    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }

    return university;
  }

  async update(id: string, updateUniversityDto: UpdateUniversityDto) {
    try {
      return await this.prisma.university.update({
        where: { id },
        data: updateUniversityDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `University with code ${updateUniversityDto.code} already exists`,
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`University with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.university.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
  }
}
