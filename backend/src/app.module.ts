import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { ProfilesModule } from './profiles/profiles.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ProfessionsModule } from './professions/professions.module';
import { ArchetypesModule } from './archetypes/archetypes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProfilesModule,
    QuizzesModule,
    ProfessionsModule,
    ArchetypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
