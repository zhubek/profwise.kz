import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';

@Injectable()
export class ProfessionsService {
  constructor(private prisma: PrismaService) {}

  async create(createProfessionDto: CreateProfessionDto) {
    return this.prisma.profession.create({
      data: createProfessionDto,
      include: {
        category: true,
      },
    });
  }

  async findAll() {
    return this.prisma.profession.findMany({
      include: {
        category: true,
        professionSpecs: {
          include: {
            spec: true,
          },
        },
        professionArchetypes: {
          include: {
            archetype: true,
          },
        },
        _count: {
          select: { userProfessions: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const profession = await this.prisma.profession.findUnique({
      where: { id },
      include: {
        category: true,
        professionSpecs: {
          include: {
            spec: {
              include: {
                specUniversities: {
                  include: {
                    university: true,
                    testScores: {
                      include: {
                        type: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        professionArchetypes: {
          include: {
            archetype: true,
          },
        },
      },
    });

    if (!profession) {
      throw new NotFoundException(`Profession with ID ${id} not found`);
    }

    return profession;
  }

  async update(id: string, updateProfessionDto: UpdateProfessionDto) {
    try {
      return await this.prisma.profession.update({
        where: { id },
        data: updateProfessionDto,
        include: {
          category: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Profession with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.profession.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Profession with ID ${id} not found`);
    }
  }

  // Methods for retrieving specific JSON fields
  async getGeneral(id: string) {
    const profession = await this.prisma.profession.findUnique({
      where: { id },
      select: {
        id: true,
        general: true,
      },
    });

    if (!profession) {
      throw new NotFoundException(`Profession with ID ${id} not found`);
    }

    return {
      professionId: profession.id,
      general: profession.general,
    };
  }

  async getDescription(id: string) {
    const profession = await this.prisma.profession.findUnique({
      where: { id },
      select: {
        id: true,
        description: true,
      },
    });

    if (!profession) {
      throw new NotFoundException(`Profession with ID ${id} not found`);
    }

    return {
      professionId: profession.id,
      description: profession.description,
    };
  }

  async getArchetypes(id: string) {
    const profession = await this.prisma.profession.findUnique({
      where: { id },
      select: {
        id: true,
        archetypes: true,
      },
    });

    if (!profession) {
      throw new NotFoundException(`Profession with ID ${id} not found`);
    }

    return {
      professionId: profession.id,
      archetypes: profession.archetypes,
    };
  }

  async getEducation(id: string) {
    const profession = await this.prisma.profession.findUnique({
      where: { id },
      select: {
        id: true,
        education: true,
      },
    });

    if (!profession) {
      throw new NotFoundException(`Profession with ID ${id} not found`);
    }

    return {
      professionId: profession.id,
      education: profession.education,
    };
  }

  async getMarketResearch(id: string) {
    const profession = await this.prisma.profession.findUnique({
      where: { id },
      select: {
        id: true,
        marketResearch: true,
      },
    });

    if (!profession) {
      throw new NotFoundException(`Profession with ID ${id} not found`);
    }

    return {
      professionId: profession.id,
      marketResearch: profession.marketResearch,
    };
  }

  async getDescriptionData(id: string) {
    const profession = await this.prisma.profession.findUnique({
      where: { id },
      select: {
        id: true,
        descriptionData: true,
      },
    });

    if (!profession) {
      throw new NotFoundException(`Profession with ID ${id} not found`);
    }

    return {
      professionId: profession.id,
      descriptionData: profession.descriptionData,
    };
  }
}
