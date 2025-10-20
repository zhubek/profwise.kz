import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { ProfilesModule } from './profiles/profiles.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ProfessionsModule } from './professions/professions.module';
import { ArchetypesModule } from './archetypes/archetypes.module';
import { AuthModule } from './auth/auth.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { ResultsModule } from './results/results.module';
import { QuestionsModule } from './questions/questions.module';
import { CategoriesModule } from './categories/categories.module';
import { UniversitiesModule } from './universities/universities.module';
import { SpecsModule } from './specs/specs.module';
import { LicensesModule } from './licenses/licenses.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminAuthModule,
    ProfilesModule,
    QuizzesModule,
    QuestionsModule,
    CategoriesModule,
    UniversitiesModule,
    SpecsModule,
    LicensesModule,
    ProfessionsModule,
    ArchetypesModule,
    ResultsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
