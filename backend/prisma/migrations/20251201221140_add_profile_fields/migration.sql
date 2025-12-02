-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cv_url" VARCHAR(255),
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "work_location" VARCHAR(255);
