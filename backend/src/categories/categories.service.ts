import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CacheInvalidationService } from '../redis/cache-invalidation.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private cacheInvalidation: CacheInvalidationService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });
    // Invalidate all category caches
    await this.cacheInvalidation.invalidateCategories();
    return category;
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { professions: true },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        professions: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
            featured: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
      // Invalidate this category and all category lists
      await this.cacheInvalidation.invalidateCategories(id);
      return category;
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
      // Invalidate this category and all category lists
      await this.cacheInvalidation.invalidateCategories(id);
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
