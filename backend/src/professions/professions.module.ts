import { Module } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { ProfessionsController } from './professions.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProfessionsController],
  providers: [ProfessionsService],
  exports: [ProfessionsService],
})
export class ProfessionsModule {}
