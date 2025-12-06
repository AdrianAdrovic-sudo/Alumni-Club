/*
  Warnings:

  - You are about to alter the column `cv_url` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `work_location` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[name]` on the table `venues` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "cv_url" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "work_location" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "venues_name_key" ON "venues"("name");
