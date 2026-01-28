-- CreateTable
CREATE TABLE "theses" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "student_first_name" VARCHAR(100) NOT NULL,
    "student_last_name" VARCHAR(100) NOT NULL,
    "mentor_first_name" VARCHAR(100) NOT NULL,
    "mentor_last_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "defense_date" DATE NOT NULL,
    "year" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "document_url" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "theses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_theses_year" ON "theses"("year");

-- CreateIndex
CREATE INDEX "idx_theses_type" ON "theses"("type");
