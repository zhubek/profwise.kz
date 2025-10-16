import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { ActivateLicenseDto } from './dto/activate-license.dto';

@Injectable()
export class LicensesService {
  constructor(private prisma: PrismaService) {}

  async create(createLicenseDto: CreateLicenseDto) {
    try {
      return await this.prisma.license.create({
        data: {
          ...createLicenseDto,
          startDate: new Date(createLicenseDto.startDate),
          expireDate: new Date(createLicenseDto.expireDate),
        },
        include: {
          licenseClass: true,
          organization: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `License with code ${createLicenseDto.licenseCode} already exists`,
        );
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.license.findMany({
      include: {
        licenseClass: true,
        organization: {
          include: {
            region: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
        _count: {
          select: { userLicenses: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const license = await this.prisma.license.findUnique({
      where: { id },
      include: {
        licenseClass: {
          include: {
            licenseClassQuizzes: {
              include: {
                quiz: true,
              },
            },
          },
        },
        organization: {
          include: {
            region: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
        userLicenses: {
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
        },
      },
    });

    if (!license) {
      throw new NotFoundException(`License with ID ${id} not found`);
    }

    return license;
  }

  async validateLicenseCode(licenseCode: string) {
    const license = await this.prisma.license.findUnique({
      where: { licenseCode },
      include: {
        licenseClass: true,
        organization: true,
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
      },
    });

    if (!license) {
      throw new NotFoundException(`License with code ${licenseCode} not found`);
    }

    const now = new Date();
    const isExpired = license.expireDate < now;
    const isActive = license.startDate <= now && license.expireDate >= now;

    return {
      valid: isActive && !license.activated,
      license: {
        id: license.id,
        name: license.name,
        licenseCode: license.licenseCode,
        startDate: license.startDate,
        expireDate: license.expireDate,
        activated: license.activated,
        activatedAt: license.activatedAt,
        userId: license.userId,
        user: license.user,
        isExpired,
        isActive,
        licenseClass: license.licenseClass,
        organization: license.organization,
      },
    };
  }

  async activateLicense(activateLicenseDto: ActivateLicenseDto) {
    // Find the license first
    const license = await this.prisma.license.findUnique({
      where: { licenseCode: activateLicenseDto.licenseCode },
      include: {
        licenseClass: true,
        organization: true,
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
      },
    });

    if (!license) {
      throw new NotFoundException(`License with code ${activateLicenseDto.licenseCode} not found`);
    }

    // Check if license is already activated FIRST (before date validation)
    if (license.activated || license.userId) {
      throw new ConflictException('This license has already been activated by another user');
    }

    // Then check if license dates are valid
    const now = new Date();
    const isExpired = license.expireDate < now;
    const isActive = license.startDate <= now && license.expireDate >= now;

    if (!isActive) {
      if (isExpired) {
        throw new BadRequestException('License has expired');
      } else {
        throw new BadRequestException('License is not yet active');
      }
    }

    // Activate the license for this user
    const activatedLicense = await this.prisma.license.update({
      where: { id: license.id },
      data: {
        userId: activateLicenseDto.userId,
        activated: true,
        activatedAt: new Date(),
      },
      include: {
        licenseClass: {
          include: {
            licenseClassQuizzes: {
              include: {
                quiz: true,
              },
            },
          },
        },
        organization: true,
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
      },
    });

    return {
      message: 'License activated successfully',
      license: activatedLicense,
      availableQuizzes: activatedLicense.licenseClass.licenseClassQuizzes.map(
        (lcq) => lcq.quiz,
      ),
    };
  }

  async getUserLicenses(userId: string) {
    const licenses = await this.prisma.license.findMany({
      where: {
        userId,
        activated: true,
      },
      include: {
        licenseClass: {
          include: {
            licenseClassQuizzes: {
              include: {
                quiz: true,
              },
            },
          },
        },
        organization: true,
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
        activatedAt: 'desc',
      },
    });

    return licenses.map((license) => {
      const now = new Date();
      const isExpired = license.expireDate < now;
      const isActive = license.startDate <= now && license.expireDate >= now;

      return {
        id: license.id,
        userId: license.userId,
        licenseId: license.id,
        createdAt: license.activatedAt || license.createdAt,
        license: {
          ...license,
          isExpired,
          isActive,
        },
        availableQuizzes: license.licenseClass.licenseClassQuizzes.map(
          (lcq) => lcq.quiz,
        ),
      };
    });
  }

  async getLicenseQuizzes(licenseId: string) {
    const license = await this.prisma.license.findUnique({
      where: { id: licenseId },
      include: {
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

    if (!license) {
      throw new NotFoundException(`License with ID ${licenseId} not found`);
    }

    return {
      licenseId: license.id,
      licenseName: license.name,
      licenseClass: license.licenseClass.name,
      quizzes: license.licenseClass.licenseClassQuizzes.map((lcq) => lcq.quiz),
    };
  }

  async update(id: string, updateLicenseDto: UpdateLicenseDto) {
    try {
      const data: any = { ...updateLicenseDto };
      if (updateLicenseDto.startDate) {
        data.startDate = new Date(updateLicenseDto.startDate);
      }
      if (updateLicenseDto.expireDate) {
        data.expireDate = new Date(updateLicenseDto.expireDate);
      }

      return await this.prisma.license.update({
        where: { id },
        data,
        include: {
          licenseClass: true,
          organization: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `License with code ${updateLicenseDto.licenseCode} already exists`,
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`License with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.license.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`License with ID ${id} not found`);
    }
  }
}
