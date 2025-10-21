import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateArchetypeDto } from './dto/create-archetype.dto';
import { UpdateArchetypeDto } from './dto/update-archetype.dto';
import { CacheInvalidationService } from '../redis/cache-invalidation.service';

@Injectable()
export class ArchetypesService {
  constructor(
    private prisma: PrismaService,
    private cacheInvalidation: CacheInvalidationService,
  ) {}

  async create(createArchetypeDto: CreateArchetypeDto) {
    const archetype = await this.prisma.archetype.create({
      data: createArchetypeDto,
      include: {
        archetypeType: true,
      },
    });
    // Invalidate all archetype caches
    await this.cacheInvalidation.invalidateArchetypes();
    return archetype;
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
      const archetype = await this.prisma.archetype.update({
        where: { id },
        data: updateArchetypeDto,
        include: {
          archetypeType: true,
        },
      });
      // Invalidate this archetype and all archetype lists
      await this.cacheInvalidation.invalidateArchetypes(id);
      return archetype;
    } catch (error) {
      throw new NotFoundException(`Archetype with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.archetype.delete({
        where: { id },
      });
      // Invalidate this archetype and all archetype lists
      await this.cacheInvalidation.invalidateArchetypes(id);
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
