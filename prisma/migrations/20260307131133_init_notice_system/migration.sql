-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('PASS', 'FAIL');

-- CreateEnum
CREATE TYPE "ExamLevel" AS ENUM ('DAWRA', 'HIFZ', 'TAKMIL', 'OTHER');

-- CreateTable
CREATE TABLE "notices" (
    "id" TEXT NOT NULL,
    "title_bn" TEXT NOT NULL,
    "body_bn" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isPdf" BOOLEAN NOT NULL DEFAULT false,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "level" "ExamLevel" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" TEXT NOT NULL,
    "roll" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "studentName_bn" TEXT NOT NULL,
    "status" "ResultStatus" NOT NULL,
    "grade" TEXT,
    "examId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "madrasas" (
    "id" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "establishedYear" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "madrasas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stats" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value_bn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notices_publishedAt_idx" ON "notices"("publishedAt");

-- CreateIndex
CREATE INDEX "notices_isPublished_idx" ON "notices"("isPublished");

-- CreateIndex
CREATE INDEX "notices_deletedAt_idx" ON "notices"("deletedAt");

-- CreateIndex
CREATE INDEX "notices_isPublished_publishedAt_deletedAt_idx" ON "notices"("isPublished", "publishedAt", "deletedAt");

-- CreateIndex
CREATE INDEX "exams_year_idx" ON "exams"("year");

-- CreateIndex
CREATE INDEX "exams_level_idx" ON "exams"("level");

-- CreateIndex
CREATE INDEX "exams_isActive_idx" ON "exams"("isActive");

-- CreateIndex
CREATE INDEX "exams_year_level_idx" ON "exams"("year", "level");

-- CreateIndex
CREATE INDEX "results_roll_idx" ON "results"("roll");

-- CreateIndex
CREATE INDEX "results_registrationNo_idx" ON "results"("registrationNo");

-- CreateIndex
CREATE INDEX "results_roll_registrationNo_idx" ON "results"("roll", "registrationNo");

-- CreateIndex
CREATE INDEX "results_examId_idx" ON "results"("examId");

-- CreateIndex
CREATE INDEX "results_examId_roll_idx" ON "results"("examId", "roll");

-- CreateIndex
CREATE INDEX "results_examId_registrationNo_idx" ON "results"("examId", "registrationNo");

-- CreateIndex
CREATE UNIQUE INDEX "madrasas_registrationNo_key" ON "madrasas"("registrationNo");

-- CreateIndex
CREATE INDEX "madrasas_district_idx" ON "madrasas"("district");

-- CreateIndex
CREATE INDEX "madrasas_division_idx" ON "madrasas"("division");

-- CreateIndex
CREATE INDEX "madrasas_isActive_idx" ON "madrasas"("isActive");

-- CreateIndex
CREATE INDEX "madrasas_district_division_idx" ON "madrasas"("district", "division");

-- CreateIndex
CREATE INDEX "madrasas_isActive_district_idx" ON "madrasas"("isActive", "district");

-- CreateIndex
CREATE INDEX "madrasas_deletedAt_idx" ON "madrasas"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "stats_key_key" ON "stats"("key");

-- CreateIndex
CREATE INDEX "stats_order_idx" ON "stats"("order");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
