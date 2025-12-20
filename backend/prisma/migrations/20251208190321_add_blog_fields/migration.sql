/*
  Warnings:

  - Added the required column `category` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `short_desc` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ALTER COLUMN "slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "category" VARCHAR(100) NOT NULL,
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "read_time" VARCHAR(50),
ADD COLUMN     "short_desc" VARCHAR(500) NOT NULL,
ADD COLUMN     "title" VARCHAR(255) NOT NULL;
