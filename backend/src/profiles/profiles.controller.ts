import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ToggleProfessionLikeDto } from './dto/toggle-profession-like.dto';
import { CacheInterceptor } from '../redis/cache.interceptor';
import { CacheResponse } from '../redis/cache.decorator';

@Controller('users')
@UseInterceptors(CacheInterceptor)
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
  @CacheResponse(900) // Cache for 15 minutes
  getArchetypeProfile(@Param('id') id: string) {
    return this.profilesService.getArchetypeProfile(id);
  }

  @Get(':id/professions')
  @CacheResponse(900) // Cache for 15 minutes
  getUserProfessions(@Param('id') id: string) {
    return this.profilesService.getUserProfessions(id);
  }

  @Patch(':id/professions/like')
  toggleProfessionLike(
    @Param('id') userId: string,
    @Body() toggleProfessionLikeDto: ToggleProfessionLikeDto,
  ) {
    return this.profilesService.toggleProfessionLike(
      userId,
      toggleProfessionLikeDto.professionId,
      toggleProfessionLikeDto.isLiked,
    );
  }
}
