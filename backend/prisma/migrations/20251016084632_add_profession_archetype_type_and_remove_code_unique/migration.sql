-- DropIndex
DROP INDEX "public"."professions_code_key";

-- CreateTable
CREATE TABLE "profession_archetype_types" (
    "id" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,
    "archetypeTypeId" TEXT NOT NULL,
    "description" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profession_archetype_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profession_archetype_types_professionId_archetypeTypeId_key" ON "profession_archetype_types"("professionId", "archetypeTypeId");

-- AddForeignKey
ALTER TABLE "profession_archetype_types" ADD CONSTRAINT "profession_archetype_types_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "professions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profession_archetype_types" ADD CONSTRAINT "profession_archetype_types_archetypeTypeId_fkey" FOREIGN KEY ("archetypeTypeId") REFERENCES "archetype_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
