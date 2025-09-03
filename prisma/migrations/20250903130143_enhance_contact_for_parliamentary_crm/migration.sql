-- CreateEnum
CREATE TYPE "public"."MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED', 'CIVIL_UNION');

-- CreateEnum
CREATE TYPE "public"."EducationLevel" AS ENUM ('ILLITERATE', 'INCOMPLETE_ELEMENTARY', 'COMPLETE_ELEMENTARY', 'INCOMPLETE_HIGH_SCHOOL', 'COMPLETE_HIGH_SCHOOL', 'INCOMPLETE_COLLEGE', 'COMPLETE_COLLEGE', 'GRADUATE', 'MASTERS', 'DOCTORATE');

-- CreateEnum
CREATE TYPE "public"."ParticipationLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "public"."AgeGroup" AS ENUM ('UNDER_18', 'AGE_18_25', 'AGE_26_35', 'AGE_36_45', 'AGE_46_55', 'AGE_56_65', 'OVER_65');

-- CreateEnum
CREATE TYPE "public"."SocialClass" AS ENUM ('CLASS_A', 'CLASS_B', 'CLASS_C', 'CLASS_D', 'CLASS_E');

-- CreateEnum
CREATE TYPE "public"."UrbanRural" AS ENUM ('URBAN', 'RURAL', 'PERIURBAN');

-- AlterTable
ALTER TABLE "public"."Contact" ADD COLUMN     "ageGroup" "public"."AgeGroup",
ADD COLUMN     "childrenCount" INTEGER,
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "dependents" INTEGER,
ADD COLUMN     "education" "public"."EducationLevel",
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "income" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "isVoter" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "maritalStatus" "public"."MaritalStatus",
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "participationLevel" "public"."ParticipationLevel",
ADD COLUMN     "politicalInterests" TEXT[],
ADD COLUMN     "politicalParty" TEXT,
ADD COLUMN     "rg" TEXT,
ADD COLUMN     "socialClass" "public"."SocialClass",
ADD COLUMN     "spouseName" TEXT,
ADD COLUMN     "urbanRural" "public"."UrbanRural",
ADD COLUMN     "voterId" TEXT,
ADD COLUMN     "votingHistory" TEXT[],
ADD COLUMN     "votingSection" TEXT,
ADD COLUMN     "votingZone" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- CreateIndex
CREATE INDEX "Contact_organizationId_cpf_idx" ON "public"."Contact"("organizationId", "cpf");

-- CreateIndex
CREATE INDEX "Contact_organizationId_voterId_idx" ON "public"."Contact"("organizationId", "voterId");

-- CreateIndex
CREATE INDEX "Contact_organizationId_city_state_idx" ON "public"."Contact"("organizationId", "city", "state");

-- CreateIndex
CREATE INDEX "Contact_organizationId_politicalParty_idx" ON "public"."Contact"("organizationId", "politicalParty");
