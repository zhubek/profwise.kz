import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminAuthGuard } from './guards/admin-auth.guard';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  async login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminAuthService.login(adminLoginDto);
  }

  @UseGuards(AdminAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    const organization = await this.adminAuthService.validateAdminToken(
      req.user.orgId,
    );
    return {
      id: organization.id,
      name: organization.name,
      type: organization.type,
      region: organization.region,
    };
  }

  @UseGuards(AdminAuthGuard)
  @Get('licenses')
  async getLicenses(@Req() req) {
    return this.adminAuthService.getOrganizationLicenses(req.user.orgId);
  }
}
