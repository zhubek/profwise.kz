/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add password column with a default temporary hashed password
-- The hash is for "ChangeMe123!" - existing users will need to reset their password
ALTER TABLE "users" ADD COLUMN "password" TEXT NOT NULL DEFAULT '$2b$10$K8yJ5qZxGY4YJvF5xZ.8NeC2eQ6JZQZ8XJz7/1V9J3ZQX8/8J9J9e';
