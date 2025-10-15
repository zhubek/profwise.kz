import { Module } from '@nestjs/common';
import { ArchetypesService } from './archetypes.service';
import { ArchetypesController } from './archetypes.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ArchetypesController],
  providers: [ArchetypesService],
  exports: [ArchetypesService],
})
export class ArchetypesModule {}
