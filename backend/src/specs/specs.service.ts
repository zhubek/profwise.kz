import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';

@Injectable()
export class SpecsService {
  constructor(private prisma: PrismaService) {}

  async create(createSpecDto: CreateSpecDto) {
    try {
      return await this.prisma.spec.create({
        data: createSpecDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Spec with code ${createSpecDto.code} already exists`,
        );
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.spec.findMany({
      include: {
        _count: {
          select: {
            specUniversities: true,
            professionSpecs: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const spec = await this.prisma.spec.findUnique({
      where: { id },
      include: {
        specUniversities: {
          include: {
            university: {
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
        professionSpecs: {
          include: {
            profession: {
              select: {
                id: true,
                name: true,
                code: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!spec) {
      throw new NotFoundException(`Spec with ID ${id} not found`);
    }

    return spec;
  }

  async update(id: string, updateSpecDto: UpdateSpecDto) {
    try {
      return await this.prisma.spec.update({
        where: { id },
        data: updateSpecDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Spec with code ${updateSpecDto.code} already exists`,
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Spec with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.spec.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Spec with ID ${id} not found`);
    }
  }
}
