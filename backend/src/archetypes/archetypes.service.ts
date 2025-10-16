import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateArchetypeDto } from './dto/create-archetype.dto';
import { UpdateArchetypeDto } from './dto/update-archetype.dto';

@Injectable()
export class ArchetypesService {
  constructor(private prisma: PrismaService) {}

  async create(createArchetypeDto: CreateArchetypeDto) {
    return this.prisma.archetype.create({
      data: createArchetypeDto,
      include: {
        archetypeType: true,
      },
    });
  }

  async findAll() {
    return this.prisma.archetype.findMany({
      include: {
        archetypeType: true,
        professionArchetypes: {
          include: {
            profession: true,
          },
        },
        _count: {
          select: { userArchetypes: true, professionArchetypes: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const archetype = await this.prisma.archetype.findUnique({
      where: { id },
      include: {
        archetypeType: true,
        professionArchetypes: {
          include: {
            profession: {
              include: {
                category: true,
              },
            },
          },
        },
        userArchetypes: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!archetype) {
      throw new NotFoundException(`Archetype with ID ${id} not found`);
    }

    return archetype;
  }

  async update(id: string, updateArchetypeDto: UpdateArchetypeDto) {
    try {
      return await this.prisma.archetype.update({
        where: { id },
        data: updateArchetypeDto,
        include: {
          archetypeType: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Archetype with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.archetype.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Archetype with ID ${id} not found`);
    }
  }

  async findAllTypes() {
    return this.prisma.archetypeType.findMany({
      include: {
        _count: {
          select: { archetypes: true },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
