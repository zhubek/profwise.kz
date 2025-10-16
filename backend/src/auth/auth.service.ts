import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, ...userData } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // If email is already verified, don't allow registration
      if (existingUser.emailVerified) {
        throw new ConflictException(
          'This email is already registered and verified. Please login instead.',
        );
      }

      // If email verification is enabled and account is not verified
      if (this.emailService.isVerificationEnabled()) {
        // Check if verification token has expired
        const now = new Date();
        const isExpired =
          existingUser.emailVerificationExpires &&
          existingUser.emailVerificationExpires < now;

        // If token expired or this is a new registration attempt,
        // delete the old unverified account to allow re-registration
        if (isExpired || !existingUser.emailVerificationExpires) {
          await this.prisma.user.delete({
            where: { id: existingUser.id },
          });
          // Continue with new registration below
        } else {
          // Token still valid, inform user to check email
          throw new ConflictException(
            'A verification email was already sent to this address. Please check your inbox or wait for the verification link to expire before requesting a new one.',
          );
        }
      } else {
        // Email verification disabled, don't allow duplicate
        throw new ConflictException('User with this email already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token if email verification is enabled
    let verificationToken: string | null = null;
    let verificationExpires: Date | null = null;

    if (this.emailService.isVerificationEnabled()) {
      verificationToken = this.emailService.generateVerificationToken();
      verificationExpires = this.emailService.getVerificationExpiry();
    }

    // Create user
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        email,
        password: hashedPassword,
        emailVerified: !this.emailService.isVerificationEnabled(),
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        schoolId: true,
        grade: true,
        age: true,
        language: true,
        emailVerified: true,
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Send verification email if enabled
    if (
      this.emailService.isVerificationEnabled() &&
      verificationToken
    ) {
      try {
        await this.emailService.sendVerificationEmail(
          email,
          user.name,
          verificationToken,
          user.language,
        );
      } catch (error) {
        // Log error but don't fail registration
        console.error('Failed to send verification email:', error);
      }
    }

    // Generate JWT token
    const payload: JwtPayload = { userId: user.id, language: user.language };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
      message: this.emailService.isVerificationEnabled()
        ? 'Registration successful. Please check your email to verify your account.'
        : 'Registration successful.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check email verification if enabled
    if (
      this.emailService.isVerificationEnabled() &&
      !user.emailVerified
    ) {
      throw new UnauthorizedException(
        'Please verify your email before logging in. Check your inbox for the verification link.',
      );
    }

    // Generate JWT token
    const payload: JwtPayload = { userId: user.id, language: user.language };
    const accessToken = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        schoolId: true,
        grade: true,
        age: true,
        language: true,
        emailVerified: true,
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async verifyEmail(token: string) {
    // Find user with this token
    const user = await this.prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    // Check if token has expired
    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < new Date()
    ) {
      throw new BadRequestException(
        'Verification token has expired. Please request a new one.',
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Update user as verified
    const verifiedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        schoolId: true,
        grade: true,
        age: true,
        language: true,
        emailVerified: true,
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(
        verifiedUser.email,
        verifiedUser.name,
        verifiedUser.language,
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    return {
      message: 'Email verified successfully',
      user: verifiedUser,
    };
  }
}
