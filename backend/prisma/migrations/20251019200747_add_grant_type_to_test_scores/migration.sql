-- CreateEnum
CREATE TYPE "GrantType" AS ENUM ('GENERAL', 'AUL');

-- AlterTable
ALTER TABLE "test_scores" ADD COLUMN     "grantType" "GrantType" NOT NULL DEFAULT 'GENERAL';

-- CreateIndex
CREATE UNIQUE INDEX "test_scores_specUniversityId_year_grantType_typeId_key" ON "test_scores"("specUniversityId", "year", "grantType", "typeId");
