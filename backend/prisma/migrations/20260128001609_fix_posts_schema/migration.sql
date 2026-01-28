/*
  Warnings:

  - You are about to drop the column `guest_email` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the column `guest_first_name` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the column `guest_last_name` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the `contact_inquiries` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `user_id` on table `event_registration` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "event_registration_guest_email_event_id_key";

-- DropIndex
DROP INDEX "idx_posts_is_approved";

-- AlterTable
ALTER TABLE "event_registration" DROP COLUMN "guest_email",
DROP COLUMN "guest_first_name",
DROP COLUMN "guest_last_name",
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "category" SET DATA TYPE TEXT,
ALTER COLUMN "read_time" SET DATA TYPE TEXT,
ALTER COLUMN "short_desc" SET DATA TYPE TEXT,
ALTER COLUMN "title" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "contact_inquiries";
