import { Module } from '@nestjs/common';
import { SpecsService } from './specs.service';
import { SpecsController } from './specs.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SpecsController],
  providers: [SpecsService],
  exports: [SpecsService],
})
export class SpecsModule {}
