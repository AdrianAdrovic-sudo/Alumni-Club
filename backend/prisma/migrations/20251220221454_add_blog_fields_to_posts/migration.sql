-- CreateTable
CREATE TABLE "contact_inquiries" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(6),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "contact_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_contact_inquiries_created_at" ON "contact_inquiries"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_contact_inquiries_deleted" ON "contact_inquiries"("deleted");

-- CreateIndex
CREATE INDEX "idx_posts_is_approved" ON "posts"("is_approved");
