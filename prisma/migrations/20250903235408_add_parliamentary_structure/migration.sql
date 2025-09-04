-- CreateEnum
CREATE TYPE "public"."ParliamentaryOfficeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "public"."DirectoryStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."PhysicalOfficeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "public"."ServiceCenterStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "public"."ParliamentaryOfficeRole" AS ENUM ('ADMIN', 'MANAGER', 'STAFF', 'INTERN', 'VOLUNTEER');

-- CreateEnum
CREATE TYPE "public"."DirectoryRole" AS ENUM ('DIRECTOR', 'MANAGER', 'MEMBER', 'INTERN');

-- CreateEnum
CREATE TYPE "public"."PhysicalOfficeRole" AS ENUM ('MANAGER', 'STAFF', 'RECEPTIONIST', 'INTERN');

-- CreateEnum
CREATE TYPE "public"."ServiceCenterRole" AS ENUM ('MANAGER', 'SPECIALIST', 'STAFF', 'RECEPTIONIST', 'INTERN');

-- CreateEnum
CREATE TYPE "public"."ServiceCenterType" AS ENUM ('CITIZEN_SERVICE', 'LEGAL_ASSISTANCE', 'SOCIAL_ASSISTANCE', 'HEALTH_CARE', 'EDUCATION', 'INFRASTRUCTURE', 'ENVIRONMENT', 'CULTURE', 'SPORTS', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Demand" ADD COLUMN     "directoryId" TEXT,
ADD COLUMN     "parliamentaryOfficeId" TEXT,
ADD COLUMN     "physicalOfficeId" TEXT,
ADD COLUMN     "serviceCenterId" TEXT;

-- CreateTable
CREATE TABLE "public"."parliamentary_office" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."ParliamentaryOfficeStatus" NOT NULL DEFAULT 'ACTIVE',
    "parliamentarianName" TEXT NOT NULL,
    "parliamentarianParty" TEXT,
    "parliamentarianPosition" TEXT,
    "legislature" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "maxUsers" INTEGER NOT NULL DEFAULT 10,
    "isMainOffice" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "parliamentary_office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."directory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."DirectoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "parentDirectoryId" TEXT,
    "maxUsers" INTEGER NOT NULL DEFAULT 5,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "parliamentaryOfficeId" TEXT NOT NULL,

    CONSTRAINT "directory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."physical_office" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."PhysicalOfficeStatus" NOT NULL DEFAULT 'ACTIVE',
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "neighborhood" TEXT,
    "complement" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "openingHours" TEXT,
    "isOpenOnWeekends" BOOLEAN NOT NULL DEFAULT false,
    "maxUsers" INTEGER NOT NULL DEFAULT 8,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "parliamentaryOfficeId" TEXT NOT NULL,

    CONSTRAINT "physical_office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."service_center" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."ServiceCenterStatus" NOT NULL DEFAULT 'ACTIVE',
    "serviceType" "public"."ServiceCenterType" NOT NULL,
    "specialties" TEXT[],
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "openingHours" TEXT,
    "isOpenOnWeekends" BOOLEAN NOT NULL DEFAULT false,
    "maxUsers" INTEGER NOT NULL DEFAULT 6,
    "maxConcurrentDemands" INTEGER NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "parliamentaryOfficeId" TEXT NOT NULL,

    CONSTRAINT "service_center_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."parliamentary_office_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parliamentaryOfficeId" TEXT NOT NULL,
    "role" "public"."ParliamentaryOfficeRole" NOT NULL DEFAULT 'STAFF',
    "permissions" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accessStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "parliamentary_office_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."directory_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "directoryId" TEXT NOT NULL,
    "role" "public"."DirectoryRole" NOT NULL DEFAULT 'MEMBER',
    "permissions" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accessStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "directory_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."physical_office_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "physicalOfficeId" TEXT NOT NULL,
    "role" "public"."PhysicalOfficeRole" NOT NULL DEFAULT 'STAFF',
    "permissions" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accessStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "physical_office_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."service_center_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceCenterId" TEXT NOT NULL,
    "role" "public"."ServiceCenterRole" NOT NULL DEFAULT 'STAFF',
    "permissions" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accessStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "service_center_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "parliamentary_office_organizationId_status_idx" ON "public"."parliamentary_office"("organizationId", "status");

-- CreateIndex
CREATE INDEX "parliamentary_office_organizationId_parliamentarianName_idx" ON "public"."parliamentary_office"("organizationId", "parliamentarianName");

-- CreateIndex
CREATE UNIQUE INDEX "parliamentary_office_organizationId_code_key" ON "public"."parliamentary_office"("organizationId", "code");

-- CreateIndex
CREATE INDEX "directory_parliamentaryOfficeId_status_idx" ON "public"."directory"("parliamentaryOfficeId", "status");

-- CreateIndex
CREATE INDEX "directory_parliamentaryOfficeId_parentDirectoryId_idx" ON "public"."directory"("parliamentaryOfficeId", "parentDirectoryId");

-- CreateIndex
CREATE UNIQUE INDEX "directory_parliamentaryOfficeId_code_key" ON "public"."directory"("parliamentaryOfficeId", "code");

-- CreateIndex
CREATE INDEX "physical_office_parliamentaryOfficeId_status_idx" ON "public"."physical_office"("parliamentaryOfficeId", "status");

-- CreateIndex
CREATE INDEX "physical_office_parliamentaryOfficeId_city_state_idx" ON "public"."physical_office"("parliamentaryOfficeId", "city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "physical_office_parliamentaryOfficeId_code_key" ON "public"."physical_office"("parliamentaryOfficeId", "code");

-- CreateIndex
CREATE INDEX "service_center_parliamentaryOfficeId_status_idx" ON "public"."service_center"("parliamentaryOfficeId", "status");

-- CreateIndex
CREATE INDEX "service_center_parliamentaryOfficeId_serviceType_idx" ON "public"."service_center"("parliamentaryOfficeId", "serviceType");

-- CreateIndex
CREATE UNIQUE INDEX "service_center_parliamentaryOfficeId_code_key" ON "public"."service_center"("parliamentaryOfficeId", "code");

-- CreateIndex
CREATE INDEX "parliamentary_office_user_parliamentaryOfficeId_role_idx" ON "public"."parliamentary_office_user"("parliamentaryOfficeId", "role");

-- CreateIndex
CREATE INDEX "parliamentary_office_user_userId_isActive_idx" ON "public"."parliamentary_office_user"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "parliamentary_office_user_userId_parliamentaryOfficeId_key" ON "public"."parliamentary_office_user"("userId", "parliamentaryOfficeId");

-- CreateIndex
CREATE INDEX "directory_user_directoryId_role_idx" ON "public"."directory_user"("directoryId", "role");

-- CreateIndex
CREATE INDEX "directory_user_userId_isActive_idx" ON "public"."directory_user"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "directory_user_userId_directoryId_key" ON "public"."directory_user"("userId", "directoryId");

-- CreateIndex
CREATE INDEX "physical_office_user_physicalOfficeId_role_idx" ON "public"."physical_office_user"("physicalOfficeId", "role");

-- CreateIndex
CREATE INDEX "physical_office_user_userId_isActive_idx" ON "public"."physical_office_user"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "physical_office_user_userId_physicalOfficeId_key" ON "public"."physical_office_user"("userId", "physicalOfficeId");

-- CreateIndex
CREATE INDEX "service_center_user_serviceCenterId_role_idx" ON "public"."service_center_user"("serviceCenterId", "role");

-- CreateIndex
CREATE INDEX "service_center_user_userId_isActive_idx" ON "public"."service_center_user"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "service_center_user_userId_serviceCenterId_key" ON "public"."service_center_user"("userId", "serviceCenterId");

-- AddForeignKey
ALTER TABLE "public"."Demand" ADD CONSTRAINT "Demand_parliamentaryOfficeId_fkey" FOREIGN KEY ("parliamentaryOfficeId") REFERENCES "public"."parliamentary_office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Demand" ADD CONSTRAINT "Demand_directoryId_fkey" FOREIGN KEY ("directoryId") REFERENCES "public"."directory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Demand" ADD CONSTRAINT "Demand_physicalOfficeId_fkey" FOREIGN KEY ("physicalOfficeId") REFERENCES "public"."physical_office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Demand" ADD CONSTRAINT "Demand_serviceCenterId_fkey" FOREIGN KEY ("serviceCenterId") REFERENCES "public"."service_center"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parliamentary_office" ADD CONSTRAINT "parliamentary_office_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."directory" ADD CONSTRAINT "directory_parentDirectoryId_fkey" FOREIGN KEY ("parentDirectoryId") REFERENCES "public"."directory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."directory" ADD CONSTRAINT "directory_parliamentaryOfficeId_fkey" FOREIGN KEY ("parliamentaryOfficeId") REFERENCES "public"."parliamentary_office"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."physical_office" ADD CONSTRAINT "physical_office_parliamentaryOfficeId_fkey" FOREIGN KEY ("parliamentaryOfficeId") REFERENCES "public"."parliamentary_office"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."service_center" ADD CONSTRAINT "service_center_parliamentaryOfficeId_fkey" FOREIGN KEY ("parliamentaryOfficeId") REFERENCES "public"."parliamentary_office"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parliamentary_office_user" ADD CONSTRAINT "parliamentary_office_user_parliamentaryOfficeId_fkey" FOREIGN KEY ("parliamentaryOfficeId") REFERENCES "public"."parliamentary_office"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."directory_user" ADD CONSTRAINT "directory_user_directoryId_fkey" FOREIGN KEY ("directoryId") REFERENCES "public"."directory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."physical_office_user" ADD CONSTRAINT "physical_office_user_physicalOfficeId_fkey" FOREIGN KEY ("physicalOfficeId") REFERENCES "public"."physical_office"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."service_center_user" ADD CONSTRAINT "service_center_user_serviceCenterId_fkey" FOREIGN KEY ("serviceCenterId") REFERENCES "public"."service_center"("id") ON DELETE CASCADE ON UPDATE CASCADE;
