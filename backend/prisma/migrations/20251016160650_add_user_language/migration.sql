-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'RU', 'KZ');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'EN',
ALTER COLUMN "password" DROP DEFAULT;
