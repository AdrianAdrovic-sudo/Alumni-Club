/*
  Warnings:

  - You are about to drop the column `check_in` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the column `event_id` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the column `registered_at` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the column `rsvp` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `event_registration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId,userId]` on the table `event_registration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId,guestEmail]` on the table `event_registration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventId` to the `event_registration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event_registration" DROP CONSTRAINT "event_registration_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_registration" DROP CONSTRAINT "event_registration_user_id_fkey";

-- DropIndex
DROP INDEX "event_registration_user_id_event_id_key";

-- DropIndex
DROP INDEX "idx_eventreg_event";

-- DropIndex
DROP INDEX "idx_eventreg_user";

-- AlterTable
ALTER TABLE "event_registration" DROP COLUMN "check_in",
DROP COLUMN "event_id",
DROP COLUMN "notes",
DROP COLUMN "registered_at",
DROP COLUMN "rsvp",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "eventId" INTEGER NOT NULL,
ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "guestFirstName" TEXT,
ADD COLUMN     "guestLastName" TEXT,
ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "event_registration_eventId_userId_key" ON "event_registration"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "event_registration_eventId_guestEmail_key" ON "event_registration"("eventId", "guestEmail");

-- AddForeignKey
ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
