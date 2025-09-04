/*
  Warnings:

  - You are about to drop the column `directoryId` on the `Demand` table. All the data in the column will be lost.
  - You are about to drop the column `parliamentaryOfficeId` on the `Demand` table. All the data in the column will be lost.
  - You are about to drop the column `physicalOfficeId` on the `Demand` table. All the data in the column will be lost.
  - You are about to drop the column `serviceCenterId` on the `Demand` table. All the data in the column will be lost.
  - You are about to drop the `directory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `directory_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parliamentary_office` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parliamentary_office_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `physical_office` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `physical_office_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_center` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_center_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."OfficeType" AS ENUM ('MAIN_OFFICE', 'REGIONAL_OFFICE', 'SERVICE_CENTER', 'SPECIALIZED_UNIT', 'CONSULTATION_ROOM', 'EMERGENCY_ROOM', 'WARD', 'SURGERY_ROOM', 'LABORATORY', 'IMAGING_CENTER', 'BRANCH', 'DEPARTMENT', 'DIVISION', 'UNIT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."OfficeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "public"."OfficeRole" AS ENUM ('ADMIN', 'MANAGER', 'SUPERVISOR', 'STAFF', 'SPECIALIST', 'RECEPTIONIST', 'INTERN', 'VOLUNTEER', 'OTHER');

-- DropForeignKey
ALTER TABLE "public"."Demand" DROP CONSTRAINT "Demand_directoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Demand" DROP CONSTRAINT "Demand_parliamentaryOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Demand" DROP CONSTRAINT "Demand_physicalOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Demand" DROP CONSTRAINT "Demand_serviceCenterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."directory" DROP CONSTRAINT "directory_parentDirectoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."directory" DROP CONSTRAINT "directory_parliamentaryOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."directory_user" DROP CONSTRAINT "directory_user_directoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."parliamentary_office" DROP CONSTRAINT "parliamentary_office_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."parliamentary_office_user" DROP CONSTRAINT "parliamentary_office_user_parliamentaryOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."physical_office" DROP CONSTRAINT "physical_office_parliamentaryOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."physical_office_user" DROP CONSTRAINT "physical_office_user_physicalOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."service_center" DROP CONSTRAINT "service_center_parliamentaryOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."service_center_user" DROP CONSTRAINT "service_center_user_serviceCenterId_fkey";

-- AlterTable
ALTER TABLE "public"."Demand" DROP COLUMN "directoryId",
DROP COLUMN "parliamentaryOfficeId",
DROP COLUMN "physicalOfficeId",
DROP COLUMN "serviceCenterId",
ADD COLUMN     "officeId" TEXT;

-- DropTable
DROP TABLE "public"."directory";

-- DropTable
DROP TABLE "public"."directory_user";

-- DropTable
DROP TABLE "public"."parliamentary_office";

-- DropTable
DROP TABLE "public"."parliamentary_office_user";

-- DropTable
DROP TABLE "public"."physical_office";

-- DropTable
DROP TABLE "public"."physical_office_user";

-- DropTable
DROP TABLE "public"."service_center";

-- DropTable
DROP TABLE "public"."service_center_user";

-- DropEnum
DROP TYPE "public"."DirectoryRole";

-- DropEnum
DROP TYPE "public"."DirectoryStatus";

-- DropEnum
DROP TYPE "public"."ParliamentaryOfficeRole";

-- DropEnum
DROP TYPE "public"."ParliamentaryOfficeStatus";

-- DropEnum
DROP TYPE "public"."PhysicalOfficeRole";

-- DropEnum
DROP TYPE "public"."PhysicalOfficeStatus";

-- DropEnum
DROP TYPE "public"."ServiceCenterRole";

-- DropEnum
DROP TYPE "public"."ServiceCenterStatus";

-- DropEnum
DROP TYPE "public"."ServiceCenterType";

-- CreateTable
CREATE TABLE "public"."office" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."OfficeType" NOT NULL,
    "status" "public"."OfficeStatus" NOT NULL DEFAULT 'ACTIVE',
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "neighborhood" TEXT,
    "complement" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "capacity" INTEGER,
    "maxUsers" INTEGER NOT NULL DEFAULT 10,
    "openingHours" TEXT,
    "isOpenOnWeekends" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."office_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "role" "public"."OfficeRole" NOT NULL DEFAULT 'STAFF',
    "permissions" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accessStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "office_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "office_organizationId_type_idx" ON "public"."office"("organizationId", "type");

-- CreateIndex
CREATE INDEX "office_organizationId_status_idx" ON "public"."office"("organizationId", "status");

-- CreateIndex
CREATE INDEX "office_organizationId_city_state_idx" ON "public"."office"("organizationId", "city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "office_organizationId_code_key" ON "public"."office"("organizationId", "code");

-- CreateIndex
CREATE INDEX "office_user_officeId_role_idx" ON "public"."office_user"("officeId", "role");

-- CreateIndex
CREATE INDEX "office_user_userId_isActive_idx" ON "public"."office_user"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "office_user_userId_officeId_key" ON "public"."office_user"("userId", "officeId");

-- AddForeignKey
ALTER TABLE "public"."Demand" ADD CONSTRAINT "Demand_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "public"."office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."office" ADD CONSTRAINT "office_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."office_user" ADD CONSTRAINT "office_user_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "public"."office"("id") ON DELETE CASCADE ON UPDATE CASCADE;
