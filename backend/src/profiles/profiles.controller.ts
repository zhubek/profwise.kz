import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.profilesService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }

  @Get(':id/archetype-profile')
  getArchetypeProfile(@Param('id') id: string) {
    return this.profilesService.getArchetypeProfile(id);
  }

  @Get(':id/professions')
  getUserProfessions(@Param('id') id: string) {
    return this.profilesService.getUserProfessions(id);
  }
}
