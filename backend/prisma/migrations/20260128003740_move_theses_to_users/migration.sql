/*
  Warnings:

  - You are about to drop the `theses` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "defense_date" DATE,
ADD COLUMN     "mentor_first_name" VARCHAR(100),
ADD COLUMN     "mentor_last_name" VARCHAR(100),
ADD COLUMN     "thesis_document_url" VARCHAR(255),
ADD COLUMN     "thesis_title" VARCHAR(255),
ADD COLUMN     "thesis_type" VARCHAR(50);

-- DropTable
DROP TABLE "theses";
