-- DropIndex
DROP INDEX "event_registration_user_id_event_id_key";

-- AlterTable
ALTER TABLE "event_registration" ADD COLUMN     "guest_email" TEXT,
ADD COLUMN     "guest_first_name" TEXT,
ADD COLUMN     "guest_last_name" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL;
