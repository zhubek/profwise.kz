-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('SCHOOL', 'UNIVERSITY', 'COLLEGE', 'OTHER');

-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('PERSONALITY', 'APTITUDE', 'KNOWLEDGE', 'CAREER', 'OTHER');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SCALE', 'TEXT', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "schoolId" TEXT,
    "email" TEXT NOT NULL,
    "grade" TEXT,
    "age" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "licenseCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "licenseClassId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "license_classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "license_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_licenses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "license_class_quizzes" (
    "id" TEXT NOT NULL,
    "licenseClassId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "license_class_quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "quizName" JSONB NOT NULL,
    "quizType" "QuizType" NOT NULL,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "description" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "questionText" JSONB NOT NULL,
    "answers" JSONB NOT NULL,
    "parameters" JSONB,
    "questionType" "QuestionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "results" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_questions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professions" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "code" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "professions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "universities" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "code" TEXT NOT NULL,

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specs" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "code" TEXT NOT NULL,
    "description" JSONB,
    "subjects" JSONB,
    "groupName" JSONB,

    CONSTRAINT "specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spec_universities" (
    "id" TEXT NOT NULL,
    "isEnglish" BOOLEAN NOT NULL DEFAULT false,
    "specId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "spec_universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profession_specs" (
    "id" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,
    "specId" TEXT NOT NULL,

    CONSTRAINT "profession_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_scores" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "specUniversityId" TEXT NOT NULL,
    "minPoints" INTEGER NOT NULL,
    "maxPoints" INTEGER,
    "grantCounts" INTEGER,
    "typeId" TEXT NOT NULL,

    CONSTRAINT "test_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_score_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parameters" JSONB,

    CONSTRAINT "test_score_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archetypes" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "archetypeTypeId" TEXT NOT NULL,
    "description" JSONB,

    CONSTRAINT "archetypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archetype_types" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,

    CONSTRAINT "archetype_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profession_archetypes" (
    "id" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "profession_archetypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_archetypes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "user_archetypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_professions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_professions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profession_archetype_types" (
    "id" TEXT NOT NULL,
    "userProfessionId" TEXT NOT NULL,
    "archetypeTypeId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "user_profession_archetype_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "licenses_licenseCode_key" ON "licenses"("licenseCode");

-- CreateIndex
CREATE UNIQUE INDEX "user_licenses_userId_licenseId_key" ON "user_licenses"("userId", "licenseId");

-- CreateIndex
CREATE UNIQUE INDEX "license_class_quizzes_licenseClassId_quizId_key" ON "license_class_quizzes"("licenseClassId", "quizId");

-- CreateIndex
CREATE UNIQUE INDEX "user_questions_userId_questionId_key" ON "user_questions"("userId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "professions_code_key" ON "professions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "universities_code_key" ON "universities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "specs_code_key" ON "specs"("code");

-- CreateIndex
CREATE UNIQUE INDEX "spec_universities_specId_universityId_isEnglish_key" ON "spec_universities"("specId", "universityId", "isEnglish");

-- CreateIndex
CREATE UNIQUE INDEX "profession_specs_professionId_specId_key" ON "profession_specs"("professionId", "specId");

-- CreateIndex
CREATE UNIQUE INDEX "profession_archetypes_professionId_archetypeId_key" ON "profession_archetypes"("professionId", "archetypeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_archetypes_userId_archetypeId_key" ON "user_archetypes"("userId", "archetypeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_professions_userId_professionId_key" ON "user_professions"("userId", "professionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_profession_archetype_types_userProfessionId_archetypeT_key" ON "user_profession_archetype_types"("userProfessionId", "archetypeTypeId");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_licenseClassId_fkey" FOREIGN KEY ("licenseClassId") REFERENCES "license_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_licenses" ADD CONSTRAINT "user_licenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_licenses" ADD CONSTRAINT "user_licenses_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "license_class_quizzes" ADD CONSTRAINT "license_class_quizzes_licenseClassId_fkey" FOREIGN KEY ("licenseClassId") REFERENCES "license_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "license_class_quizzes" ADD CONSTRAINT "license_class_quizzes_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_questions" ADD CONSTRAINT "user_questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_questions" ADD CONSTRAINT "user_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professions" ADD CONSTRAINT "professions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spec_universities" ADD CONSTRAINT "spec_universities_specId_fkey" FOREIGN KEY ("specId") REFERENCES "specs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spec_universities" ADD CONSTRAINT "spec_universities_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profession_specs" ADD CONSTRAINT "profession_specs_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "professions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profession_specs" ADD CONSTRAINT "profession_specs_specId_fkey" FOREIGN KEY ("specId") REFERENCES "specs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_scores" ADD CONSTRAINT "test_scores_specUniversityId_fkey" FOREIGN KEY ("specUniversityId") REFERENCES "spec_universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_scores" ADD CONSTRAINT "test_scores_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "test_score_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archetypes" ADD CONSTRAINT "archetypes_archetypeTypeId_fkey" FOREIGN KEY ("archetypeTypeId") REFERENCES "archetype_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profession_archetypes" ADD CONSTRAINT "profession_archetypes_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "professions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profession_archetypes" ADD CONSTRAINT "profession_archetypes_archetypeId_fkey" FOREIGN KEY ("archetypeId") REFERENCES "archetypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_archetypes" ADD CONSTRAINT "user_archetypes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_archetypes" ADD CONSTRAINT "user_archetypes_archetypeId_fkey" FOREIGN KEY ("archetypeId") REFERENCES "archetypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_professions" ADD CONSTRAINT "user_professions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_professions" ADD CONSTRAINT "user_professions_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "professions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profession_archetype_types" ADD CONSTRAINT "user_profession_archetype_types_userProfessionId_fkey" FOREIGN KEY ("userProfessionId") REFERENCES "user_professions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profession_archetype_types" ADD CONSTRAINT "user_profession_archetype_types_archetypeTypeId_fkey" FOREIGN KEY ("archetypeTypeId") REFERENCES "archetype_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
