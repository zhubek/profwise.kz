-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "login" TEXT,
ADD COLUMN     "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "organizations_login_key" ON "organizations"("login");
