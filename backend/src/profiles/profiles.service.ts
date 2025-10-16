import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        userLicenses: true,
        userArchetypes: true,
        userProfessions: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userLicenses: {
          include: {
            license: true,
          },
        },
        userArchetypes: {
          include: {
            archetype: true,
          },
        },
        userProfessions: {
          include: {
            profession: true,
          },
        },
        results: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async getArchetypeProfile(userId: string) {
    // Fetch user with their archetypes
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userArchetypes: {
          include: {
            archetype: {
              include: {
                archetypeType: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Fetch ALL archetype types (to show empty states for types without data)
    const allArchetypeTypes = await this.prisma.archetypeType.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Initialize grouped data with ALL archetype types (empty arrays)
    const groupedByType: Record<string, any[]> = {};
    allArchetypeTypes.forEach((type) => {
      groupedByType[type.id] = [];
    });

    // Populate with user's actual data
    user.userArchetypes.forEach((userArchetype) => {
      const typeId = userArchetype.archetype.archetypeType.id;

      groupedByType[typeId].push({
        archetypeId: userArchetype.archetypeId,
        archetype: {
          id: userArchetype.archetype.id,
          name: userArchetype.archetype.name,
          category: typeId,
          archetypeType: userArchetype.archetype.archetypeType,
          description: userArchetype.archetype.description,
          icon: null, // Can be added later
          keyTraits: [], // Can be added later
          createdAt: userArchetype.archetype.createdAt.toISOString(),
          updatedAt: userArchetype.archetype.createdAt.toISOString(),
        },
        score: userArchetype.score,
        percentile: null, // Can be calculated later with all users' data
      });
    });

    // Return grouped data with ALL archetype types (including empty ones)
    return {
      userId: user.id,
      groupedArchetypes: groupedByType,
      lastUpdated: new Date().toISOString(),
    };
  }
}
