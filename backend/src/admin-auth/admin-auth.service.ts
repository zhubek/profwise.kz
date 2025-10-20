import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(adminLoginDto: AdminLoginDto) {
    const { login, password } = adminLoginDto;

    // Find organization by login
    const organization = await this.prisma.organization.findUnique({
      where: { login },
      include: {
        region: true,
        licenses: {
          include: {
            licenseClass: true,
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

    // Check if organization exists and has login credentials
    if (!organization || !organization.login || !organization.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare password (basic comparison for simplicity)
    // For better security, you should hash passwords
    const isPasswordValid = organization.password === password;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: organization.id,
      orgId: organization.id,
      orgName: organization.name,
      type: 'admin',
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Return organization data with token
    return {
      organization: {
        id: organization.id,
        name: organization.name,
        type: organization.type,
        region: organization.region,
      },
      accessToken,
    };
  }

  async validateAdminToken(orgId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        region: true,
      },
    });

    if (!organization || !organization.login) {
      throw new UnauthorizedException('Invalid admin token');
    }

    return organization;
  }

  async getOrganizationLicenses(orgId: string) {
    const licenses = await this.prisma.license.findMany({
      where: { organizationId: orgId },
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
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            grade: true,
            age: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return licenses;
  }
}
