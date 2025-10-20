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

  async getUserProfessions(userId: string) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Fetch user's professions with full profession details
    const userProfessions = await this.prisma.userProfession.findMany({
      where: { userId },
      include: {
        profession: {
          include: {
            category: true,
          },
        },
        userProfessionArchetypeTypes: {
          include: {
            archetypeType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Sort by most recently added
      },
    });

    // Transform to frontend format
    return userProfessions.map((up) => {
      // Calculate matchScore from archetype scores (average of all scores)
      let matchScore = 0;
      if (up.userProfessionArchetypeTypes.length > 0) {
        const totalScore = up.userProfessionArchetypeTypes.reduce(
          (sum, at) => sum + at.score,
          0,
        );
        matchScore = Math.round(totalScore / up.userProfessionArchetypeTypes.length);
      }

      // Group archetype scores by type for matchBreakdown
      const matchBreakdown: any = {
        interests: 0,
        skills: 0,
        personality: 0,
        values: 0,
      };

      up.userProfessionArchetypeTypes.forEach((at) => {
        const typeId = at.archetypeType.id;
        // Map archetype types to frontend categories
        if (typeId === 'interest' || typeId.includes('interest')) {
          matchBreakdown.interests = at.score;
        } else if (typeId === 'skill' || typeId.includes('skill')) {
          matchBreakdown.skills = at.score;
        } else if (typeId === 'personality' || typeId.includes('personality')) {
          matchBreakdown.personality = at.score;
        } else if (typeId === 'value' || typeId.includes('value')) {
          matchBreakdown.values = at.score;
        }
      });

      return {
        id: up.profession.id,
        title: up.profession.name,
        description: up.profession.description,
        code: up.profession.code,
        category: up.profession.category?.name || { en: 'Other', ru: 'Другое', kk: 'Басқа' },
        matchScore,
        matchBreakdown,
        popular: up.profession.featured || false,
        isLiked: up.isLiked,
        icon: null, // Can be added later
      };
    });
  }

  async toggleProfessionLike(userId: string, professionId: string, isLiked: boolean) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verify profession exists
    const profession = await this.prisma.profession.findUnique({
      where: { id: professionId },
    });

    if (!profession) {
      throw new NotFoundException(`Profession with ID ${professionId} not found`);
    }

    // Check if UserProfession record exists
    const existingUserProfession = await this.prisma.userProfession.findUnique({
      where: {
        userId_professionId: {
          userId,
          professionId,
        },
      },
    });

    if (!existingUserProfession) {
      throw new NotFoundException(
        `User profession relationship not found. User must complete a quiz that matches with this profession first.`,
      );
    }

    // Update isLiked status
    const updatedUserProfession = await this.prisma.userProfession.update({
      where: {
        userId_professionId: {
          userId,
          professionId,
        },
      },
      data: {
        isLiked,
      },
      include: {
        profession: true,
      },
    });

    return {
      id: updatedUserProfession.profession.id,
      title: updatedUserProfession.profession.name,
      isLiked: updatedUserProfession.isLiked,
      message: isLiked ? 'Profession liked successfully' : 'Profession unliked successfully',
    };
  }
}
