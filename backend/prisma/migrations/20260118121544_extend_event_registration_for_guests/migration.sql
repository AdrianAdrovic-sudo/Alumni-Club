/*
  Warnings:

  - You are about to drop the column `createdAt` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the column `guestEmail` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the column `guestFirstName` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the column `guestLastName` on the `event_registration` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `event_registration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,event_id]` on the table `event_registration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guest_email,event_id]` on the table `event_registration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_id` to the `event_registration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event_registration" DROP CONSTRAINT "event_registration_eventId_fkey";

-- DropForeignKey
ALTER TABLE "event_registration" DROP CONSTRAINT "event_registration_userId_fkey";

-- DropIndex
DROP INDEX "event_registration_eventId_guestEmail_key";

-- DropIndex
DROP INDEX "event_registration_eventId_userId_key";

-- AlterTable
ALTER TABLE "event_registration" DROP COLUMN "createdAt",
DROP COLUMN "eventId",
DROP COLUMN "guestEmail",
DROP COLUMN "guestFirstName",
DROP COLUMN "guestLastName",
DROP COLUMN "userId",
ADD COLUMN     "check_in" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "guest_email" TEXT,
ADD COLUMN     "guest_first_name" TEXT,
ADD COLUMN     "guest_last_name" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "registered_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "rsvp" "RSVPStatus" NOT NULL DEFAULT 'Interested',
ADD COLUMN     "user_id" INTEGER;

-- CreateIndex
CREATE INDEX "idx_eventreg_event" ON "event_registration"("event_id");

-- CreateIndex
CREATE INDEX "idx_eventreg_user" ON "event_registration"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_registration_user_id_event_id_key" ON "event_registration"("user_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_registration_guest_email_event_id_key" ON "event_registration"("guest_email", "event_id");

-- AddForeignKey
ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
